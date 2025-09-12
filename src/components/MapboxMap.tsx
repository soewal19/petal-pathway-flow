import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Navigation, Locate, Clock, Store } from 'lucide-react';
import { shops } from '@/data/flowers';

interface MapboxMapProps {
  onAddressSelect: (address: string, coordinates: [number, number]) => void;
  initialAddress?: string;
}

interface DeliveryRoute {
  duration: number;
  distance: number;
  shop: any;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ onAddressSelect, initialAddress }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const shopMarkers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState(() => {
    return localStorage.getItem('mapbox-token') || '';
  });
  const [inputToken, setInputToken] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(initialAddress || '');
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [deliveryRoute, setDeliveryRoute] = useState<DeliveryRoute | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Add shop markers
  const addShopMarkers = useCallback(() => {
    if (!map.current) return;

    // Clear existing shop markers
    shopMarkers.current.forEach(marker => marker.remove());
    shopMarkers.current = [];

    // Add markers for each shop
    shops.forEach((shop) => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div class="bg-green-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      `;
      el.className = 'cursor-pointer hover:scale-110 transition-transform';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(shop.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm">${shop.name}</h3>
              <p class="text-xs text-gray-600">${shop.address}</p>
              <p class="text-xs text-green-600">Open: ${shop.hours}</p>
            </div>
          `))
        .addTo(map.current);

      shopMarkers.current.push(marker);
    });
  }, []);

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

    // Add shop markers when map loads
    map.current.on('load', () => {
      addShopMarkers();
    });

    // Get user's location on load
    getCurrentLocation();

    // Add click handler
    map.current.on('click', async (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      await selectDeliveryLocation(coords);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, onAddressSelect, addShopMarkers]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          setUserLocation(coords);
          map.current?.setCenter(coords);
          map.current?.setZoom(14);
          if (selectedAddress === '') {
            selectDeliveryLocation(coords);
          }
        },
        () => {
          // Default to Kiev if geolocation fails
          const defaultCoords: [number, number] = [30.5234, 50.4501];
          map.current?.setCenter(defaultCoords);
          map.current?.setZoom(10);
        }
      );
    }
  }, [selectedAddress]);

  const useCurrentLocation = async () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          setUserLocation(coords);
          map.current?.setCenter(coords);
          map.current?.setZoom(16);
          await selectDeliveryLocation(coords);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const selectDeliveryLocation = async (coords: [number, number]) => {
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
        
        // Calculate delivery route to nearest shop
        await calculateDeliveryRoute(coords);
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  const calculateDeliveryRoute = async (deliveryCoords: [number, number]) => {
    if (shops.length === 0) return;

    // Find nearest shop
    let nearestShop = shops[0];
    let minDistance = Infinity;

    for (const shop of shops) {
      const distance = Math.sqrt(
        Math.pow(shop.coordinates[0] - deliveryCoords[0], 2) + 
        Math.pow(shop.coordinates[1] - deliveryCoords[1], 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestShop = shop;
      }
    }

    try {
      // Get route from nearest shop to delivery location
      const routeResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${nearestShop.coordinates[0]},${nearestShop.coordinates[1]};${deliveryCoords[0]},${deliveryCoords[1]}?access_token=${mapboxToken}&geometries=geojson`
      );
      const routeData = await routeResponse.json();
      
      if (routeData.routes && routeData.routes.length > 0) {
        const route = routeData.routes[0];
        const duration = Math.round(route.duration / 60); // Convert to minutes
        const distance = (route.distance / 1000).toFixed(1); // Convert to km
        
        setDeliveryRoute({
          duration: duration + Math.floor(Math.random() * 11) + 25, // Add base delivery time
          distance: parseFloat(distance),
          shop: nearestShop
        });

        // Draw route on map
        if (map.current?.getSource('route')) {
          map.current.removeLayer('route');
          map.current.removeSource('route');
        }

        map.current?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        });

        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#22c55e',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  const addMarker = (coords: [number, number]) => {
    if (marker.current) {
      marker.current.remove();
    }
    
    // Create custom delivery marker
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="bg-red-500 text-white p-2 rounded-full shadow-lg border-2 border-white animate-pulse">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `;
    
    marker.current = new mapboxgl.Marker(el)
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
        await selectDeliveryLocation(coords);
      }
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  const handleSetToken = () => {
    if (inputToken.trim()) {
      localStorage.setItem('mapbox-token', inputToken.trim());
      setMapboxToken(inputToken.trim());
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
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSetToken()}
            />
            <Button onClick={handleSetToken} variant="outline">
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
        <div className="flex justify-between items-center">
          <Label htmlFor="address-search">Delivery Address</Label>
          <Button 
            onClick={useCurrentLocation} 
            variant="outline" 
            size="sm"
            disabled={isLocating}
          >
            {isLocating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600" />
            ) : (
              <Locate className="w-4 h-4" />
            )}
            <span className="ml-1">Use Current Location</span>
          </Button>
        </div>
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
        <div ref={mapContainer} className="w-full h-80 rounded-lg border" />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Store className="w-3 h-3 text-green-500" />
            <span>Green: Shops</span>
            <MapPin className="w-3 h-3 text-red-500 ml-2" />
            <span>Red: Delivery</span>
          </div>
        </div>
      </div>
      
      {selectedAddress && (
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Delivery Address:</p>
                  <p className="text-sm text-gray-600">{selectedAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {deliveryRoute && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">
                        {deliveryRoute.duration} minutes • {deliveryRoute.distance} km
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">From</p>
                    <p className="text-sm font-medium text-gray-800">{deliveryRoute.shop.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default MapboxMap;