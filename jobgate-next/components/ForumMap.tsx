// // // 'use client';

// // // import React, { useState, useEffect } from 'react';
// // // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// // // import L from 'leaflet';
// // // import 'leaflet/dist/leaflet.css';

// // // // Correction pour les icônes Leaflet
// // // delete (L.Icon.Default.prototype as any)._getIconUrl;
// // // L.Icon.Default.mergeOptions({
// // //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// // //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// // //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // // });

// // // interface ForumMapProps {
// // //   location: string;
// // // }

// // // const ForumMap: React.FC<ForumMapProps> = ({ location }) => {
// // //   const [position, setPosition] = useState<[number, number]>([33.5731, -7.5898]); // Casablanca par défaut
// // //   const [loading, setLoading] = useState<boolean>(true);

// // //   // Fonction pour géocoder une adresse
// // //   const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
// // //     try {
// // //       const response = await fetch(
// // //         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
// // //       );
// // //       const data = await response.json();

// // //       if (data && data.length > 0) {
// // //         return {
// // //           lat: parseFloat(data[0].lat),
// // //           lng: parseFloat(data[0].lon),
// // //         };
// // //       }
// // //       return { lat: 33.5731, lng: -7.5898 }; // Casablanca par défaut
// // //     } catch (error) {
// // //       console.error('Erreur de géocodage:', error);
// // //       return { lat: 33.5731, lng: -7.5898 };
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const fetchCoordinates = async () => {
// // //       if (location) {
// // //         setLoading(true);
// // //         const coords = await geocodeAddress(location);
// // //         if (coords) {
// // //           setPosition([coords.lat, coords.lng]);
// // //         }
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchCoordinates();
// // //   }, [location]);

// // //   if (loading) {
// // //     return (
// // //       <div className="h-full flex items-center justify-center bg-gray-100">
// // //         <p>Chargement de la carte...</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <MapContainer
// // //       center={position}
// // //       zoom={13}
// // //       style={{ height: '100%', width: '100%' }}
// // //       scrollWheelZoom={false}
// // //     >
// // //       <TileLayer
// // //         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// // //         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // //       />
// // //       <Marker position={position}>
// // //         <Popup>{location}</Popup>
// // //       </Marker>
// // //     </MapContainer>
// // //   );
// // // };

// // // export default ForumMap;


// // "use client";

// // import { useEffect, useState } from "react";
// // import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// // import L from "leaflet";
// // import "leaflet/dist/leaflet.css";

// // // Correctif nécessaire: les icônes par défaut de Leaflet pointent vers des
// // // fichiers que les bundlers (webpack/turbopack) ne résolvent pas correctement.
// // // On les remplace par des URLs CDN, comme dans l'ancienne app.
// // // @ts-expect-error _getIconUrl n'est pas dans les types mais existe à l'exécution
// // delete L.Icon.Default.prototype._getIconUrl;
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
// //   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
// //   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// // });

// // const DEFAULT_POSITION: [number, number] = [33.5731, -7.5898]; // Casablanca par défaut

// // interface ForumMapProps {
// //   location: string;
// // }

// // async function geocodeAddress(address: string): Promise<[number, number]> {
// //   try {
// //     const res = await fetch(
// //       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
// //     );
// //     const data = await res.json();
// //     if (data && data.length > 0) {
// //       return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
// //     }
// //   } catch (error) {
// //     console.error("Erreur de géocodage:", error);
// //   }
// //   return DEFAULT_POSITION;
// // }

// // export default function ForumMap({ location }: ForumMapProps) {
// //   const [position, setPosition] = useState<[number, number]>(DEFAULT_POSITION);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     let active = true;

// //     if (!location) {
// //       setLoading(false);
// //       return;
// //     }

// //     setLoading(true);
// //     geocodeAddress(location).then((coords) => {
// //       if (!active) return;
// //       setPosition(coords);
// //       setLoading(false);
// //     });

// //     return () => {
// //       active = false;
// //     };
// //   }, [location]);

// //   if (loading) {
// //     return (
// //       <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-500">
// //         Chargement de la carte...
// //       </div>
// //     );
// //   }

// //   return (
// //     <MapContainer
// //       center={position}
// //       zoom={13}
// //       style={{ height: "200px", width: "100%", borderRadius: "0.75rem" }}
// //       scrollWheelZoom={false}
// //     >
// //       <TileLayer
// //         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //       />
// //       <Marker position={position}>
// //         <Popup>{location}</Popup>
// //       </Marker>
// //     </MapContainer>
// //   );
// // }

// "use client";

// import { useEffect, useState, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Correctif pour les icônes Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// const DEFAULT_POSITION: [number, number] = [33.5731, -7.5898];

// interface ForumMapProps {
//   location: string;
//   height?: string | number;
//   zoom?: number;
//   className?: string;
// }

// async function geocodeAddress(address: string): Promise<[number, number]> {
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
//     );
//     const data = await res.json();
//     if (data && data.length > 0) {
//       return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
//     }
//   } catch (error) {
//     console.error("Erreur de géocodage:", error);
//   }
//   return DEFAULT_POSITION;
// }

// export default function ForumMap({ 
//   location, 
//   height = "200px", 
//   zoom = 13,
//   className = ""
// }: ForumMapProps) {
//   const [position, setPosition] = useState<[number, number]>(DEFAULT_POSITION);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const mapRef = useRef<L.Map | null>(null);

//   useEffect(() => {
//     let active = true;

//     if (!location) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     geocodeAddress(location)
//       .then((coords) => {
//         if (!active) return;
//         setPosition(coords);
//         // Centrer la carte sur la nouvelle position
//         if (mapRef.current) {
//           mapRef.current.setView(coords, zoom);
//         }
//       })
//       .catch(() => {
//         if (active) setError("Impossible de charger la carte");
//       })
//       .finally(() => {
//         if (active) setLoading(false);
//       });

//     return () => {
//       active = false;
//     };
//   }, [location, zoom]);

//   if (loading) {
//     return (
//       <div 
//         className={`flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-500 animate-pulse ${className}`}
//         style={{ height }}
//       >
//         Chargement de la carte...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div 
//         className={`flex items-center justify-center bg-gray-100 rounded-lg text-sm text-red ${className}`}
//         style={{ height }}
//       >
//         {error}
//       </div>
//     );
//   }

//   return (
//     <MapContainer
//       center={position}
//       zoom={zoom}
//       style={{ height, width: "100%", borderRadius: "0.75rem" }}
//       scrollWheelZoom={false}
//       ref={mapRef}
//       className={className}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <Marker position={position}>
//         <Popup>{location}</Popup>
//       </Marker>
//     </MapContainer>
//   );
// }










"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DEFAULT_POSITION: [number, number] = [33.5731, -7.5898];

interface ForumMapProps {
  location: string;
  height?: string | number;
  zoom?: number;
  className?: string;
}

async function geocodeAddress(address: string): Promise<[number, number]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (error) {
    console.error("Erreur de géocodage:", error);
  }
  return DEFAULT_POSITION;
}

export default function ForumMap({ 
  location, 
  height = "200px", 
  zoom = 14,
  className = ""
}: ForumMapProps) {
  const [position, setPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    let active = true;

    if (!location) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    geocodeAddress(location)
      .then((coords) => {
        if (!active) return;
        setPosition(coords);
        if (mapRef.current) {
          mapRef.current.setView(coords, zoom);
        }
      })
      .catch(() => {
        if (active) setError("Unable to load the map");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [location, zoom]);

  if (loading) {
    return (
      <div 
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-xs text-gray-400 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-rose-50 rounded-xl text-sm text-rose-500 ${className}`}
        style={{ height }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📍</span>
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-xl overflow-hidden shadow-sm"
      style={{ height }}
    >
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        ref={mapRef}
        className={className}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup className="text-sm font-medium text-gray-800">
            {location}
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Subtle gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}