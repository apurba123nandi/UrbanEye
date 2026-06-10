const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const { db, bucket } = require('./firebase-config');
const AIAnalysisService = require('./aiAnalysis');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize AI Analysis Service
const aiService = new AIAnalysisService();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Email transporter (using Gmail for demo)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'UrbanEye Hyderabad Server is running' });
});

// Email endpoint for sending reports to authorities
app.post('/api/send-report', async (req, res) => {
  try {
    const { issueId } = req.body;
    
    if (!issueId) {
      return res.status(400).json({ error: 'Issue ID is required' });
    }

    // Get issue from Firebase
    const issueDoc = await db.collection('issues').doc(issueId).get();
    
    if (!issueDoc.exists) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const issue = issueDoc.data();
    
    // Prepare email content
    const emailContent = generateEmailContent(issue);
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'apurbaofficial8097@gmail.com',
      subject: `Road Issue Report - ${issue.title}`,
      html: emailContent
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    // Update issue status in Firebase
    await updateIssueInFirebase(issueId, {
      status: 'reported-to-authority',
      emailSentAt: new Date().toISOString(),
      emailId: info.messageId,
      'publicVoting.emailSent': true
    });
    
    console.log('Email sent successfully:', info.messageId);
    
    res.json({
      success: true,
      emailId: info.messageId,
      message: 'Report sent to authority successfully'
    });
    
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email to authority'
    });
  }
});

// AI image analysis endpoint with full analysis
app.post('/api/analyze-images', upload.array('images', 2), async (req, res) => {
  try {
    const images = req.files;
    const { issueData } = req.body;
    
    if (!images || images.length !== 2) {
      return res.status(400).json({ error: 'Two images are required' });
    }

    console.log('Starting AI analysis for images...');
    
    // Perform comprehensive AI analysis
    const analysis = await aiService.analyzeImages(images[0].buffer, images[1].buffer);
    
    // If images are authentic, save to Firebase and create issue
    if (analysis.isAuthentic) {
      try {
        // Upload images to Firebase Storage
        const imageUrls = await uploadImagesToFirebase(images);
        
        // Create issue in Firestore
        const issue = JSON.parse(issueData || '{}');
        const issueId = await createIssueInFirebase(issue, imageUrls, analysis);
        
        analysis.issueId = issueId;
        analysis.imageUrls = imageUrls;
        
        console.log('Issue created successfully:', issueId);
      } catch (firebaseError) {
        console.error('Firebase operation failed:', firebaseError);
        analysis.firebaseError = firebaseError.message;
      }
    }
    
    res.json(analysis);
    
  } catch (error) {
    console.error('AI analysis failed:', error);
    res.status(500).json({
      error: 'Failed to analyze images',
      details: error.message
    });
  }
});

// AI image verification endpoint (legacy)
app.post('/api/verify-images', upload.array('images', 2), async (req, res) => {
  try {
    const images = req.files;
    
    if (!images || images.length !== 2) {
      return res.status(400).json({ error: 'Two images are required' });
    }

    const analysis = await aiService.analyzeImages(images[0].buffer, images[1].buffer);
    
    res.json({
      isAuthentic: analysis.isAuthentic,
      confidence: analysis.confidence,
      reason: analysis.reason
    });
    
  } catch (error) {
    console.error('Image verification failed:', error);
    res.status(500).json({
      error: 'Failed to verify images'
    });
  }
});

// Firebase helper functions
async function uploadImagesToFirebase(images) {
  const imageUrls = [];
  
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const fileName = `issues/${Date.now()}_${i}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype
      }
    });
    
    // Get public URL
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });
    
    imageUrls.push(url);
  }
  
  return imageUrls;
}

async function createIssueInFirebase(issueData, imageUrls, analysis) {
  const issue = {
    ...issueData,
    images: {
      angle1: imageUrls[0],
      angle2: imageUrls[1]
    },
    aiAnalysis: analysis,
    status: 'approved',
    adminApproved: true,
    publicVoting: {
      enabled: true,
      yesVotes: 0,
      noVotes: 0,
      threshold: 50,
      emailSent: false
    },
    imageAuthenticity: {
      angle1: 'real',
      angle2: 'real',
      checkedAt: new Date().toISOString(),
      checkedBy: 'AI System'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const docRef = await db.collection('issues').add(issue);
  return docRef.id;
}

async function updateIssueInFirebase(issueId, updates) {
  await db.collection('issues').doc(issueId).update({
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

function generateEmailContent(issue) {
  const pollStats = issue.publicVoting;
  const yesPercentage = pollStats.yesVotes + pollStats.noVotes > 0 
    ? ((pollStats.yesVotes / (pollStats.yesVotes + pollStats.noVotes)) * 100).toFixed(1)
    : '0';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-left: 10px; }
        .stats { background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚧 Road Issue Report - UrbanEye Hyderabad</h1>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>Issue Details</h2>
            <p><span class="label">Title:</span><span class="value">${issue.title}</span></p>
            <p><span class="label">Description:</span><span class="value">${issue.description}</span></p>
            <p><span class="label">Type:</span><span class="value">${issue.type}</span></p>
            <p><span class="label">Severity:</span><span class="value">${issue.severity} (Score: ${issue.severityScore}/10)</span></p>
            <p><span class="label">Location:</span><span class="value">${issue.location.address}</span></p>
            <p><span class="label">Coordinates:</span><span class="value">${issue.location.lat}, ${issue.location.lng}</span></p>
          </div>
          
          <div class="section">
            <h2>AI Assessment</h2>
            <p><span class="label">Issue Type:</span><span class="value">${issue.aiPrediction.type}</span></p>
            <p><span class="label">Confidence:</span><span class="value">${(issue.aiPrediction.confidence * 100).toFixed(1)}%</span></p>
            <p><span class="label">Estimated Depth:</span><span class="value">${issue.aiPrediction.estimatedDepth} cm</span></p>
            <p><span class="label">Damage Risk Score:</span><span class="value">${issue.aiPrediction.damageRiskScore}/10</span></p>
            <p><span class="label">Human Harm Risk:</span><span class="value">${issue.aiPrediction.humanHarmRisk}</span></p>
          </div>
          
          <div class="section">
            <h2>Community Poll Results</h2>
            <div class="stats">
              <p><span class="label">Yes Votes:</span><span class="value">${pollStats.yesVotes}</span></p>
              <p><span class="label">No Votes:</span><span class="value">${pollStats.noVotes}</span></p>
              <p><span class="label">Approval Rate:</span><span class="value">${yesPercentage}%</span></p>
              <p><span class="label">Total Votes:</span><span class="value">${pollStats.yesVotes + pollStats.noVotes}</span></p>
            </div>
            <p><strong>The community has approved this issue for official attention with ${yesPercentage}% approval rate.</strong></p>
          </div>
          
          <div class="section">
            <h2>Action Required</h2>
            <p>Please take necessary action to address this road issue in Hyderabad.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Best regards,<br>UrbanEye Hyderabad Team</p>
          <p>Report ID: ${issue.id}<br>Reported on: ${new Date(issue.reportedAt).toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Initialize AI service and start server
async function startServer() {
  try {
    await aiService.initialize();
    console.log('AI Analysis Service initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`UrbanEye Server running on port ${PORT}`);
      console.log(`Email endpoint: http://localhost:${PORT}/api/send-report`);
      console.log(`Image verification endpoint: http://localhost:${PORT}/api/verify-images`);
      console.log(`AI analysis endpoint: http://localhost:${PORT}/api/analyze-images`);
    });
  } catch (error) {
    console.error('Failed to initialize AI service:', error);
    process.exit(1);
  }
}

// Firebase endpoints for issue management
app.get('/api/issues', async (req, res) => {
  try {
    const snapshot = await db.collection('issues').orderBy('createdAt', 'desc').get();
    const issues = [];
    
    snapshot.forEach(doc => {
      issues.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(issues);
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

app.get('/api/issues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('issues').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Failed to fetch issue:', error);
    res.status(500).json({ error: 'Failed to fetch issue' });
  }
});

app.post('/api/issues/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 'yes' or 'no'
    
    if (!vote || !['yes', 'no'].includes(vote)) {
      return res.status(400).json({ error: 'Invalid vote' });
    }
    
    const docRef = db.collection('issues').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    const issue = doc.data();
    
    if (!issue.publicVoting.enabled) {
      return res.status(400).json({ error: 'Voting not enabled for this issue' });
    }
    
    // Update vote count
    const updateData = {};
    if (vote === 'yes') {
      updateData['publicVoting.yesVotes'] = issue.publicVoting.yesVotes + 1;
    } else {
      updateData['publicVoting.noVotes'] = issue.publicVoting.noVotes + 1;
    }
    
    await docRef.update(updateData);
    
    // Check if threshold is reached
    const newYesVotes = vote === 'yes' ? issue.publicVoting.yesVotes + 1 : issue.publicVoting.yesVotes;
    const newNoVotes = vote === 'no' ? issue.publicVoting.noVotes + 1 : issue.publicVoting.noVotes;
    const totalVotes = newYesVotes + newNoVotes;
    const yesPercentage = totalVotes > 0 ? (newYesVotes / totalVotes) * 100 : 0;
    
    if (yesPercentage >= issue.publicVoting.threshold && !issue.publicVoting.emailSent) {
      // Trigger email to authority
      try {
        const emailContent = generateEmailContent({
          ...issue,
          publicVoting: {
            ...issue.publicVoting,
            yesVotes: newYesVotes,
            noVotes: newNoVotes
          }
        });
        
        const mailOptions = {
          from: process.env.EMAIL_USER || 'your-email@gmail.com',
          to: 'apurbaofficial8097@gmail.com',
          subject: `Road Issue Report - ${issue.title}`,
          html: emailContent
        };
        
        const info = await transporter.sendMail(mailOptions);
        
        // Update issue status
        await docRef.update({
          status: 'reported-to-authority',
          emailSentAt: new Date().toISOString(),
          emailId: info.messageId,
          'publicVoting.emailSent': true
        });
        
        console.log('Email sent automatically for issue:', id);
      } catch (emailError) {
        console.error('Failed to send automatic email:', emailError);
      }
    }
    
    res.json({ success: true, message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Failed to record vote:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

startServer(); 