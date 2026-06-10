import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';

const LeaderboardPage: React.FC = () => {
  const { issues, currentUser } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');

  // Create real-time user statistics from issues data
  const realTimeUsers = useMemo(() => {
    const userStats = new Map<string, { id: string; username: string; reportsCount: number; validationScore: number; badges: string[] }>();
    
    // Initialize with mock users
    mockUsers.forEach(user => {
      userStats.set(user.username, {
        id: user.id,
        username: user.username,
        reportsCount: user.reportsCount,
        validationScore: user.validationScore,
        badges: user.badges
      });
    });
    
    // Update with real-time data from issues
    issues.forEach(issue => {
      const existingUser = userStats.get(issue.reportedBy);
      if (existingUser) {
        existingUser.reportsCount += 1;
        existingUser.validationScore += 10; // 10 points per report
      } else {
        // New user discovered from issues
        userStats.set(issue.reportedBy, {
          id: `user_${issue.reportedBy}`,
          username: issue.reportedBy,
          reportsCount: 1,
          validationScore: 10,
          badges: ['New Contributor']
        });
      }
    });
    
    // Update badges based on report count
    userStats.forEach(user => {
      const badges = [];
      if (user.reportsCount >= 20) badges.push('Top Reporter');
      if (user.reportsCount >= 10) badges.push('Community Guardian');
      if (user.reportsCount >= 5) badges.push('Active Reporter');
      if (user.reportsCount >= 1) badges.push('Contributor');
      
      user.badges = badges.length > 0 ? badges : ['New Contributor'];
    });
    
    return Array.from(userStats.values())
      .filter(user => user.username !== 'admin_user' && user.username !== 'Anonymous User')
      .sort((a, b) => b.validationScore - a.validationScore);
  }, [issues]);

  const sortedUsers = realTimeUsers;

  // Debug logging
  console.log('🏆 LeaderboardPage Debug:');
  console.log('📊 Total Issues:', issues.length);
  console.log('👥 Real-time Users:', realTimeUsers.length);
  console.log('📝 Sorted Users:', sortedUsers);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</div>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Top Reporter':
        return 'bg-purple-100 text-purple-800';
      case 'Community Guardian':
        return 'bg-cyan-100 text-blue-800';
      case 'Active Reporter':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span>Community Leaderboard</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Celebrating our top civic contributors and community champions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all-time">All Time</option>
            <option value="this-month">This Month</option>
            <option value="this-week">This Week</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contributors</p>
              <p className="text-3xl font-bold text-cyan-600">{sortedUsers.length}</p>
            </div>
            <Users className="w-8 h-8 text-cyan-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-green-600">
                {sortedUsers.reduce((sum, user) => sum + user.reportsCount, 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Community Score</p>
              <p className="text-3xl font-bold text-purple-600">
                {sortedUsers.reduce((sum, user) => sum + user.validationScore, 0)}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Top Contributors</h2>
        <div className="flex flex-col md:flex-row justify-center items-end space-y-4 md:space-y-0 md:space-x-8">
          {sortedUsers.slice(0, 3).map((user, index) => {
            const rank = index + 1;
            const heights = ['h-32', 'h-40', 'h-28']; // 2nd, 1st, 3rd
            const orders = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
            const displayIndex = orders.indexOf(index);
            
            return (
              <div key={user.id} className={`flex flex-col items-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}>
                <div className={`${getRankBadge(rank)} ${heights[displayIndex]} w-24 rounded-lg flex flex-col items-center justify-center p-4 shadow-lg`}>
                  <div className="text-2xl font-bold mb-1">#{rank}</div>
                  <div className="text-sm font-medium text-center">{user.validationScore}</div>
                  <div className="text-xs opacity-75">points</div>
                </div>
                <div className="mt-4 text-center">
                  <div className="font-semibold text-gray-900">{user.username}</div>
                  <div className="text-sm text-gray-600">{user.reportsCount} reports</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {user.badges.map((badge, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Full Rankings</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contributor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reports
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Community Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Badges
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user, index) => {
                const rank = index + 1;
                return (
                  <tr key={user.id} className={`hover:bg-gray-50 ${rank <= 3 ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(rank)}
                        <span className={`font-semibold ${rank <= 3 ? 'text-yellow-600' : 'text-gray-900'}`}>
                          #{rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-cyan-600">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-xs text-gray-500">Active contributor</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.reportsCount}</div>
                      <div className="text-xs text-gray-500">total reports</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{user.validationScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.badges.map((badge, idx) => (
                          <span key={idx} className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recognition Section */}
      <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Community Champions!</h2>
        <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
          Every report matters. Help make your community better by reporting issues, validating submissions, and contributing to a safer, more livable city for everyone.
        </p>
        <button className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition-colors">
          Start Contributing
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPage;