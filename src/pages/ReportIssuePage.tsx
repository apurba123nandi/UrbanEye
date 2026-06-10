import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Issue } from '../types';

const ReportIssuePage: React.FC = () => {
  const { addIssue, currentUser, processIssueWithAI } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pothole' as Issue['type'],
    severityScore: 5
  });
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<{
    angle1: File | null;
    angle2: File | null;
  }>({
    angle1: null,
    angle2: null
  });
  const [imagePreviews, setImagePreviews] = useState<{
    angle1: string;
    angle2: string;
  }>({
    angle1: '',
    angle2: ''
  });
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState<'idle' | 'uploading' | 'analyzing' | 'saving' | 'complete'>('idle');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const fileInputRefs = useRef<{
    angle1: HTMLInputElement | null;
    angle2: HTMLInputElement | null;
  }>({
    angle1: null,
    angle2: null
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, angle: 'angle1' | 'angle2') => {
    const file = e.target.files?.[0];
    if (file) {
      setImages(prev => ({ ...prev, [angle]: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews(prev => ({ ...prev, [angle]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          });
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation({
            lat: 17.3850,
            lng: 78.4867,
            address: 'Hyderabad Center, Telangana, India'
          });
          setGettingLocation(false);
        }
      );
    } else {
      setLocation({
        lat: 17.3850,
        lng: 78.4867,
        address: 'Hyderabad Center, Telangana, India'
      });
      setGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Starting report submission...');
    console.log('📸 Images:', { angle1: !!images.angle1, angle2: !!images.angle2 });
    console.log('📍 Location:', location);
    console.log('📝 Form Data:', formData);
    console.log('👤 Current User:', currentUser);
    
    // Check for required fields
    if (!images.angle1) {
      setError('Please upload at least one image of the issue.');
      console.log('❌ Missing first image');
      return;
    }
    
    if (!location) {
      setError('Please get your current location first.');
      console.log('❌ Missing location');
      return;
    }
    
    if (!formData.title.trim()) {
      setError('Please enter a title for the issue.');
      console.log('❌ Missing title');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStage('uploading');
    setError(null);

    try {
      // Get reporter name - use currentUser if available, otherwise use a default
      const reporterName = currentUser 
        ? ((currentUser as any)?.displayName || currentUser.email?.split('@')[0] || 'Anonymous')
        : 'Anonymous User';
      
      console.log('👤 Current User:', currentUser);
      console.log('📝 Reporter Name:', reporterName);

      // Use AppContext's processIssueWithAI function for proper integration
      const approvedIssue = await processIssueWithAI(
        images.angle1,
        images.angle2 || undefined,
        {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          severity: formData.severityScore >= 7 ? 'high' : formData.severityScore >= 4 ? 'moderate' : 'low',
          severityScore: formData.severityScore,
          location,
          reportedBy: reporterName
        }
      );

      if (approvedIssue) {
        // Issue was approved and auto-poll was created
        console.log('✅ Issue approved! Public voting poll has been automatically created.');
        console.log('📊 Community can now vote Yes/No on this issue');
        console.log('📧 Email will be sent to authorities when 50% threshold is reached');
        
        setPrediction(approvedIssue.aiPrediction);
        setIsSubmitted(true);
      } else {
        // Issue was rejected due to fake images
        setError('Your report was rejected because the images appear to be AI-generated or manipulated. Please upload genuine photos.');
        console.log('❌ Issue rejected: Images appear to be AI-generated');
      }
    } catch (error) {
      setError('Failed to process your report. Please try again.');
      console.error('Report submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (score: number) => {
    if (score >= 7) return 'text-red-600 bg-red-100';
    if (score >= 4) return 'text-amber-600 bg-amber-100';
    return 'text-green-600 bg-green-100';
  };

  const getSeverityLabel = (score: number) => {
    if (score >= 7) return 'High';
    if (score >= 4) return 'Moderate';
    return 'Low';
  };

  const getHarmRiskColor = (risk: string) => {
    if (risk === 'high') return 'text-red-600 bg-red-100';
    if (risk === 'moderate') return 'text-amber-600 bg-amber-100';
    return 'text-green-600 bg-green-100';
  };

  const getHarmRiskIcon = (risk: string) => risk === 'high' ? '🔴' : risk === 'moderate' ? '🟡' : '🟢';

  const getStageMessage = (stage: string) => {
    switch (stage) {
      case 'uploading': return '📤 Optimizing and uploading images (faster now!)...';
      case 'analyzing': return '🤖 Running AI analysis (2-5 seconds)...';
      case 'saving': return '💾 Saving report to database...';
      case 'complete': return '✅ Report submitted successfully!';
      default: return '🚀 Starting submission...';
    }
  };

  if (isSubmitted && prediction) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Issue Reported Successfully!</h2>
          <p className="text-gray-600 mb-8">
            ✅ Your report has been approved by AI analysis!<br/>
            📊 A public voting poll has been automatically created for community feedback.<br/>
            📧 Authorities will be notified when 50% of voters approve the issue.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">🧠 AI Damage Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-600">{prediction.type}</div>
                <div className="text-sm text-gray-500">Predicted Type</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {(prediction.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Confidence</div>
              </div>
              <div>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(formData.severityScore)}`}>
                  {getSeverityLabel(formData.severityScore)} Severity
                </div>
                <div className="text-sm text-gray-500 mt-1">Severity Level</div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-cyan-700">{prediction.estimatedDepth.toFixed(1)} cm</div>
                  <div className="text-sm text-gray-500">Estimated Depth</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{prediction.damageRiskScore.toFixed(1)}/10</div>
                  <div className="text-sm text-gray-500">Damage Risk Score</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl">{getHarmRiskIcon(prediction.humanHarmRisk)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHarmRiskColor(prediction.humanHarmRisk)}`}>
                      {prediction.humanHarmRisk.charAt(0).toUpperCase() + prediction.humanHarmRisk.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Human Harm Risk</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ title: '', description: '', type: 'pothole', severityScore: 5 });
                setImages({ angle1: null, angle2: null });
                setImagePreviews({ angle1: '', angle2: '' });
                setLocation(null);
                setPrediction(null);
              }}
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors"
            >
              Report Another Issue
            </button>
            <button
              onClick={() => window.location.href = '/map'}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View on Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-8">
          <Camera className="w-8 h-8 text-cyan-600" />
          <h1 className="text-3xl font-bold text-gray-900">Report Road Issue</h1>
        </div>
        


        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Dual Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images (Second image is optional) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Angle 1 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                <h4 className="text-sm font-medium text-gray-700 mb-3">📸 Angle 1</h4>
                {imagePreviews.angle1 ? (
                  <div className="relative">
                    <img
                      src={imagePreviews.angle1}
                      alt="Preview Angle 1"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages(prev => ({ ...prev, angle1: null }));
                        setImagePreviews(prev => ({ ...prev, angle1: '' }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-2">Upload first angle</p>
                  </div>
                )}
                <input
                  ref={el => fileInputRefs.current.angle1 = el}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'angle1')}
                  className="hidden"
                  capture="environment"
                />
                {!imagePreviews.angle1 && (
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current.angle1?.click()}
                    className="mt-2 bg-cyan-600 text-white px-3 py-1 rounded text-sm hover:bg-cyan-700 transition-colors"
                  >
                    Choose Image
                  </button>
                )}
              </div>

              {/* Angle 2 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                <h4 className="text-sm font-medium text-gray-700 mb-3">📸 Angle 2 (Optional)</h4>
                {imagePreviews.angle2 ? (
                  <div className="relative">
                    <img
                      src={imagePreviews.angle2}
                      alt="Preview Angle 2"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages(prev => ({ ...prev, angle2: null }));
                        setImagePreviews(prev => ({ ...prev, angle2: '' }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-2">Upload second angle</p>
                  </div>
                )}
                <input
                  ref={el => fileInputRefs.current.angle2 = el}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'angle2')}
                  className="hidden"
                  capture="environment"
                />
                {!imagePreviews.angle2 && (
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current.angle2?.click()}
                    className="mt-2 bg-cyan-600 text-white px-3 py-1 rounded text-sm hover:bg-cyan-700 transition-colors"
                  >
                    Choose Image
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              📋 Tip: First image is required. Second image is optional but helps with better AI analysis accuracy
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="flex items-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50"
              >
                {gettingLocation ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                <span>{gettingLocation ? 'Getting Location...' : 'Use Current Location'}</span>
              </button>
            </div>
            {location && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {location.address}
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Large pothole on Main Street"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Provide additional details about the issue..."
            />
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Issue['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="pothole">Pothole</option>
              <option value="crack">Road Crack</option>
              <option value="waterlogging">Waterlogging</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Severity Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Score: {formData.severityScore}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.severityScore}
              onChange={(e) => setFormData({ ...formData, severityScore: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low (1)</span>
              <span>Moderate (5)</span>
              <span>High (10)</span>
            </div>
            <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(formData.severityScore)}`}>
              {getSeverityLabel(formData.severityScore)} Severity
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!images.angle1 || !images.angle2 || !location || !formData.title || isSubmitting}
            className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>{getStageMessage(submissionStage)}</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Submit Report</span>
              </>
            )}
          </button>

          {(!images.angle1 || !images.angle2 || !location) && (
            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">
                Please upload both images and get your location to submit the report.
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReportIssuePage;