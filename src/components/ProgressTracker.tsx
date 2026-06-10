import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProgressData {
  totalSubmitted: number;
  totalResolved: number;
  totalInProgress: number;
  totalPending: number;
  resolutionRate: number;
  avgResolutionTime: number;
}

const ProgressTracker: React.FC = () => {
  const { issues } = useApp();
  const [progressData, setProgressData] = useState<ProgressData>({
    totalSubmitted: 0,
    totalResolved: 0,
    totalInProgress: 0,
    totalPending: 0,
    resolutionRate: 0,
    avgResolutionTime: 0
  });

  useEffect(() => {
    const calculateProgress = () => {
      const totalSubmitted = issues.length;
      const totalResolved = issues.filter(i => i.status === 'resolved').length;
      const totalInProgress = issues.filter(i => i.status === 'in-progress').length;
      const totalPending = issues.filter(i => i.status === 'pending' || i.status === 'approved').length;
      
      const resolutionRate = totalSubmitted > 0 ? (totalResolved / totalSubmitted) * 100 : 0;
      const avgResolutionTime = calculateAvgResolutionTime();

      setProgressData({
        totalSubmitted,
        totalResolved,
        totalInProgress,
        totalPending,
        resolutionRate,
        avgResolutionTime
      });
    };

    calculateProgress();
  }, [issues]);

  const calculateAvgResolutionTime = (): number => {
    const resolvedIssues = issues.filter(i => i.status === 'resolved' && i.resolvedAt);
    if (resolvedIssues.length === 0) return 0;
    
    const totalDays = resolvedIssues.reduce((sum, issue) => {
      const reportedDate = new Date(issue.reportedAt);
      const resolvedDate = new Date(issue.resolvedAt!);
      const diffTime = resolvedDate.getTime() - reportedDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return sum + diffDays;
    }, 0);
    
    return totalDays / resolvedIssues.length;
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6 text-cyan-600" />
        <h3 className="text-lg font-semibold text-gray-900">Real-Time Progress</h3>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-600">{progressData.totalSubmitted}</div>
          <div className="text-sm text-gray-600">Total Submitted</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{progressData.totalResolved}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">{progressData.totalInProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{progressData.totalPending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>

      {/* Resolution Rate */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Resolution Rate</span>
          </div>
          <span className={`text-sm font-bold ${getProgressColor(progressData.resolutionRate)}`}>
            {progressData.resolutionRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(progressData.resolutionRate)}`}
            style={{ width: `${Math.min(progressData.resolutionRate, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Average Resolution Time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Avg Resolution Time</span>
        </div>
        <span className="text-sm font-bold text-cyan-700">
          {progressData.avgResolutionTime > 0 ? `${progressData.avgResolutionTime.toFixed(1)} days` : 'N/A'}
        </span>
      </div>

      {/* Status Distribution */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Status Distribution</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Resolved</span>
            </div>
            <span className="text-sm font-medium">{progressData.totalResolved}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">In Progress</span>
            </div>
            <span className="text-sm font-medium">{progressData.totalInProgress}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <span className="text-sm font-medium">{progressData.totalPending}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 