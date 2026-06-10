import { Issue, User, AreaStats } from '../types';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Severe Pothole on Bhadurpally Main Road',
    description: 'Deep pothole causing vehicle damage near Bhadurpally Bus Stop, affecting daily commuters',
    type: 'pothole',
    severity: 'high',
    severityScore: 9.2,
    status: 'pending',
    location: {
      lat: 17.3850,
      lng: 78.4867,
      address: 'Bhadurpally Main Road, Near Bus Stop, Bhadurpally, Hyderabad, Telangana'
    },
    images: {
      angle1: 'https://images.pexels.com/photos/162119/railway-rails-train-railroad-162119.jpeg?auto=compress&cs=tinysrgb&w=800',
      angle2: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    reportedBy: 'bhadurpally_resident',
    reportedAt: '2025-01-08T10:30:00Z',
    upvotes: 45,
    downvotes: 2,
    aiPrediction: {
      type: 'Severe Pothole',
      confidence: 0.96,
      authenticity: 0.98,
      estimatedDepth: 18.5,
      damageRiskScore: 9.2,
      humanHarmRisk: 'high'
    },
    adminApproved: true,
    imageAuthenticity: {
      angle1: 'real',
      angle2: 'real',
      checkedAt: '2025-01-08T11:00:00Z',
      checkedBy: 'admin_user'
    },
    publicVoting: {
      enabled: true,
      yesVotes: 38,
      noVotes: 4,
      threshold: 50,
      emailSent: true
    }
  },
  {
    id: '2',
    title: 'Road Crack near St. Martin\'s College Entrance',
    description: 'Long crack extending across the road near St. Martin\'s College main gate, affecting student safety',
    type: 'crack',
    severity: 'moderate',
    severityScore: 7.1,
    status: 'in-progress',
    location: {
      lat: 17.4229,
      lng: 78.4078,
      address: 'St. Martin\'s College Main Gate, Dhulapally, Hyderabad, Telangana'
    },
    images: {
      angle1: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800',
      angle2: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    reportedBy: 'st_martins_student',
    reportedAt: '2025-01-07T14:15:00Z',
    upvotes: 28,
    downvotes: 1,
    aiPrediction: {
      type: 'Road Crack',
      confidence: 0.89,
      authenticity: 0.95,
      estimatedDepth: 6.8,
      damageRiskScore: 7.1,
      humanHarmRisk: 'moderate'
    },
    adminApproved: true,
    imageAuthenticity: {
      angle1: 'real',
      angle2: 'real',
      checkedAt: '2025-01-07T15:00:00Z',
      checkedBy: 'admin_user'
    },
    publicVoting: {
      enabled: true,
      yesVotes: 25,
      noVotes: 3,
      threshold: 50,
      emailSent: false
    }
  },
  {
    id: '3',
    title: 'Waterlogging in Dhulapally Residential Area',
    description: 'Water accumulation after rain near Dhulapally Market, affecting local residents',
    type: 'waterlogging',
    severity: 'high',
    severityScore: 8.3,
    status: 'resolved',
    location: {
      lat: 17.4399,
      lng: 78.4983,
      address: 'Dhulapally Market Road, Dhulapally, Hyderabad, Telangana'
    },
    images: {
      angle1: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
      angle2: 'https://images.pexels.com/photos/162119/railway-rails-train-railroad-162119.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    reportedBy: 'dhulapally_shopkeeper',
    reportedAt: '2025-01-06T09:20:00Z',
    upvotes: 32,
    downvotes: 0,
    aiPrediction: {
      type: 'Severe Waterlogging',
      confidence: 0.94,
      authenticity: 0.97,
      estimatedDepth: 12.5,
      damageRiskScore: 8.3,
      humanHarmRisk: 'high'
    },
    adminApproved: true,
    imageAuthenticity: {
      angle1: 'real',
      angle2: 'real',
      checkedAt: '2025-01-06T10:00:00Z',
      checkedBy: 'admin_user'
    },
    publicVoting: {
      enabled: true,
      yesVotes: 30,
      noVotes: 2,
      threshold: 50,
      emailSent: true
    }
  },
  {
    id: '4',
    title: 'Multiple Potholes on Bhadurpally-Dhulapally Road',
    description: 'Series of potholes on the connecting road between Bhadurpally and Dhulapally',
    type: 'pothole',
    severity: 'high',
    severityScore: 8.7,
    status: 'pending',
    location: {
      lat: 17.4474,
      lng: 78.3765,
      address: 'Bhadurpally-Dhulapally Connecting Road, Hyderabad, Telangana'
    },
    images: {
      angle1: 'https://images.pexels.com/photos/162119/railway-rails-train-railroad-162119.jpeg?auto=compress&cs=tinysrgb&w=800',
      angle2: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    reportedBy: 'local_driver',
    reportedAt: '2025-01-08T08:45:00Z',
    upvotes: 42,
    downvotes: 1,
    aiPrediction: {
      type: 'Multiple Potholes',
      confidence: 0.97,
      authenticity: 0.99,
      estimatedDepth: 14.8,
      damageRiskScore: 8.7,
      humanHarmRisk: 'high'
    },
    adminApproved: true,
    imageAuthenticity: {
      angle1: 'real',
      angle2: 'real',
      checkedAt: '2025-01-08T09:00:00Z',
      checkedBy: 'admin_user'
    },
    publicVoting: {
      enabled: true,
      yesVotes: 35,
      noVotes: 3,
      threshold: 50,
      emailSent: true
    }
  },
  {
    id: '5',
    title: 'Road Damage near St. Martin\'s College Hostel',
    description: 'Severe road damage affecting students walking to St. Martin\'s College hostel',
    type: 'crack',
    severity: 'moderate',
    severityScore: 6.8,
    status: 'in-progress',
    location: {
      lat: 17.3616,
      lng: 78.4747,
      address: 'St. Martin\'s College Hostel Road, Dhulapally, Hyderabad, Telangana'
    },
    images: {
      angle1: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800',
      angle2: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    reportedBy: 'college_student',
    reportedAt: '2025-01-07T16:30:00Z',
    upvotes: 25,
    downvotes: 2,
    aiPrediction: {
      type: 'Road Crack',
      confidence: 0.91,
      authenticity: 0.96,
      estimatedDepth: 7.2,
      damageRiskScore: 6.8,
      humanHarmRisk: 'moderate'
    },
    adminApproved: true,
    imageAuthenticity: {
      angle1: 'real',
      angle2: 'real',
      checkedAt: '2025-01-07T17:00:00Z',
      checkedBy: 'admin_user'
    },
    publicVoting: {
      enabled: true,
      yesVotes: 22,
      noVotes: 3,
      threshold: 50,
      emailSent: false
    }
  },
  {
    id: '6',
    title: 'Street Light Pole Damage in Bhadurpally',
    description: 'Damaged street light pole near Bhadurpally Community Hall',
    type: 'streetlight',
    severity: 'moderate',
    severityScore: 6.5,
    status: 'resolved',
    location: {
      lat: 17.3950,
      lng: 78.4767,
      address: 'Bhadurpally Community Hall Road, Bhadurpally, Hyderabad, Telangana'
    },
    images: {
      angle1: 'https://images.pexels.com/photos/162119/railway-rails-train-railroad-162119.jpeg?auto=compress&cs=tinysrgb&w=800',
      angle2: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    reportedBy: 'community_member',
    reportedAt: '2025-01-05T19:20:00Z',
    upvotes: 18,
    downvotes: 1,
    aiPrediction: {
      type: 'Street Light Damage',
      confidence: 0.88,
      authenticity: 0.94,
      estimatedDepth: 0,
      damageRiskScore: 6.5,
      humanHarmRisk: 'moderate'
    },
    adminApproved: true,
    imageAuthenticity: {
      angle1: 'real',
      angle2: 'real',
      checkedAt: '2025-01-05T20:00:00Z',
      checkedBy: 'admin_user'
    },
    publicVoting: {
      enabled: true,
      yesVotes: 16,
      noVotes: 2,
      threshold: 50,
      emailSent: true
    }
  },
  {
    id: '7',
    title: 'Garbage Dumping on Dhulapally Road',
    description: 'Illegal garbage dumping blocking the road near Dhulapally Market',
    type: 'garbage',
    severity: 'low',
    severityScore: 4.2,
    status: 'resolved',
    location: {
      lat: 17.4299,
      lng: 78.4883,
      address: 'Dhulapally Market Road, Near Vegetable Market, Dhulapally, Hyderabad, Telangana'
    },
    images: {
      angle1: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
      angle2: 'https://images.pexels.com/photos/162119/railway-rails-train-railroad-162119.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    reportedBy: 'market_vendor',
    reportedAt: '2025-01-04T11:15:00Z',
    upvotes: 15,
    downvotes: 0,
    aiPrediction: {
      type: 'Garbage Dumping',
      confidence: 0.85,
      authenticity: 0.92,
      estimatedDepth: 0,
      damageRiskScore: 4.2,
      humanHarmRisk: 'low'
    },
    adminApproved: true,
    imageAuthenticity: {
      angle1: 'real',
      angle2: 'real',
      checkedAt: '2025-01-04T12:00:00Z',
      checkedBy: 'admin_user'
    },
    publicVoting: {
      enabled: true,
      yesVotes: 14,
      noVotes: 1,
      threshold: 50,
      emailSent: true
    }
  },
  {
    id: '8',
    title: 'Broken Drainage Cover near St. Martin\'s College',
    description: 'Broken drainage cover creating safety hazard for students',
    type: 'drainage',
    severity: 'high',
    severityScore: 8.1,
    status: 'pending',
    location: {
      lat: 17.4116,
      lng: 78.4647,
      address: 'St. Martin\'s College Back Gate, Dhulapally, Hyderabad, Telangana'
    },
    images: {
      angle1: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=800',
      angle2: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    reportedBy: 'college_security',
    reportedAt: '2025-01-08T07:30:00Z',
    upvotes: 38,
    downvotes: 1,
    aiPrediction: {
      type: 'Broken Drainage Cover',
      confidence: 0.93,
      authenticity: 0.97,
      estimatedDepth: 0,
      damageRiskScore: 8.1,
      humanHarmRisk: 'high'
    },
    adminApproved: true,
    imageAuthenticity: {
      angle1: 'real',
      angle2: 'real',
      checkedAt: '2025-01-08T08:00:00Z',
      checkedBy: 'admin_user'
    },
    publicVoting: {
      enabled: true,
      yesVotes: 35,
      noVotes: 2,
      threshold: 50,
      emailSent: true
    }
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'bhadurpally_resident',
    email: 'resident@bhadurpally.com',
    reportsCount: 12,
    validationScore: 145,
    badges: ['Top Reporter', 'Community Guardian', 'Local Expert'],
    isAdmin: false
  },
  {
    id: '2',
    username: 'st_martins_student',
    email: 'student@stmartins.edu',
    reportsCount: 8,
    validationScore: 95,
    badges: ['Student Reporter', 'Campus Guardian'],
    isAdmin: false
  },
  {
    id: '3',
    username: 'admin_user',
    email: 'admin@UrbanEye.com',
    reportsCount: 3,
    validationScore: 50,
    badges: ['Admin', 'System Manager'],
    isAdmin: true
  },
  {
    id: '4',
    username: 'dhulapally_shopkeeper',
    email: 'shopkeeper@dhulapally.com',
    reportsCount: 15,
    validationScore: 120,
    badges: ['Business Guardian', 'Active Reporter'],
    isAdmin: false
  },
  {
    id: '5',
    username: 'local_driver',
    email: 'driver@local.com',
    reportsCount: 6,
    validationScore: 75,
    badges: ['Road Safety Expert'],
    isAdmin: false
  },
  {
    id: '6',
    username: 'college_student',
    email: 'student2@stmartins.edu',
    reportsCount: 4,
    validationScore: 60,
    badges: ['Student Reporter'],
    isAdmin: false
  },
  {
    id: '7',
    username: 'community_member',
    email: 'member@community.com',
    reportsCount: 9,
    validationScore: 85,
    badges: ['Community Guardian'],
    isAdmin: false
  },
  {
    id: '8',
    username: 'market_vendor',
    email: 'vendor@market.com',
    reportsCount: 7,
    validationScore: 70,
    badges: ['Business Guardian'],
    isAdmin: false
  },
  {
    id: '9',
    username: 'college_security',
    email: 'security@stmartins.edu',
    reportsCount: 5,
    validationScore: 65,
    badges: ['Campus Guardian'],
    isAdmin: false
  }
];

export const mockAreaStats: AreaStats[] = [
  {
    area: 'Bhadurpally',
    total: 18,
    pending: 3,
    inProgress: 2,
    resolved: 13,
    resolvedPercentage: 72.2
  },
  {
    area: 'Dhulapally',
    total: 22,
    pending: 4,
    inProgress: 3,
    resolved: 15,
    resolvedPercentage: 68.2
  },
  {
    area: 'St. Martin\'s College',
    total: 15,
    pending: 2,
    inProgress: 1,
    resolved: 12,
    resolvedPercentage: 80.0
  },
  {
    area: 'Bhadurpally-Dhulapally Road',
    total: 8,
    pending: 1,
    inProgress: 1,
    resolved: 6,
    resolvedPercentage: 75.0
  },
  {
    area: 'College Hostel Area',
    total: 12,
    pending: 2,
    inProgress: 1,
    resolved: 9,
    resolvedPercentage: 75.0
  }
];