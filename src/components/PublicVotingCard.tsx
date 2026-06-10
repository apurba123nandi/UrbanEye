import React from 'react';
import { ThumbsUp, ThumbsDown, Users, Mail, CheckCircle, XCircle } from 'lucide-react';
import { Issue } from '../types';
import { useApp } from '../context/AppContext';

interface PublicVotingCardProps {
  issue: Issue;
}

const PublicVotingCard: React.FC<PublicVotingCardProps> = ({ issue }) => {
  const { voteOnPublicPoll } = useApp();

  const totalVotes = issue.publicVoting.yesVotes + issue.publicVoting.noVotes;
  const yesPercentage = totalVotes > 0 ? (issue.publicVoting.yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (issue.publicVoting.noVotes / totalVotes) * 100 : 0;

  const handleVote = (vote: 'yes' | 'no') => {
    voteOnPublicPoll(issue.id, vote);
  };

  if (!issue.adminApproved || !issue.publicVoting.enabled) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-2 text-gray-500">
          <XCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Public voting not available</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {!issue.adminApproved 
            ? "Waiting for admin approval before voting can begin"
            : "Voting has been disabled for this report"
          }
        </p>
      </div>
    );
  }

  // Check if any image is AI-generated
  const hasAIGeneratedImage = issue.imageAuthenticity.angle1 === 'ai-generated' || 
                              issue.imageAuthenticity.angle2 === 'ai-generated';

  if (hasAIGeneratedImage) {
    return (
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-center space-x-2 text-red-600">
          <XCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Report Invalid</span>
        </div>
        <p className="text-xs text-red-500 mt-1">
          🚫 Image flagged as AI-generated – voting disabled
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-cyan-600" />
        <h3 className="text-lg font-semibold text-gray-900">Community Validation</h3>
        {issue.publicVoting.emailSent && (
          <div className="flex items-center space-x-1 text-green-600">
            <Mail className="w-4 h-4" />
            <span className="text-xs">Authorities notified</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4">
        Help verify this issue by voting. Your input helps local authorities prioritize genuine reports.
      </p>

      <div className="space-y-4">
        {/* Voting Question */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">
            🗳️ Do you confirm this issue is genuine and requires attention?
          </h4>
          
          <div className="flex space-x-3">
            <button
              onClick={() => handleVote('yes')}
              className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>✅ Yes, Genuine</span>
            </button>
            
            <button
              onClick={() => handleVote('no')}
              className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>❌ No, Invalid</span>
            </button>
          </div>
        </div>

        {/* Vote Results */}
        {totalVotes > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Community Consensus</span>
              <span>{totalVotes} total votes</span>
            </div>
            
            {/* Yes Votes Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">✅ Genuine ({issue.publicVoting.yesVotes})</span>
                <span className="text-green-600">{yesPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${yesPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* No Votes Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-red-600 font-medium">❌ Invalid ({issue.publicVoting.noVotes})</span>
                <span className="text-red-600">{noPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${noPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Threshold Status */}
            <div className="mt-4 p-3 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Authority Notification Threshold</span>
                <span className="text-sm font-medium text-gray-900">{issue.publicVoting.threshold}%</span>
              </div>
              
              {yesPercentage >= issue.publicVoting.threshold ? (
                <div className="flex items-center space-x-2 mt-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {issue.publicVoting.emailSent 
                      ? "✅ Authorities have been notified!"
                      : "🔔 Threshold reached - notifying authorities..."
                    }
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-gray-500">
                  <span className="text-sm">
                    Need {(issue.publicVoting.threshold - yesPercentage).toFixed(1)}% more "Yes" votes to notify authorities
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {totalVotes === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Be the first to vote on this issue!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicVotingCard;