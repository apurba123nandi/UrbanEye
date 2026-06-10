import React, { useState } from 'react';
import { 
  FileText, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import PublicVotingCard from '../components/PublicVotingCard';

const ReportsPage: React.FC = () => {
  const { issues, currentUser, voteOnIssue, updateIssueStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // Get the correct username field
  const currentUsername = (currentUser as any)?.displayName || currentUser?.email?.split('@')[0] || 'anonymous';
  
  const userIssues = issues.filter(issue => issue.reportedBy === currentUsername);
  
  console.log('🔍 ReportsPage Debug:');
  console.log('👤 Current User:', currentUser);
  console.log('👤 Current Username:', currentUsername);
  console.log('📊 Total Issues:', issues.length);
  console.log('👤 User Issues:', userIssues.length);
  console.log('📝 User Issues:', userIssues);
  console.log('📝 All Issues with reportedBy:', issues.map(i => ({ id: i.id, reportedBy: i.reportedBy })));

  const filteredIssues = userIssues.filter(issue => {
    const statusMatch = filterStatus === 'all' || issue.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || issue.severity === filterSeverity;
    return statusMatch && severityMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

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

  const resolvedPercentage = userIssues.length > 0 
    ? (userIssues.filter(issue => issue.status === 'resolved').length / userIssues.length) * 100 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <FileText className="w-8 h-8 text-cyan-600" />
            <span>My Reports</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Track your submitted issues and their resolution status. 
            <span className="text-cyan-600 font-medium"> Note: All users can see all reports on the Live Map and HomePage.</span>
          </p>
        </div>

        {/* Filters */}
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
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{userIssues.length}</p>
            </div>
            <FileText className="w-8 h-8 text-cyan-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {userIssues.filter(issue => issue.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-cyan-700">
                {userIssues.filter(issue => issue.status === 'in-progress').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-cyan-700" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {userIssues.filter(issue => issue.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Resolution Progress</h3>
          <span className="text-lg font-bold text-cyan-600">{resolvedPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${resolvedPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {userIssues.filter(issue => issue.status === 'resolved').length} of {userIssues.length} issues resolved
        </p>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">
              {userIssues.length === 0 
                ? "You haven't submitted any reports yet. Start by reporting an issue!"
                : "No reports match your current filters."
              }
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={issue.images.angle1}
                      alt={issue.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {issue.title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        {getStatusIcon(issue.status)}
                        {getStatusBadge(issue.status)}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {issue.description || 'No description provided'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <span>Type:</span>
                        <span className="font-medium text-gray-700 capitalize">{issue.type}</span>
                      </div>
                      <div>•</div>
                      <div className="flex items-center space-x-1">
                        <span>Severity:</span>
                        {getSeverityBadge(issue.severity)}
                      </div>
                      <div>•</div>
                      <div className="flex items-center space-x-1">
                        <span>Score:</span>
                        <span className="font-medium text-gray-700">{issue.severityScore}/10</span>
                      </div>
                      <div>•</div>
                      <div>
                        {new Date(issue.reportedAt).toLocaleDateString()}
                      </div>
                      <div>•</div>
                      <div className="flex items-center space-x-1">
                        <span>Admin:</span>
                        <span className={`font-medium ${issue.adminApproved ? 'text-green-600' : 'text-red-600'}`}>
                          {issue.adminApproved ? '✅ Approved' : '❌ Pending'}
                        </span>
                      </div>
                    </div>

                    {/* AI Prediction */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">AI Analysis:</span>
                        <span className="ml-2">{issue.aiPrediction.type}</span>
                        <span className="text-gray-500 ml-2">
                          ({(issue.aiPrediction.confidence * 100).toFixed(1)}% confidence)
                        </span>
                        <div className="mt-1 text-xs text-gray-600">
                          Depth: {issue.aiPrediction.estimatedDepth.toFixed(1)}cm | 
                          Risk: {issue.aiPrediction.damageRiskScore.toFixed(1)}/10 | 
                          Harm: {issue.aiPrediction.humanHarmRisk}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {issue.publicVoting.enabled ? (
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1 text-green-600">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{issue.publicVoting.yesVotes} Yes</span>
                            </div>
                            <div className="flex items-center space-x-1 text-red-600">
                              <ThumbsDown className="w-4 h-4" />
                              <span>{issue.publicVoting.noVotes} No</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {issue.adminApproved ? 'Voting available' : 'Awaiting approval'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="flex items-center space-x-1 text-cyan-600 hover:text-indigo-700 transition-colors">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Public Voting Card */}
              {issue.adminApproved && (
                <div className="mt-4">
                  <PublicVotingCard issue={issue} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsPage;