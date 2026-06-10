import React, { useState } from 'react';
import { 
  Shield, 
  Filter, 
  Eye, 
  Edit, 
  Check, 
  X, 
  Download, 
  BarChart3,
  Users,
  AlertTriangle,
  Mail,
  Camera,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminPage: React.FC = () => {
  const { issues, updateIssueStatus, currentUser, approveIssue, rejectIssue, checkImageAuthenticity } = useApp();
  const [selectedTab, setSelectedTab] = useState('issues');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  if (!currentUser?.isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const filteredIssues = issues.filter(issue => {
    const statusMatch = filterStatus === 'all' || issue.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || issue.severity === filterSeverity;
    return statusMatch && severityMatch;
  });

  console.log('🔍 AdminPage Debug:');
  console.log('📊 Total Issues:', issues.length);
  console.log('📝 All Issues:', issues);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'in-progress': { color: 'bg-cyan-100 text-blue-800', label: 'In Progress' },
      resolved: { color: 'bg-green-100 text-green-800', label: 'Resolved' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: { color: 'bg-green-100 text-green-800', label: 'Low' },
      moderate: { color: 'bg-amber-100 text-amber-800', label: 'Moderate' },
      high: { color: 'bg-red-100 text-red-800', label: 'High' }
    };
    const config = severityConfig[severity as keyof typeof severityConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleStatusUpdate = (issueId: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    updateIssueStatus(issueId, newStatus);
  };

  const exportData = () => {
    const data = filteredIssues.map(issue => ({
      id: issue.id,
      title: issue.title,
      type: issue.type,
      severity: issue.severity,
      status: issue.status,
      location: issue.location.address,
      reportedBy: issue.reportedBy,
      reportedAt: issue.reportedAt,
      upvotes: issue.upvotes,
      downvotes: issue.downvotes
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'issues-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendNotification = (issueId: string) => {
    // Mock notification functionality
    alert(`Notification sent to authorities for issue ${issueId}`);
  };

  const handleImageAuthenticity = async (issueId: string, angle: 'angle1' | 'angle2') => {
    // Simulate AI authenticity check
    const isReal = Math.random() > 0.2; // 80% chance of being real
    const result: 'real' | 'ai-generated' = isReal ? 'real' : 'ai-generated';
    
    checkImageAuthenticity(issueId, angle, result);
    
    if (!isReal) {
      alert(`⚠️ Image ${angle} flagged as AI-generated. Report automatically rejected.`);
    }
  };

  const getAuthenticityBadge = (status: 'real' | 'ai-generated' | 'fake' | 'pending') => {
    switch (status) {
      case 'real':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✅ Real</span>;
      case 'ai-generated':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">🚫 AI-Generated</span>;
      case 'fake':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">🚫 Fake</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">⏳ Pending</span>;
    }
  };

  const renderIssuesManagement = () => (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button
          onClick={exportData}
          className="flex items-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue & Images
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Approval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image Authenticity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Analysis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <img
                          src={issue.images.angle1}
                          alt="Angle 1"
                          className="w-8 h-8 object-cover rounded border"
                        />
                        <img
                          src={issue.images.angle2}
                          alt="Angle 2"
                          className="w-8 h-8 object-cover rounded border"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                        <div className="text-xs text-gray-500">
                          by {issue.reportedBy} • {new Date(issue.reportedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-900 capitalize">{issue.type}</div>
                      {getSeverityBadge(issue.severity)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {getStatusBadge(issue.status)}
                      <div className="flex items-center space-x-1 text-xs">
                        {issue.adminApproved ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-gray-500">{issue.adminApproved ? 'Approved' : 'Not Approved'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="text-xs">
                        <div className="font-medium">Angle 1:</div>
                        {getAuthenticityBadge(issue.imageAuthenticity.angle1)}
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">Angle 2:</div>
                        {getAuthenticityBadge(issue.imageAuthenticity.angle2)}
                      </div>
                      <div className="flex space-x-1 mt-2">
                        <button
                          onClick={() => handleImageAuthenticity(issue.id, 'angle1')}
                          disabled={issue.imageAuthenticity.angle1 !== 'pending'}
                          className="px-2 py-1 text-xs bg-cyan-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
                        >
                          Check A1
                        </button>
                        <button
                          onClick={() => handleImageAuthenticity(issue.id, 'angle2')}
                          disabled={issue.imageAuthenticity.angle2 !== 'pending'}
                          className="px-2 py-1 text-xs bg-cyan-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
                        >
                          Check A2
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div><span className="font-medium">Type:</span> {issue.aiPrediction.type}</div>
                      <div><span className="font-medium">Depth:</span> {issue.aiPrediction.estimatedDepth.toFixed(1)}cm</div>
                      <div><span className="font-medium">Risk:</span> {issue.aiPrediction.damageRiskScore.toFixed(1)}/10</div>
                      <div><span className="font-medium">Harm:</span> {issue.aiPrediction.humanHarmRisk}</div>
                      <div><span className="font-medium">Confidence:</span> {(issue.aiPrediction.confidence * 100).toFixed(1)}%</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      {issue.status === 'pending' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => approveIssue(issue.id)}
                            className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => rejectIssue(issue.id)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                      
                      {issue.status !== 'pending' && issue.status !== 'rejected' && (
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusUpdate(issue.id, e.target.value as any)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="approved">Approved</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      )}
                      
                      <div className="flex space-x-1 mt-2">
                        <button
                          onClick={() => sendNotification(issue.id)}
                          className="p-1 text-cyan-700 hover:text-blue-700"
                          title="Send notification"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-700" title="View details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-cyan-600 hover:text-indigo-700" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Issues</p>
            <p className="text-3xl font-bold text-cyan-600">{issues.length}</p>
          </div>
          <BarChart3 className="w-8 h-8 text-cyan-600" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Approved Issues</p>
            <p className="text-3xl font-bold text-green-600">
              {issues.filter(i => i.status === 'approved').length}
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600">
              {issues.filter(i => i.status === 'pending').length}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Rejected Issues</p>
            <p className="text-3xl font-bold text-red-600">
              {issues.filter(i => i.status === 'rejected').length}
            </p>
          </div>
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Resolved Today</p>
            <p className="text-3xl font-bold text-green-600">
              {issues.filter(i => i.status === 'resolved').length}
            </p>
          </div>
          <Check className="w-8 h-8 text-green-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <Shield className="w-8 h-8 text-cyan-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage and oversee civic issue reports</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              selectedTab === 'dashboard'
                ? 'border-indigo-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setSelectedTab('issues')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              selectedTab === 'issues'
                ? 'border-indigo-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Issues Management
          </button>
          <button
            onClick={() => setSelectedTab('authenticity')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              selectedTab === 'authenticity'
                ? 'border-indigo-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Image Authenticity
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'dashboard' && renderDashboard()}
      {selectedTab === 'issues' && renderIssuesManagement()}
      {selectedTab === 'authenticity' && renderIssuesManagement()}
    </div>
  );
};

export default AdminPage;