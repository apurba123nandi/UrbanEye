import { Issue } from '../types';
import { EmailService } from './emailService';

// Mock Backend Service for Development
class MockBackendService {
  private issues: Issue[] = [
    {
      id: 'mock_1',
      title: 'Large Pothole on Main Street',
      description: 'Deep pothole causing traffic issues and vehicle damage',
      type: 'pothole',
      severity: 'high',
      severityScore: 8,
      status: 'approved',
      location: {
        lat: 17.3850,
        lng: 78.4867,
        address: 'Main Street, Hyderabad, Telangana'
      },
      images: {
        angle1: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800',
        angle2: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      reportedBy: 'civic_hero',
      reportedAt: '2025-01-10T10:00:00Z',
      upvotes: 15,
      downvotes: 2,
      aiPrediction: {
        type: 'Pothole',
        confidence: 0.92,
        authenticity: 0.95,
        estimatedDepth: 12.5,
        damageRiskScore: 8.5,
        humanHarmRisk: 'high'
      },
      adminApproved: true,
      imageAuthenticity: {
        angle1: 'real',
        angle2: 'real',
        checkedAt: '2025-01-10T10:30:00Z',
        checkedBy: 'AI System'
      },
      publicVoting: {
        enabled: true,
        yesVotes: 23,
        noVotes: 3,
        threshold: 50,
        emailSent: true
      },
      emailSentAt: '2025-01-10T11:00:00Z',
      emailId: 'email_001'
    },
    {
      id: 'mock_2',
      title: 'Cracked Road Surface',
      description: 'Multiple cracks forming on the road surface',
      type: 'crack',
      severity: 'moderate',
      severityScore: 6,
      status: 'in-progress',
      location: {
        lat: 17.4474,
        lng: 78.3765,
        address: 'Tech Park Road, Hitech City, Hyderabad'
      },
      images: {
        angle1: 'https://images.pexels.com/photos/162119/railway-rails-train-railroad-162119.jpeg?auto=compress&cs=tinysrgb&w=800',
        angle2: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      reportedBy: 'tech_worker',
      reportedAt: '2025-01-09T14:30:00Z',
      upvotes: 8,
      downvotes: 1,
      aiPrediction: {
        type: 'Road Crack',
        confidence: 0.88,
        authenticity: 0.92,
        estimatedDepth: 8.2,
        damageRiskScore: 6.8,
        humanHarmRisk: 'moderate'
      },
      adminApproved: true,
      imageAuthenticity: {
        angle1: 'real',
        angle2: 'real',
        checkedAt: '2025-01-09T15:00:00Z',
        checkedBy: 'AI System'
      },
      publicVoting: {
        enabled: true,
        yesVotes: 12,
        noVotes: 2,
        threshold: 50,
        emailSent: false
      }
    },
    {
      id: 'mock_3',
      title: 'Waterlogging Issue',
      description: 'Severe waterlogging after rain',
      type: 'waterlogging',
      severity: 'high',
      severityScore: 7,
      status: 'pending',
      location: {
        lat: 17.3616,
        lng: 78.4747,
        address: 'Old City Area, Hyderabad'
      },
      images: {
        angle1: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
        angle2: 'https://images.pexels.com/photos/162119/railway-rails-train-railroad-162119.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      reportedBy: 'old_city_resident',
      reportedAt: '2025-01-10T08:15:00Z',
      upvotes: 5,
      downvotes: 0,
      aiPrediction: {
        type: 'Waterlogging',
        confidence: 0.85,
        authenticity: 0.90,
        estimatedDepth: 15.0,
        damageRiskScore: 7.2,
        humanHarmRisk: 'high'
      },
      adminApproved: false,
      imageAuthenticity: {
        angle1: 'pending',
        angle2: 'pending'
      },
      publicVoting: {
        enabled: false,
        yesVotes: 0,
        noVotes: 0,
        threshold: 50,
        emailSent: false
      }
    },
    {
      id: 'mock_4',
      title: 'Test Report from Current User',
      description: 'This is a test report to verify My Reports functionality',
      type: 'pothole',
      severity: 'moderate',
      severityScore: 6,
      status: 'approved',
      location: {
        lat: 17.3850,
        lng: 78.4867,
        address: 'Test Location, Hyderabad'
      },
      images: {
        angle1: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800',
        angle2: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      reportedBy: 'testuser',
      reportedAt: '2025-01-10T12:00:00Z',
      upvotes: 3,
      downvotes: 1,
      aiPrediction: {
        type: 'Pothole',
        confidence: 0.88,
        authenticity: 0.92,
        estimatedDepth: 8.5,
        damageRiskScore: 6.5,
        humanHarmRisk: 'moderate'
      },
      adminApproved: true,
      imageAuthenticity: {
        angle1: 'real',
        angle2: 'real',
        checkedAt: '2025-01-10T12:30:00Z',
        checkedBy: 'AI System'
      },
      publicVoting: {
        enabled: true,
        yesVotes: 8,
        noVotes: 2,
        threshold: 50,
        emailSent: false
      }
    }
  ];
  private issueIdCounter = 5;
  private listeners: Array<(issues: Issue[]) => void> = [];
  private progressData = {
    totalSubmitted: 4,
    totalResolved: 0,
    totalInProgress: 1,
    totalPending: 2,
    resolutionRate: 0,
    avgResolutionTime: 0
  };

  constructor() {
    // Initialize progress data based on initial issues
    this.updateProgressData();
  }

  // Mock AI analysis
  async analyzeImages(image1: File, image2?: File, issueData?: any): Promise<any> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis - 80% chance of authentic images
    const isAuthentic = Math.random() > 0.2;
    
    if (isAuthentic) {
      // Create mock issue
      const issue: Issue = {
        id: `mock_${this.issueIdCounter++}`,
        title: issueData.title || 'New Issue',
        description: issueData.description || '',
        type: issueData.type || 'other',
        severity: issueData.severity || 'moderate',
        severityScore: issueData.severityScore || 5,
        status: 'approved',
        location: issueData.location || { lat: 0, lng: 0, address: 'Hyderabad' },
        images: {
          angle1: URL.createObjectURL(image1),
          angle2: image2 ? URL.createObjectURL(image2) : ''
        },
        reportedBy: issueData.reportedBy || 'Anonymous',
        reportedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        aiPrediction: {
          type: issueData.type?.charAt(0).toUpperCase() + issueData.type?.slice(1) || 'Issue',
          confidence: 0.85 + Math.random() * 0.15,
          authenticity: 0.9 + Math.random() * 0.1,
          estimatedDepth: Math.random() * 15 + 2,
          damageRiskScore: Math.random() * 4 + 6,
          humanHarmRisk: issueData.severity === 'high' ? 'high' : issueData.severity === 'moderate' ? 'moderate' : 'low'
        },
        adminApproved: true,
        imageAuthenticity: {
          angle1: 'real',
          angle2: image2 ? 'real' : 'pending',
          checkedAt: new Date().toISOString(),
          checkedBy: 'AI System'
        },
        publicVoting: {
          enabled: true,
          yesVotes: 0,
          noVotes: 0,
          threshold: 50,
          emailSent: false
        }
      };
      
      this.issues.unshift(issue);
      this.updateProgressData();
      this.notifyListeners();
      
      return {
        isAuthentic: true,
        confidence: 0.9,
        issueId: issue.id,
        issue: issue,
        damageAnalysis: {
          image1: { hasDamage: true, damageType: 'pothole', severity: 7, confidence: 0.8 },
          image2: image2 ? { hasDamage: true, damageType: 'pothole', severity: 7, confidence: 0.8 } : null,
          combined: { hasDamage: true, damageType: 'pothole', severity: 7, confidence: 0.8 }
        },
        authenticityAnalysis: {
          image1: { aiGenerated: false, manipulated: false },
          image2: image2 ? { aiGenerated: false, manipulated: false } : null
        }
      };
    } else {
      return {
        isAuthentic: false,
        confidence: 0.85,
        reason: 'Images appear to be AI-generated or manipulated',
        damageAnalysis: null,
        authenticityAnalysis: {
          image1: { aiGenerated: true, manipulated: false },
          image2: image2 ? { aiGenerated: true, manipulated: false } : null
        }
      };
    }
  }

  // Mock fetch issues
  async fetchIssues(): Promise<Issue[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.issues];
  }

  // Mock vote on issue
  async voteOnIssue(issueId: string, vote: 'yes' | 'no'): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const issue = this.issues.find(i => i.id === issueId);
    if (issue && issue.publicVoting.enabled) {
      if (vote === 'yes') {
        issue.publicVoting.yesVotes++;
      } else {
        issue.publicVoting.noVotes++;
      }
      
      // Check if threshold is reached
      const totalVotes = issue.publicVoting.yesVotes + issue.publicVoting.noVotes;
      const yesPercentage = totalVotes > 0 ? (issue.publicVoting.yesVotes / totalVotes) * 100 : 0;
      
      if (yesPercentage >= issue.publicVoting.threshold && !issue.publicVoting.emailSent) {
        issue.publicVoting.emailSent = true;
        issue.status = 'reported-to-authority';
        issue.emailSentAt = new Date().toISOString();
        
        // Send email notification to authority
        try {
          const emailResult = await EmailService.sendPollThresholdEmail(issue);
          if (emailResult.success) {
            issue.emailId = emailResult.emailId;
            console.log('✅ Email sent to authority for issue:', issueId, 'Email ID:', emailResult.emailId);
          } else {
            console.error('❌ Failed to send email for issue:', issueId, emailResult.error);
          }
        } catch (error) {
          console.error('❌ Error sending email for issue:', issueId, error);
        }
      }
      
      return true;
    }
    
    return false;
  }

  // Mock send report to authority
  async sendReportToAuthority(issueId: string): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const issue = this.issues.find(i => i.id === issueId);
    if (issue) {
      issue.status = 'reported-to-authority';
      issue.emailSentAt = new Date().toISOString();
      issue.emailId = `mock_email_${Date.now()}`;
      
      console.log('Mock email sent to authority:', {
        to: 'apurbaofficial8097@gmail.com',
        subject: `Road Issue Report - ${issue.title}`,
        issueId: issue.id
      });
      
      return {
        success: true,
        emailId: issue.emailId
      };
    }
    
    return {
      success: false,
      error: 'Issue not found'
    };
  }

  // Update issue status (for admin use)
  async updateIssueStatus(issueId: string, status: Issue['status']): Promise<boolean> {
    const issue = this.issues.find(i => i.id === issueId);
    if (issue) {
      issue.status = status;
      if (status === 'resolved') {
        issue.resolvedAt = new Date().toISOString();
        
        // Send resolution notification email
        try {
          const emailResult = await EmailService.sendResolutionEmail(issue);
          if (emailResult.success) {
            console.log('✅ Resolution email sent for issue:', issueId, 'Email ID:', emailResult.emailId);
          } else {
            console.error('❌ Failed to send resolution email for issue:', issueId, emailResult.error);
          }
        } catch (error) {
          console.error('❌ Error sending resolution email for issue:', issueId, error);
        }
      }
      this.updateProgressData();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Get progress data
  getProgressData() {
    return { ...this.progressData };
  }

  // Subscribe to real-time updates
  subscribe(callback: (issues: Issue[]) => void): () => void {
    this.listeners.push(callback);
    // Call immediately with current data
    callback([...this.issues]);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Update progress data
  private updateProgressData() {
    const totalSubmitted = this.issues.length;
    const totalResolved = this.issues.filter(i => i.status === 'resolved').length;
    const totalInProgress = this.issues.filter(i => i.status === 'in-progress').length;
    const totalPending = this.issues.filter(i => i.status === 'pending' || i.status === 'approved').length;
    
    this.progressData = {
      totalSubmitted,
      totalResolved,
      totalInProgress,
      totalPending,
      resolutionRate: totalSubmitted > 0 ? (totalResolved / totalSubmitted) * 100 : 0,
      avgResolutionTime: this.calculateAvgResolutionTime()
    };
  }

  // Calculate average resolution time
  private calculateAvgResolutionTime(): number {
    const resolvedIssues = this.issues.filter(i => i.status === 'resolved' && i.resolvedAt);
    if (resolvedIssues.length === 0) return 0;
    
    const totalDays = resolvedIssues.reduce((sum, issue) => {
      const reportedDate = new Date(issue.reportedAt);
      const resolvedDate = new Date(issue.resolvedAt!);
      const diffTime = resolvedDate.getTime() - reportedDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return sum + diffDays;
    }, 0);
    
    return totalDays / resolvedIssues.length;
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(callback => callback([...this.issues]));
  }
}

export const mockBackend = new MockBackendService(); 