import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Map, Shield, BarChart3, Users, CheckCircle, Vote } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProgressTracker from '../components/ProgressTracker';
import PublicVotingCard from '../components/PublicVotingCard';

const HomePage: React.FC = () => {
  const { issues } = useApp();
  
  const features = [
    {
      icon: Camera,
      title: 'Report Issues',
      description: 'Capture and report road issues with AI-powered classification',
      color: 'text-cyan-600 bg-cyan-100'
    },
    {
      icon: Map,
      title: 'Live Map',
      description: 'View real-time issue locations with interactive mapping',
      color: 'text-cyan-600 bg-cyan-100'
    },
    {
      icon: Shield,
      title: 'Admin Control',
      description: 'Comprehensive admin panel for issue management',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Data visualization and reporting insights',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Crowd validation and leaderboard system',
      color: 'text-amber-600 bg-amber-100'
    },
    {
      icon: CheckCircle,
      title: 'Track Status',
      description: 'Monitor issue resolution progress in real-time',
      color: 'text-emerald-600 bg-emerald-100'
    }
  ];

  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues * 100).toFixed(1) : '0';
  
  // Get unique users who have submitted reports
  const uniqueUsers = new Set(issues.map(issue => issue.reportedBy)).size;
  
  const stats = [
    { label: 'Issues Reported', value: totalIssues.toString(), color: 'text-cyan-600' },
    { label: 'Active Contributors', value: uniqueUsers.toString(), color: 'text-purple-600' },
    { label: 'In Progress', value: inProgressIssues.toString(), color: 'text-cyan-700' },
    { label: 'Resolution Rate', value: `${resolutionRate}%`, color: 'text-green-600' }
  ];

  // Get active polls (issues with public voting enabled)
  const activePolls = issues.filter(issue => 
    issue.publicVoting.enabled && 
    issue.adminApproved && 
    issue.status !== 'rejected'
  ).slice(0, 3); // Show only top 3 polls

  // Debug logging
  console.log('🏠 HomePage Debug:');
  console.log('📊 Total Issues:', totalIssues);
  console.log('👥 Active Contributors:', uniqueUsers);
  console.log('🗳️ Active Polls:', activePolls.length);
  console.log('📝 All Issues:', issues);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              UrbanEye by Team Technova
              <span className="block text-cyan-300">AI-Powered Civic Issue Reporting</span>
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              Empowering communities with AI-powered civic issue reporting, community validation, and automated authority notifications for better infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/report"
                className="bg-white text-cyan-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-50 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Report an Issue</span>
              </Link>
              <Link
                to="/map"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-cyan-900 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Map className="w-5 h-5" />
                <span>View Live Map</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Community Statistics</h2>
            <p className="text-gray-600">Live data showing community impact and engagement</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Progress Tracker */}
          <div className="max-w-4xl mx-auto">
            <ProgressTracker />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Civic Reporting Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From AI-powered issue detection to community validation, UrbanEye provides all the tools needed for effective civic engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Polls Section */}
      {activePolls.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
                <Vote className="w-8 h-8 text-cyan-600" />
                <span>Active Community Polls</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Help validate recent reports and contribute to community decision-making.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePolls.map((issue) => (
                <div key={issue.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>By: {issue.reportedBy}</span>
                      <span>•</span>
                      <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <PublicVotingCard issue={issue} />
                </div>
              ))}
            </div>

            {activePolls.length >= 3 && (
              <div className="text-center mt-8">
                <Link
                  to="/reports"
                  className="inline-flex items-center space-x-2 bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors"
                >
                  <Vote className="w-5 h-5" />
                  <span>View All Polls</span>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-cyan-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens making their communities better through civic reporting and collaboration.
          </p>
          <Link
            to="/report"
            className="bg-white text-cyan-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-50 transition-colors inline-flex items-center space-x-2"
          >
            <Camera className="w-5 h-5" />
            <span>Start Reporting</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;