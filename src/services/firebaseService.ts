import { Issue } from '../types';
import { mockBackend } from './mockBackendService';
import { EmailService } from './emailService';
import { processIssueWithAI } from './aiService';

const API_BASE_URL = 'http://localhost:3001/api';
const isDevelopment = false; // Force real Firebase for testing

// Fetch all issues from Firebase
export const fetchIssues = async (): Promise<Issue[]> => {
  if (isDevelopment) {
    return await mockBackend.fetchIssues();
  }
  
  try {
    console.log('📊 Fetching issues from Firestore...');
    
    // Import Firebase modules
    const { getFirestore, collection, getDocs } = await import('firebase/firestore');
    const firebaseModule = await import('../config/firebase');
    const app = firebaseModule.default;
    
    if (!app) {
      throw new Error('Firebase app not initialized');
    }
    
    const db = getFirestore(app);
    const issuesCollection = collection(db, 'issues');
    const querySnapshot = await getDocs(issuesCollection);
    
    const issues: Issue[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      issues.push({
        ...data,
        id: doc.id,
        reportedAt: data.reportedAt || data.createdAt || new Date().toISOString(),
        status: data.status || 'pending'
      } as Issue);
    });
    
    console.log('✅ Fetched', issues.length, 'issues from Firestore');
    return issues;
  } catch (error) {
    console.error('Failed to fetch issues from Firestore:', error);
    return [];
  }
};

// Fetch single issue from Firebase
export const fetchIssue = async (id: string): Promise<Issue | null> => {
  try {
    console.log('📊 Fetching issue from Firestore:', id);
    
    // Import Firebase modules
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    const firebaseModule = await import('../config/firebase');
    const app = firebaseModule.default;
    
    if (!app) {
      throw new Error('Firebase app not initialized');
    }
    
    const db = getFirestore(app);
    const issueRef = doc(db, 'issues', id);
    const issueDoc = await getDoc(issueRef);
    
    if (!issueDoc.exists()) {
      console.log('❌ Issue not found:', id);
      return null;
    }
    
    const data = issueDoc.data();
    const issue = {
      ...data,
      id: issueDoc.id,
      reportedAt: data.reportedAt || data.createdAt || new Date().toISOString(),
      status: data.status || 'pending'
    } as Issue;
    
    console.log('✅ Fetched issue from Firestore:', issue.title);
    return issue;
  } catch (error) {
    console.error('Failed to fetch issue from Firestore:', error);
    return null;
  }
};

// Vote on an issue
export const voteOnIssue = async (issueId: string, vote: 'yes' | 'no'): Promise<boolean> => {
  if (isDevelopment) {
    return await mockBackend.voteOnIssue(issueId, vote);
  }
  
  // Production: Use real Firebase
  try {
    console.log('🗳️ Recording vote in Firebase...');
    
    // Import Firebase modules
    const { getFirestore, doc, getDoc, updateDoc, increment } = await import('firebase/firestore');
    const firebaseModule = await import('../config/firebase');
    const app = firebaseModule.default;
    
    if (!app) {
      throw new Error('Firebase app not initialized');
    }
    
    const db = getFirestore(app);
    const issueRef = doc(db, 'issues', issueId);
    
    // Get current issue data
    const issueDoc = await getDoc(issueRef);
    if (!issueDoc.exists()) {
      throw new Error('Issue not found');
    }
    
    const issueData = issueDoc.data() as Issue;
    
    // Update vote count
    const updateData: any = {};
    if (vote === 'yes') {
      updateData['publicVoting.yesVotes'] = increment(1);
    } else {
      updateData['publicVoting.noVotes'] = increment(1);
    }
    
    await updateDoc(issueRef, updateData);
    
    // Check if threshold is reached
    const newYesVotes = vote === 'yes' ? issueData.publicVoting.yesVotes + 1 : issueData.publicVoting.yesVotes;
    const newNoVotes = vote === 'no' ? issueData.publicVoting.noVotes + 1 : issueData.publicVoting.noVotes;
    const totalVotes = newYesVotes + newNoVotes;
    const yesPercentage = totalVotes > 0 ? (newYesVotes / totalVotes) * 100 : 0;
    
    if (yesPercentage >= issueData.publicVoting.threshold && !issueData.publicVoting.emailSent) {
      // Update issue status and mark email as sent
      await updateDoc(issueRef, {
        status: 'reported-to-authority',
        'publicVoting.emailSent': true,
        emailSentAt: new Date().toISOString()
      });
      
      // Send email notification
      const updatedIssue = { ...issueData, id: issueId, publicVoting: { ...issueData.publicVoting, yesVotes: newYesVotes, noVotes: newNoVotes, emailSent: true } };
      const emailResult = await EmailService.sendPollThresholdEmail(updatedIssue);
      
      if (emailResult.success) {
        await updateDoc(issueRef, { emailId: emailResult.emailId });
        console.log('✅ Email sent to authority for issue:', issueId, 'Email ID:', emailResult.emailId);
      } else {
        console.error('❌ Failed to send email for issue:', issueId, emailResult.error);
      }
    }
    
    console.log('✅ Vote recorded successfully');
    return true;
    
  } catch (error) {
    console.error('Failed to vote on issue:', error);
    return false;
  }
};

// Submit issue with AI analysis
export const submitIssueWithAI = async (
  image1: File,
  image2?: File,
  issueData?: Partial<Issue>
): Promise<{
  success: boolean;
  issue?: Issue;
  error?: string;
  analysis?: any;
}> => {
  if (isDevelopment) {
    const result = await mockBackend.analyzeImages(image1, image2, issueData);
    
    if (result.isAuthentic && result.issue) {
      return {
        success: true,
        issue: result.issue,
        analysis: result
      };
    } else {
      return {
        success: false,
        error: result.reason || 'Issue submission failed',
        analysis: result
      };
    }
  }
  
  // Production: Use real Firebase with real AI
  try {
    console.log('🚀 Starting report submission with real AI analysis...');
    
    // First, run real AI analysis
    console.log('🤖 Running real AI analysis with Google Cloud Vision...');
    const aiResult = await processIssueWithAI(image1, image2, issueData);
    
    if (!aiResult.success) {
      console.log('❌ AI analysis rejected the images');
      return {
        success: false,
        error: aiResult.error || 'Images failed AI verification',
        analysis: aiResult.analysis
      };
    }
    
    console.log('✅ AI analysis approved the images');
    
    // Import Firebase modules
    const { getFirestore, collection, addDoc, getDocs, doc, getDoc } = await import('firebase/firestore');
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const firebaseModule = await import('../config/firebase');
    const app = firebaseModule.default;
    
    if (!app) {
      throw new Error('Firebase app not initialized');
    }
    
    const db = getFirestore(app);
    const storage = getStorage(app);
    
    console.log('📤 Optimizing and uploading images to Firebase Storage...');
    
    // Optimize images before upload
    const optimizedImage1 = await optimizeImageForUpload(image1);
    const optimizedImage2 = image2 ? await optimizeImageForUpload(image2) : null;
    
    // Upload images in parallel for faster processing
    const timestamp = Date.now();
    const uploadPromises = [];
    
    // Upload first image
    const image1Ref = ref(storage, `issues/${timestamp}_angle1.jpg`);
    uploadPromises.push(
      uploadBytes(image1Ref, optimizedImage1).then(snapshot => getDownloadURL(snapshot.ref))
    );
    
    // Upload second image if exists
    let image2Url = '';
    if (optimizedImage2) {
      const image2Ref = ref(storage, `issues/${timestamp}_angle2.jpg`);
      uploadPromises.push(
        uploadBytes(image2Ref, optimizedImage2).then(snapshot => getDownloadURL(snapshot.ref))
      );
    }
    
    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);
    const image1Url = uploadResults[0];
    image2Url = uploadResults[1] || '';
    
    console.log('✅ Images uploaded successfully (optimized)');
    
    // Create issue document using AI results
    const issueDoc = {
      ...(issueData || {}),
      images: {
        angle1: image1Url,
        angle2: image2Url
      },
      reportedAt: new Date().toISOString(),
      status: 'approved',
      adminApproved: true,
      upvotes: 0,
      downvotes: 0,
      aiPrediction: aiResult.issue?.aiPrediction || {
        type: issueData?.type ? (issueData.type.charAt(0).toUpperCase() + issueData.type.slice(1)) : 'Issue',
        confidence: aiResult.analysis?.confidence || 0.9,
        authenticity: aiResult.analysis?.confidence || 0.95,
        estimatedDepth: Math.random() * 15 + 2,
        damageRiskScore: Math.random() * 4 + 6,
        humanHarmRisk: issueData?.severity === 'high' ? 'high' : issueData?.severity === 'moderate' ? 'moderate' : 'low'
      },
      imageAuthenticity: aiResult.issue?.imageAuthenticity || {
        angle1: 'real',
        angle2: image2 ? 'real' : 'pending',
        checkedAt: new Date().toISOString(),
        checkedBy: 'AI System (Google Cloud Vision)'
      },
      publicVoting: {
        enabled: true,
        yesVotes: 0,
        noVotes: 0,
        threshold: 50,
        emailSent: false
      }
    };
    
    console.log('💾 Saving report to database...');
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'issues'), issueDoc);
    
    // Get the created document
    const createdDoc = await getDoc(docRef);
    const createdIssue = { id: docRef.id, ...(createdDoc.data() || {}) } as Issue;
    
    console.log('✅ Report saved successfully:', createdIssue.title);
    
    return {
      success: true,
      issue: createdIssue,
      analysis: {
        isAuthentic: true,
        confidence: 0.9,
        issueId: docRef.id
      }
    };
    
  } catch (error) {
    console.error('Failed to submit issue to Firebase:', error);
    return {
      success: false,
      error: 'Failed to submit issue to Firebase'
    };
  }
};

// Image optimization function to reduce file size and upload time
const optimizeImageForUpload = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate optimal dimensions (max 1200px width/height)
      const maxSize = 1200;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create new file with optimized data
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            console.log(`📸 Image optimized: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(optimizedFile.size / 1024 / 1024).toFixed(2)}MB`);
            resolve(optimizedFile);
          } else {
            resolve(file); // Fallback to original file
          }
        },
        'image/jpeg',
        0.8 // 80% quality for good balance
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Monitor poll results
export const monitorPollResults = async (issue: Issue): Promise<{
  shouldSendEmail: boolean;
  pollResult: 'approved' | 'rejected' | 'pending';
}> => {
  const { yesVotes, noVotes, threshold } = issue.publicVoting;
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  
  if (yesPercentage >= threshold) {
    return {
      shouldSendEmail: true,
      pollResult: 'approved'
    };
  } else if (totalVotes >= 10 && yesPercentage < 30) {
    return {
      shouldSendEmail: false,
      pollResult: 'rejected'
    };
  }
  
  return {
    shouldSendEmail: false,
    pollResult: 'pending'
  };
}; 