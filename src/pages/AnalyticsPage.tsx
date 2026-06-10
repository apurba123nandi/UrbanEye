import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3, TrendingUp, MapPin, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockAreaStats } from '../data/mockData';

const AnalyticsPage: React.FC = () => {
  const { issues } = useApp();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Prepare data for charts
  const issuesByType = [
    { name: 'Pothole', count: issues.filter(i => i.type === 'pothole').length, color: '#EF4444' },
    { name: 'Crack', count: issues.filter(i => i.type === 'crack').length, color: '#F97316' },
    { name: 'Waterlogging', count: issues.filter(i => i.type === 'waterlogging').length, color: '#3B82F6' },
    { name: 'Other', count: issues.filter(i => i.type === 'other').length, color: '#8B5CF6' }
  ];

  const issuesBySeverity = [
    { name: 'High', count: issues.filter(i => i.severity === 'high').length, color: '#EF4444' },
    { name: 'Moderate', count: issues.filter(i => i.severity === 'moderate').length, color: '#FBBF24' },
    { name: 'Low', count: issues.filter(i => i.severity === 'low').length, color: '#10B981' }
  ];

  // Mock weekly trend data
  const weeklyTrend = [
    { day: 'Mon', reports: 12, resolved: 8 },
    { day: 'Tue', reports: 19, resolved: 12 },
    { day: 'Wed', reports: 8, resolved: 15 },
    { day: 'Thu', reports: 15, resolved: 10 },
    { day: 'Fri', reports: 22, resolved: 18 },
    { day: 'Sat', reports: 16, resolved: 14 },
    { day: 'Sun', reports: 10, resolved: 12 }
  ];

  // Real-time calculations
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  const approvedIssues = issues.filter(i => i.status === 'approved').length;
  const reportedToAuthority = issues.filter(i => i.status === 'reported-to-authority').length;
  
  const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues * 100).toFixed(1) : '0';
  const avgSeverity = issues.length > 0 
    ? (issues.reduce((sum, issue) => sum + issue.severityScore, 0) / issues.length).toFixed(1)
    : '0';
  
  // Calculate average resolution time
  const resolvedIssuesWithTime = issues.filter(i => i.status === 'resolved' && i.resolvedAt && i.reportedAt);
  const avgResolutionTime = resolvedIssuesWithTime.length > 0 
    ? (resolvedIssuesWithTime.reduce((sum, issue) => {
        const reported = new Date(issue.reportedAt).getTime();
        const resolved = new Date(issue.resolvedAt!).getTime();
        return sum + (resolved - reported) / (1000 * 60 * 60 * 24); // Convert to days
      }, 0) / resolvedIssuesWithTime.length).toFixed(1)
    : '0';
  
  // Calculate total votes
  const totalVotes = issues.reduce((sum, issue) => 
    sum + issue.publicVoting.yesVotes + issue.publicVoting.noVotes, 0
  );
  
  // Calculate community engagement
  const issuesWithVotes = issues.filter(i => 
    i.publicVoting.yesVotes > 0 || i.publicVoting.noVotes > 0
  ).length;
  const communityEngagement = totalIssues > 0 ? (issuesWithVotes / totalIssues * 100).toFixed(1) : '0';

  // Status data for charts
  const statusData = [
    { status: 'Pending', count: pendingIssues },
    { status: 'In Progress', count: inProgressIssues },
    { status: 'Approved', count: approvedIssues },
    { status: 'Reported to Authority', count: reportedToAuthority },
    { status: 'Resolved', count: resolvedIssues }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-cyan-600" />
            <span>Analytics Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into civic issue reporting and resolution
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Range:</span>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Issues</p>
              <p className="text-3xl font-bold text-cyan-600">{totalIssues}</p>
              <p className="text-xs text-green-600 mt-1">Real-time count</p>
            </div>
            <BarChart3 className="w-8 h-8 text-cyan-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-3xl font-bold text-green-600">{resolutionRate}%</p>
              <p className="text-xs text-green-600 mt-1">Live calculation</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Severity</p>
              <p className="text-3xl font-bold text-amber-600">{avgSeverity}/10</p>
              <p className="text-xs text-amber-600 mt-1">Live calculation</p>
            </div>
            <MapPin className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Resolution Time</p>
              <p className="text-3xl font-bold text-cyan-700">{avgResolutionTime}d</p>
              <p className="text-xs text-green-600 mt-1">Real-time data</p>
            </div>
            <Clock className="w-8 h-8 text-cyan-700" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Issues by Type */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issuesByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={issuesBySeverity}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {issuesBySeverity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Report Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reports" stroke="#4F46E5" strokeWidth={2} name="New Reports" />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="status" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Performance Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Area Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Issues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolution Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockAreaStats.map((area) => (
                <tr key={area.area} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {area.area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {area.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {area.pending}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-blue-800">
                      {area.inProgress}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {area.resolved}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${area.resolvedPercentage}%` }}
                        ></div>
                      </div>
                      <span>{area.resolvedPercentage.toFixed(1)}%</span>
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
};

export default AnalyticsPage;