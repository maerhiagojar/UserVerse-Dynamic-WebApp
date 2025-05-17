
import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

// MapTiler token with a default value
const DEFAULT_TOKEN = 'E09050bbYGdbHHcnIAW6'; 

interface MapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markerTitle?: string;
  onMapClick?: (lng: number, lat: number) => void;
  height?: string;
  interactive?: boolean;
  onAddressUpdate?: (address: string, lat: number, lng: number) => void;
}

const Map = ({
  latitude = 0,
  longitude = 0,
  zoom = 9,
  markerTitle,
  onMapClick,
  height = '400px',
  interactive = true,
  onAddressUpdate
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapTilerKey, setMapTilerKey] = useState<string>(() => {
    return localStorage.getItem('maptiler_key') || DEFAULT_TOKEN;
  });
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);
  const [tokenInput, setTokenInput] = useState<string>(mapTilerKey);
  const [mapError, setMapError] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentMarker, setCurrentMarker] = useState<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapTilerKey || mapTilerKey === 'YOUR_MAPTILER_KEY') {
      setShowTokenInput(true);
      return;
    }

    // Clean up previous map instance
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    try {
      console.log(`Initializing map with coordinates: [${longitude}, ${latitude}]`);
      
      // Validate coordinates
      const validLat = typeof latitude === 'number' && !isNaN(latitude) && latitude >= -90 && latitude <= 90;
      const validLng = typeof longitude === 'number' && !isNaN(longitude) && longitude >= -180 && longitude <= 180;
      
      if (!validLat || !validLng) {
        throw new Error(`Invalid coordinates: lat=${latitude}, lng=${longitude}`);
      }
      
      // Create MapTiler map
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${mapTilerKey}`,
        center: [longitude, latitude],
        zoom: zoom,
        interactive: interactive
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      if (validLat && validLng) {
        const marker = new maplibregl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map.current);

        setCurrentMarker(marker);

        if (markerTitle) {
          marker.setPopup(new maplibregl.Popup().setHTML(`<h3>${markerTitle}</h3>`));
        }
      }

      if (onMapClick && interactive) {
        map.current.on('click', (e) => {
          onMapClick(e.lngLat.lng, e.lngLat.lat);
          
          // Update marker position when map is clicked
          if (currentMarker) {
            currentMarker.remove();
          }
          
          const newMarker = new maplibregl.Marker()
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .addTo(map.current!);
            
          setCurrentMarker(newMarker);
          
          // Get address from coordinates using MapTiler Geocoding API
          fetchAddressFromCoordinates(e.lngLat.lng, e.lngLat.lat);
        });
      }
      
      // Reset error state if map loads successfully
      setMapError(null);

    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(String(error));
      setShowTokenInput(true);
    }

    // Return cleanup function
    return () => {
      // Fix: Check if map.current exists before calling remove
      if (map.current) {
        try {
          map.current.remove();
        } catch (error) {
          console.error("Error removing map:", error);
        }
        map.current = null;
      }
    };
  }, [latitude, longitude, zoom, markerTitle, onMapClick, interactive, mapTilerKey]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput && tokenInput !== 'YOUR_MAPTILER_KEY') {
      localStorage.setItem('maptiler_key', tokenInput);
      setMapTilerKey(tokenInput);
      setShowTokenInput(false);
      setMapError(null);
    }
  };

  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${mapTilerKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        // Update map position
        if (map.current) {
          map.current.flyTo({ center: [lng, lat], zoom: 14 });
        }
        
        // Update marker
        if (currentMarker) {
          currentMarker.remove();
        }
        
        if (map.current) {
          const newMarker = new maplibregl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current);
            
          setCurrentMarker(newMarker);
          
          if (markerTitle) {
            newMarker.setPopup(new maplibregl.Popup().setHTML(`<h3>${markerTitle}</h3>`));
          }
        }
        
        // Call the callback if provided
        if (onAddressUpdate) {
          onAddressUpdate(address, lat, lng);
        }
        
        // If onMapClick is provided, call it to update parent component state
        if (onMapClick) {
          onMapClick(lng, lat);
        }
      } else {
        console.error("No results found for the address");
      }
    } catch (error) {
      console.error("Error searching for address:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const fetchAddressFromCoordinates = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${mapTilerKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const foundAddress = data.features[0].place_name || data.features[0].text || '';
        setAddress(foundAddress);
        
        if (onAddressUpdate) {
          onAddressUpdate(foundAddress, lat, lng);
        }
      }
    } catch (error) {
      console.error("Error fetching address from coordinates:", error);
    }
  };

  return (
    <div className="w-full">
      {showTokenInput ? (
        <div className="p-4 border rounded-lg bg-gray-50">
          {mapError && (
            <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">
              {mapError}
            </div>
          )}
          <p className="mb-2 text-sm text-gray-600">
            Please enter your MapTiler API key to display the map. You can get one for free at{" "}
            <a href="https://maptiler.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              maptiler.com
            </a>
          </p>
          <form onSubmit={handleTokenSubmit} className="flex gap-2">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Enter your MapTiler API key"
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-primary text-white rounded-md text-sm"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-3">
          <form onSubmit={handleAddressSearch} className="flex gap-2">
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter an address to search"
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isSearching}
              className="flex items-center gap-1"
            >
              {isSearching ? (
                <span className="loader"></span>
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </form>
          <div ref={mapContainer} style={{ height }} className="rounded-lg overflow-hidden maplibre-map" />
        </div>
      )}
    </div>
  );
};

export default Map;
