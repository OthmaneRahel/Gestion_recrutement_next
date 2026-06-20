'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Correction pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ForumMapProps {
  location: string;
}

const ForumMap: React.FC<ForumMapProps> = ({ location }) => {
  const [position, setPosition] = useState<[number, number]>([33.5731, -7.5898]); // Casablanca par défaut
  const [loading, setLoading] = useState<boolean>(true);

  // Fonction pour géocoder une adresse
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return { lat: 33.5731, lng: -7.5898 }; // Casablanca par défaut
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return { lat: 33.5731, lng: -7.5898 };
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (location) {
        setLoading(true);
        const coords = await geocodeAddress(location);
        if (coords) {
          setPosition([coords.lat, coords.lng]);
        }
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [location]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{location}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default ForumMap;