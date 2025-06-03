import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import type { RescueReport } from "@shared/schema";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function InteractiveMap() {
  const [selectedReport, setSelectedReport] = useState<RescueReport | null>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  const { data: reports } = useQuery<RescueReport[]>({
    queryKey: ["/api/rescue-reports"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#EAB308'; // yellow-500
      case 'assigned':
        return '#3B82F6'; // blue-500
      case 'in_progress':
        return '#8B5CF6'; // purple-500
      case 'completed':
        return '#10B981'; // green-500
      case 'cancelled':
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3 text-white" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-white" />;
      default:
        return <AlertTriangle className="w-3 h-3 text-white" />;
    }
  };

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      // Check if we have the API key
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.log("Google Maps API key not found. Using fallback map.");
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        setIsGoogleMapsLoaded(true);
      };

      script.onerror = () => {
        console.error("Failed to load Google Maps API");
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (isGoogleMapsLoaded && mapRef.current && !map) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        zoom: 11,
        styles: [
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "transit",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      setMap(googleMap);
    }
  }, [isGoogleMapsLoaded, map]);

  // Add markers for rescue reports
  useEffect(() => {
    if (map && reports) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers: any[] = [];
      const infoWindow = new window.google.maps.InfoWindow();

      reports.forEach(report => {
        // Use geocoding if we have actual addresses, or default coordinates
        const position = getReportPosition(report);
        
        const marker = new window.google.maps.Marker({
          position,
          map,
          title: report.location,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: getStatusColor(report.status),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        marker.addListener('click', () => {
          setSelectedReport(report);
          infoWindow.setContent(`
            <div class="p-2">
              <h4 class="font-semibold text-sm mb-1">Report #${report.id}</h4>
              <p class="text-xs text-gray-600 mb-2">${report.location}</p>
              <p class="text-xs text-gray-500 mb-2">${report.description}</p>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${report.status === 'pending' ? 'yellow' : report.status === 'completed' ? 'green' : 'blue'}-100 text-${report.status === 'pending' ? 'yellow' : report.status === 'completed' ? 'green' : 'blue'}-800">
                ${report.status}
              </span>
              ${report.urgent ? '<span class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Urgent</span>' : ''}
            </div>
          `);
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      });

      setMarkers(newMarkers);
    }
  }, [map, reports]);

  // Helper function to get report position (geocoding or default)
  const getReportPosition = (report: RescueReport) => {
    // If we have latitude/longitude from the report, use them
    if (report.latitude && report.longitude) {
      return { 
        lat: parseFloat(report.latitude), 
        lng: parseFloat(report.longitude) 
      };
    }
    
    // Otherwise, use default positions around NYC for demo
    const defaultPositions = [
      { lat: 40.7589, lng: -73.9851 }, // Times Square area
      { lat: 40.7505, lng: -73.9934 }, // Herald Square area
      { lat: 40.7614, lng: -73.9776 }, // Central Park area
      { lat: 40.7282, lng: -73.9942 }, // Greenwich Village area
      { lat: 40.7061, lng: -74.0087 }, // Financial District area
    ];
    
    return defaultPositions[report.id % defaultPositions.length];
  };

  // Fallback map when Google Maps API is not available
  const FallbackMap = () => (
    <div className="w-full h-80 rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 relative">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100">
        {/* Grid lines for map effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-gray-400"
              style={{ top: `${i * 10}%` }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-gray-400"
              style={{ left: `${i * 10}%` }}
            />
          ))}
        </div>
      </div>

      {/* Map Pins for fallback */}
      {reports?.slice(0, 5).map((report, index) => {
        const mockCoordinates = [
          { top: '20%', left: '25%' },
          { top: '40%', right: '30%' },
          { top: '60%', left: '40%' },
          { top: '30%', right: '20%' },
          { top: '70%', left: '60%' },
        ];
        const coords = mockCoordinates[index] || { top: '50%', left: '50%' };
        return (
          <div
            key={report.id}
            className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform flex items-center justify-center`}
            style={{ ...coords, backgroundColor: getStatusColor(report.status) }}
            onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
            title={`${report.location} - ${report.status}`}
          >
            {getStatusIcon(report.status)}
          </div>
        );
      })}

      {/* Selected Report Info */}
      {selectedReport && (
        <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-lg max-w-sm">
          <h4 className="font-semibold text-sm mb-1">Report #{selectedReport.id}</h4>
          <p className="text-xs text-gray-600 mb-2">{selectedReport.location}</p>
          <p className="text-xs text-gray-500 mb-2">{selectedReport.description}</p>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              selectedReport.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              selectedReport.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {selectedReport.status}
            </span>
            {selectedReport.urgent && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Urgent
              </span>
            )}
          </div>
        </div>
      )}

      {/* Default Message */}
      {(!reports || reports.length === 0) && (
        <div className="absolute inset-4 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="text-pink-600 w-12 h-12 mx-auto mb-2" />
            <p className="text-gray-700 font-medium">Interactive Rescue Map</p>
            <p className="text-sm text-gray-500">Report locations will appear here</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="bg-white shadow-xl rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <MapPin className="text-pink-600 w-6 h-6 mr-3" />
          <h3 className="text-xl font-semibold text-pink-700">Rescue Locations Map</h3>
        </div>
        
        {isGoogleMapsLoaded ? (
          <div 
            ref={mapRef} 
            className="w-full h-80 rounded-xl overflow-hidden"
          />
        ) : (
          <FallbackMap />
        )}

        {/* Map Legend */}
        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-semibold mb-2">Report Status Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Assigned</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
