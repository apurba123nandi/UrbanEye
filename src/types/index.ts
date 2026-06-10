export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Images {
  angle1: string;
  angle2: string;
}

export interface AIPrediction {
  type: string;
  confidence: number;
  authenticity: number;
  estimatedDepth: number;
  damageRiskScore: number;
  humanHarmRisk: 'low' | 'moderate' | 'high';
}

export interface ImageAuthenticity {
  angle1: 'pending' | 'real' | 'fake' | 'ai-generated';
  angle2: 'pending' | 'real' | 'fake' | 'ai-generated';
  checkedAt?: string;
  checkedBy?: string;
}

export interface PublicVoting {
  enabled: boolean;
  yesVotes: number;
  noVotes: number;
  threshold: number;
  emailSent: boolean;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  type: 'pothole' | 'crack' | 'waterlogging' | 'streetlight' | 'garbage' | 'drainage' | 'other';
  severity: 'low' | 'moderate' | 'high';
  severityScore: number;
  status: 'pending' | 'in-progress' | 'resolved' | 'approved' | 'rejected' | 'reported-to-authority';
  location: Location;
  images: Images;
  reportedBy: string;
  reportedAt: string;
  upvotes: number;
  downvotes: number;
  aiPrediction: AIPrediction;
  adminApproved: boolean;
  imageAuthenticity: ImageAuthenticity;
  publicVoting: PublicVoting;
  emailSentAt?: string;
  emailId?: string;
  resolvedAt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  reportsCount: number;
  validationScore: number;
  badges: string[];
  isAdmin: boolean;
}

export interface AreaStats {
  area: string;
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  resolvedPercentage: number;
}