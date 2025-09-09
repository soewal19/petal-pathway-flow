import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation } from 'lucide-react';

interface MapboxMapProps {
  onAddressSelect: (address: string, coordinates: [number, number]) => void;
  initialAddress?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ onAddressSelect, initialAddress }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(initialAddress || '');
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 2,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          map.current?.setCenter(coords);
          map.current?.setZoom(14);
          addMarker(coords);
        },
        () => {
          // Default to a major city if geolocation fails
          const defaultCoords: [number, number] = [-74.006, 40.7128]; // New York
          map.current?.setCenter(defaultCoords);
          map.current?.setZoom(10);
        }
      );
    }

    // Add click handler
    map.current.on('click', async (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      addMarker(coords);
      
      // Reverse geocoding to get address
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${mapboxToken}`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const address = data.features[0].place_name;
          setSelectedAddress(address);
          setCoordinates(coords);
          onAddressSelect(address, coords);
        }
      } catch (error) {
        console.error('Error getting address:', error);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, onAddressSelect]);

  const addMarker = (coords: [number, number]) => {
    if (marker.current) {
      marker.current.remove();
    }
    
    marker.current = new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat(coords)
      .addTo(map.current!);
  };

  const searchAddress = async () => {
    if (!selectedAddress || !mapboxToken) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(selectedAddress)}.json?access_token=${mapboxToken}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const coords: [number, number] = feature.center;
        map.current?.setCenter(coords);
        map.current?.setZoom(14);
        addMarker(coords);
        setCoordinates(coords);
        onAddressSelect(feature.place_name, coords);
        setSelectedAddress(feature.place_name);
      }
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  if (!mapboxToken) {
    return (
      <div className="space-y-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-800">
          <MapPin className="w-5 h-5" />
          <h3 className="font-semibold">Mapbox Token Required</h3>
        </div>
        <p className="text-sm text-yellow-700">
          To use the interactive map for delivery address selection, please enter your Mapbox public token. 
          You can get one at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
        </p>
        <div className="space-y-2">
          <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
          <div className="flex gap-2">
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => setMapboxToken(mapboxToken)} variant="outline">
              Set Token
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address-search">Search Address</Label>
        <div className="flex gap-2">
          <Input
            id="address-search"
            type="text"
            placeholder="Enter address or click on map"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
          />
          <Button onClick={searchAddress} variant="outline" size="sm">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <div ref={mapContainer} className="w-full h-64 rounded-lg border" />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-600">
          Click on map to select delivery address
        </div>
      </div>
      
      {selectedAddress && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Selected Address:</p>
              <p className="text-sm text-green-700">{selectedAddress}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;