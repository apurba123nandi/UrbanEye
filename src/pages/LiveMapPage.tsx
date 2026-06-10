import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Filter, ThumbsUp, ThumbsDown, Eye, MapPin, Navigation, Crosshair, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Hyderabad coordinates
const HYDERABAD_CENTER = [17.3850, 78.4867];

// Component to handle map location updates
const LocationMarker: React.FC<{ userLocation: { lat: number; lng: number } | null }> = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 14);
    }
  }, [userLocation, map]);

  if (!userLocation) return null;

  return (
    <Marker
      position={[userLocation.lat, userLocation.lng]}
      icon={new Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(`
          <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#3B82F6"/>
            <circle cx="12.5" cy="12.5" r="5" fill="white"/>
            <circle cx="12.5" cy="12.5" r="2" fill="#3B82F6"/>
          </svg>
        `)}`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      })}
    >
      <Popup>
        <div className="text-center">
          <div className="font-semibold text-cyan-700">Your Location</div>
          <div className="text-sm text-gray-600">
            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const LiveMapPage: React.FC = () => {
  const { issues, voteOnIssue } = useApp();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  // Auto-detect location on component mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationPermission('granted');
        setIsGettingLocation(false);
        
        // Check if location is in Hyderabad area (roughly within 50km radius)
        const distance = getDistanceFromHyderabad(latitude, longitude);
        if (distance > 50) {
          setLocationError('You are outside Hyderabad. Showing Hyderabad center.');
        }
      },
      (error) => {
        console.error('Location error:', error);
        setLocationPermission('denied');
        setIsGettingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const getDistanceFromHyderabad = (lat: number, lng: number) => {
    const hyderabadLat = HYDERABAD_CENTER[0];
    const hyderabadLng = HYDERABAD_CENTER[1];
    
    const R = 6371; // Earth's radius in km
    const dLat = (lat - hyderabadLat) * Math.PI / 180;
    const dLng = (lng - hyderabadLng) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(hyderabadLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredIssues = issues.filter(issue => {
    const severityMatch = selectedSeverity === 'all' || issue.severity === selectedSeverity;
    const statusMatch = selectedStatus === 'all' || issue.status === selectedStatus;
    return severityMatch && statusMatch;
  });

  // Debug logging to confirm all users see all reports
  console.log('🗺️ LiveMapPage Debug:');
  console.log('📊 Total Issues Available:', issues.length);
  console.log('🔍 Filtered Issues Shown:', filteredIssues.length);
  console.log('👥 All Users Can See All Reports:', true);
  console.log('📍 Map Markers:', filteredIssues.map(i => ({ id: i.id, title: i.title, reportedBy: i.reportedBy })));

  const getMarkerColor = (severity: string, status: string) => {
    if (status === 'resolved') return '#10B981'; // Green
    if (severity === 'high') return '#EF4444'; // Red
    if (severity === 'moderate') return '#FBBF24'; // Amber
    return '#10B981'; // Green for low
  };

  const createCustomIcon = (severity: string, status: string) => {
    const color = getMarkerColor(severity, status);
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="${color}"/>
          <circle cx="12.5" cy="12.5" r="5" fill="white"/>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'in-progress': { color: 'bg-cyan-100 text-blue-800', label: 'In Progress' },
      resolved: { color: 'bg-green-100 text-green-800', label: 'Resolved' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-cyan-600" />
              <span>Hyderabad Live Issue Map</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time view of ALL reported issues in Hyderabad - visible to everyone ({filteredIssues.length} shown)
            </p>
          </div>
          
          {/* Location and Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Location Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={detectUserLocation}
                disabled={isGettingLocation}
                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
              >
                {isGettingLocation ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Crosshair className="w-4 h-4" />
                )}
                <span>{isGettingLocation ? 'Detecting...' : 'My Location'}</span>
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Location Error Alert */}
      {locationError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{locationError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] as [number, number] : HYDERABAD_CENTER as [number, number]}
          zoom={userLocation ? 14 : 12}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User Location Marker */}
          <LocationMarker userLocation={userLocation} />
          
          {filteredIssues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.location.lat, issue.location.lng] as [number, number]}
              icon={createCustomIcon(issue.severity, issue.status)}
            >
              <Popup className="custom-popup">
                <div className="w-64 p-2">
                  <img
                    src={issue.images.angle1}
                    alt={issue.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    {getSeverityBadge(issue.severity)}
                    {getStatusBadge(issue.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    <div>Type: {issue.type}</div>
                    <div>Reported: {new Date(issue.reportedAt).toLocaleDateString()}</div>
                    <div>By: {issue.reportedBy}</div>
                    <div>Admin Approved: {issue.adminApproved ? '✅' : '❌'}</div>
                  </div>
                  
                  <div className="border-t pt-2">
                    {issue.publicVoting.enabled ? (
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Public Voting</div>
                        <div className="text-xs space-y-1">
                          <div className="text-green-600">✅ Yes: {issue.publicVoting.yesVotes}</div>
                          <div className="text-red-600">❌ No: {issue.publicVoting.noVotes}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        {issue.adminApproved ? 'Voting enabled' : 'Awaiting admin approval'}
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
          <h3 className="font-semibold text-gray-900 mb-2">Map Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>High Severity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span>Moderate Severity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Low/Resolved</span>
            </div>
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10 min-w-48">
          <h3 className="font-semibold text-gray-900 mb-3">Real-Time Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Issues:</span>
              <span className="font-semibold">{filteredIssues.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">High Severity:</span>
              <span className="font-semibold text-red-600">{filteredIssues.filter(i => i.severity === 'high').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-600">Moderate:</span>
              <span className="font-semibold text-amber-600">{filteredIssues.filter(i => i.severity === 'moderate').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Resolved:</span>
              <span className="font-semibold text-green-600">{filteredIssues.filter(i => i.status === 'resolved').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-700">In Progress:</span>
              <span className="font-semibold text-cyan-700">{filteredIssues.filter(i => i.status === 'in-progress').length}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Resolution Rate:</span>
                <span className="font-semibold text-gray-900">
                  {filteredIssues.length > 0 
                    ? ((filteredIssues.filter(i => i.status === 'resolved').length / filteredIssues.length) * 100).toFixed(1)
                    : '0'}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMapPage;