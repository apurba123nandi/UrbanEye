import { Issue } from '../types';

// Email Service for sending notifications to local authorities
export class EmailService {
  private static readonly FROM_EMAIL = 'hem_writess@gmail.com';
  private static readonly TO_EMAIL = 'apurbaofficial8097@gmail.com';
  private static readonly AUTHORITY_NAME = 'Local Authority';
  private static readonly APP_NAME = 'UrbanEye Hyderabad';

  // Send email notification when poll threshold is reached
  static async sendPollThresholdEmail(issue: Issue): Promise<{
    success: boolean;
    emailId?: string;
    error?: string;
  }> {
    try {
      console.log('📧 Sending poll threshold email to authority...');
      
      const emailData = {
        from: this.FROM_EMAIL,
        to: this.TO_EMAIL,
        subject: `🚨 URGENT: Road Issue Requires Immediate Attention - ${issue.title}`,
        html: this.generatePollThresholdEmailHTML(issue),
        text: this.generatePollThresholdEmailText(issue)
      };

      // In development, simulate email sending
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Development Mode - Email would be sent:', emailData);
        
        // Simulate email delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          emailId: `dev_email_${Date.now()}`
        };
      }

      // In production, use a real email service
      // You can integrate with services like:
      // - SendGrid
      // - Nodemailer with Gmail SMTP
      // - AWS SES
      // - Firebase Functions with Nodemailer
      
      const response = await this.sendEmailViaService(emailData);
      
      console.log('✅ Email sent successfully:', response);
      
      return {
        success: true,
        emailId: response.emailId
      };
      
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return {
        success: false,
        error: 'Failed to send email notification'
      };
    }
  }

  // Generate HTML email content
  private static generatePollThresholdEmailHTML(issue: Issue): string {
    const totalVotes = issue.publicVoting.yesVotes + issue.publicVoting.noVotes;
    const yesPercentage = totalVotes > 0 ? (issue.publicVoting.yesVotes / totalVotes) * 100 : 0;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Road Issue Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .issue-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626; }
          .poll-results { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .action-required { background: #fee2e2; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .metric { display: inline-block; margin: 10px; padding: 10px; background: #f3f4f6; border-radius: 5px; }
          .severity-high { color: #dc2626; font-weight: bold; }
          .severity-moderate { color: #f59e0b; font-weight: bold; }
          .severity-low { color: #059669; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 ROAD ISSUE ALERT</h1>
            <p>UrbanEye Hyderabad - Community Poll Threshold Reached</p>
          </div>
          
          <div class="content">
            <h2>Dear ${this.AUTHORITY_NAME},</h2>
            
            <p>A road issue has received significant community support and requires your immediate attention.</p>
            
            <div class="action-required">
              <h3>⚠️ ACTION REQUIRED</h3>
              <p>This issue has reached the 50% community approval threshold and needs immediate investigation.</p>
            </div>
            
            <div class="issue-details">
              <h3>Issue Details:</h3>
              <div class="metric">
                <strong>Title:</strong> ${issue.title}
              </div>
              <div class="metric">
                <strong>Type:</strong> ${issue.type}
              </div>
              <div class="metric">
                <strong>Severity:</strong> 
                <span class="severity-${issue.severity}">${issue.severity.toUpperCase()}</span>
              </div>
              <div class="metric">
                <strong>Location:</strong> ${issue.location.address}
              </div>
              <div class="metric">
                <strong>Coordinates:</strong> ${issue.location.lat}, ${issue.location.lng}
              </div>
              <div class="metric">
                <strong>Reported:</strong> ${new Date(issue.reportedAt).toLocaleDateString()}
              </div>
              <div class="metric">
                <strong>Description:</strong> ${issue.description}
              </div>
            </div>
            
            <div class="poll-results">
              <h3>📊 Community Poll Results:</h3>
              <div class="metric">
                <strong>Total Votes:</strong> ${totalVotes}
              </div>
              <div class="metric">
                <strong>Yes Votes:</strong> ${issue.publicVoting.yesVotes}
              </div>
              <div class="metric">
                <strong>No Votes:</strong> ${issue.publicVoting.noVotes}
              </div>
              <div class="metric">
                <strong>Approval Rate:</strong> ${yesPercentage.toFixed(1)}%
              </div>
              <div class="metric">
                <strong>Threshold:</strong> ${issue.publicVoting.threshold}%
              </div>
            </div>
            
            <div class="issue-details">
              <h3>AI Analysis Results:</h3>
              <div class="metric">
                <strong>Issue Type:</strong> ${issue.aiPrediction.type}
              </div>
              <div class="metric">
                <strong>Confidence:</strong> ${(issue.aiPrediction.confidence * 100).toFixed(1)}%
              </div>
              <div class="metric">
                <strong>Authenticity:</strong> ${(issue.aiPrediction.authenticity * 100).toFixed(1)}%
              </div>
              <div class="metric">
                <strong>Damage Risk Score:</strong> ${issue.aiPrediction.damageRiskScore}/10
              </div>
              <div class="metric">
                <strong>Human Harm Risk:</strong> ${issue.aiPrediction.humanHarmRisk.toUpperCase()}
              </div>
              ${issue.aiPrediction.estimatedDepth ? 
                `<div class="metric"><strong>Estimated Depth:</strong> ${issue.aiPrediction.estimatedDepth} cm</div>` : 
                ''
              }
            </div>
            
            <div class="action-required">
              <h3>🔧 Recommended Actions:</h3>
              <ul>
                <li>Send inspection team to verify the issue</li>
                <li>Assess the severity and potential risks</li>
                <li>Prioritize repair based on community impact</li>
                <li>Update status in UrbanEye system</li>
                <li>Communicate timeline for resolution</li>
              </ul>
            </div>
            
            <p><strong>Issue ID:</strong> ${issue.id}</p>
            <p><strong>Reported by:</strong> ${issue.reportedBy}</p>
            
            <p>Please take immediate action to address this community concern.</p>
            
            <p>Best regards,<br>
            <strong>${this.APP_NAME} Team</strong><br>
            <em>Automated Notification System</em></p>
          </div>
          
          <div class="footer">
            <p>This is an automated email from UrbanEye Hyderabad.</p>
            <p>For support, contact: hem_writess@gmail.com</p>
            <p>© 2024 UrbanEye Hyderabad. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate plain text email content
  private static generatePollThresholdEmailText(issue: Issue): string {
    const totalVotes = issue.publicVoting.yesVotes + issue.publicVoting.noVotes;
    const yesPercentage = totalVotes > 0 ? (issue.publicVoting.yesVotes / totalVotes) * 100 : 0;
    
    return `
🚨 ROAD ISSUE ALERT - UrbanEye Hyderabad

Dear ${this.AUTHORITY_NAME},

A road issue has received significant community support and requires your immediate attention.

⚠️ ACTION REQUIRED
This issue has reached the 50% community approval threshold and needs immediate investigation.

ISSUE DETAILS:
- Title: ${issue.title}
- Type: ${issue.type}
- Severity: ${issue.severity.toUpperCase()}
- Location: ${issue.location.address}
- Coordinates: ${issue.location.lat}, ${issue.location.lng}
- Reported: ${new Date(issue.reportedAt).toLocaleDateString()}
- Description: ${issue.description}

📊 COMMUNITY POLL RESULTS:
- Total Votes: ${totalVotes}
- Yes Votes: ${issue.publicVoting.yesVotes}
- No Votes: ${issue.publicVoting.noVotes}
- Approval Rate: ${yesPercentage.toFixed(1)}%
- Threshold: ${issue.publicVoting.threshold}%

AI ANALYSIS RESULTS:
- Issue Type: ${issue.aiPrediction.type}
- Confidence: ${(issue.aiPrediction.confidence * 100).toFixed(1)}%
- Authenticity: ${(issue.aiPrediction.authenticity * 100).toFixed(1)}%
- Damage Risk Score: ${issue.aiPrediction.damageRiskScore}/10
- Human Harm Risk: ${issue.aiPrediction.humanHarmRisk.toUpperCase()}
${issue.aiPrediction.estimatedDepth ? `- Estimated Depth: ${issue.aiPrediction.estimatedDepth} cm` : ''}

🔧 RECOMMENDED ACTIONS:
1. Send inspection team to verify the issue
2. Assess the severity and potential risks
3. Prioritize repair based on community impact
4. Update status in UrbanEye system
5. Communicate timeline for resolution

Issue ID: ${issue.id}
Reported by: ${issue.reportedBy}

Please take immediate action to address this community concern.

Best regards,
${this.APP_NAME} Team
Automated Notification System

---
This is an automated email from UrbanEye Hyderabad.
For support, contact: hem_writess@gmail.com
© 2024 UrbanEye Hyderabad. All rights reserved.
    `;
  }

  // Send email via external service (placeholder for production)
  private static async sendEmailViaService(emailData: any): Promise<any> {
    // This is where you would integrate with a real email service
    // Examples:
    
    // Option 1: SendGrid
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // return await sgMail.send(emailData);
    
    // Option 2: Nodemailer with Gmail SMTP
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransporter({
    //   service: 'gmail',
    //   auth: {
    //     user: 'hem_writess@gmail.com',
    //     pass: process.env.GMAIL_APP_PASSWORD
    //   }
    // });
    // return await transporter.sendMail(emailData);
    
    // Option 3: Firebase Functions
    // const functions = require('firebase-functions');
    // const admin = require('firebase-admin');
    // return await admin.firestore().collection('emails').add(emailData);
    
    // For now, simulate successful email sending
    console.log('📧 Production email would be sent via service:', emailData);
    
    return {
      success: true,
      emailId: `prod_email_${Date.now()}`,
      messageId: `msg_${Date.now()}`
    };
  }

  // Send follow-up email when issue is resolved
  static async sendResolutionEmail(issue: Issue): Promise<{
    success: boolean;
    emailId?: string;
    error?: string;
  }> {
    try {
      console.log('📧 Sending resolution notification email...');
      
      const emailData = {
        from: this.FROM_EMAIL,
        to: this.TO_EMAIL,
        subject: `✅ RESOLVED: Road Issue Fixed - ${issue.title}`,
        html: this.generateResolutionEmailHTML(issue),
        text: this.generateResolutionEmailText(issue)
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Development Mode - Resolution email would be sent:', emailData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          success: true,
          emailId: `dev_resolution_email_${Date.now()}`
        };
      }

      const response = await this.sendEmailViaService(emailData);
      
      console.log('✅ Resolution email sent successfully:', response);
      
      return {
        success: true,
        emailId: response.emailId
      };
      
    } catch (error) {
      console.error('❌ Failed to send resolution email:', error);
      return {
        success: false,
        error: 'Failed to send resolution email'
      };
    }
  }

  // Generate resolution email HTML
  private static generateResolutionEmailHTML(issue: Issue): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Issue Resolved</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .issue-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #059669; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ ISSUE RESOLVED</h1>
            <p>UrbanEye Hyderabad - Road Issue Successfully Fixed</p>
          </div>
          
          <div class="content">
            <h2>Dear ${this.AUTHORITY_NAME},</h2>
            
            <p>The following road issue has been successfully resolved:</p>
            
            <div class="issue-details">
              <h3>Issue Details:</h3>
              <p><strong>Title:</strong> ${issue.title}</p>
              <p><strong>Type:</strong> ${issue.type}</p>
              <p><strong>Location:</strong> ${issue.location.address}</p>
              <p><strong>Reported:</strong> ${new Date(issue.reportedAt).toLocaleDateString()}</p>
              <p><strong>Resolved:</strong> ${issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleDateString() : 'Recently'}</p>
              <p><strong>Issue ID:</strong> ${issue.id}</p>
            </div>
            
            <p>Thank you for your prompt action in addressing this community concern.</p>
            
            <p>Best regards,<br>
            <strong>${this.APP_NAME} Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated email from UrbanEye Hyderabad.</p>
            <p>© 2024 UrbanEye Hyderabad. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate resolution email text
  private static generateResolutionEmailText(issue: Issue): string {
    return `
✅ ISSUE RESOLVED - UrbanEye Hyderabad

Dear ${this.AUTHORITY_NAME},

The following road issue has been successfully resolved:

ISSUE DETAILS:
- Title: ${issue.title}
- Type: ${issue.type}
- Location: ${issue.location.address}
- Reported: ${new Date(issue.reportedAt).toLocaleDateString()}
- Resolved: ${issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleDateString() : 'Recently'}
- Issue ID: ${issue.id}

Thank you for your prompt action in addressing this community concern.

Best regards,
${this.APP_NAME} Team

---
This is an automated email from UrbanEye Hyderabad.
© 2024 UrbanEye Hyderabad. All rights reserved.
    `;
  }
} 