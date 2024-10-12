import React, { useEffect, useRef, useState } from 'react';
import { Deck } from '@deck.gl/core';
import { PathLayer } from '@deck.gl/layers';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';

const cityData = new Map();
cityData.set("Frankfurt", { lat: 50.1109, lng: 8.6821 });
cityData.set("Munich", { lat: 48.1371, lng: 11.5761 });
cityData.set("Kaiserslautern", { lat: 49.4586, lng: 7.7496 });
cityData.set("Saarbrucken", { lat: 49.2343, lng: 6.9614 });
cityData.set("Stuttgart", { lat: 48.7823, lng: 9.1833 });
cityData.set("Karlsruhe", { lat: 49.0135, lng: 8.4041 });
cityData.set("Trier", { lat: 49.7527, lng: 6.6503 });
cityData.set("Mainz", { lat: 49.9975, lng: 8.2733 });
cityData.set("Berlin", { lat: 52.5200, lng: 13.4050 });

const mapStyles = [
  {
    featureType: 'all',
    elementType: 'labels',
    // stylers: [{ visibility: 'off' }],
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "#f9f5ed"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "color": "#aee0f4"
      }
    ]
  }
];


const PathMap = ({selectedCity}) => {
  const mapRef = useRef(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [map, setMap] = useState(null);

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.head.appendChild(script);
    };

    if (!window.google || !window.google.maps) {
      loadGoogleMapsScript();
    } else {
      setGoogleMapsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!googleMapsLoaded) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: cityData.get(selectedCity),
      zoom: 11,
      styles: mapStyles,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
    });

    // Add Google Maps Traffic Layer
    const trafficLayer = new window.google.maps.TrafficLayer();
    trafficLayer.setMap(mapInstance);

    const layer = new PathLayer({
      id: 'PathLayer',
      data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-lines.json',
      getColor: d => {
        const hex = d.color;
        return hex.match(/[0-9a-f]{2}/g).map(x => parseInt(x, 16));
      },
      getPath: d => d.path,
      getWidth: 100,
      pickable: true,
    });

    const overlay = new GoogleMapsOverlay({
      layers: [layer],
    });

    overlay.setMap(mapInstance);
    setMap(mapInstance);
  }, [googleMapsLoaded]);

  useEffect(() => {
    if (map && selectedCity) {
      const coordinates = cityData.get(selectedCity);
      map.panTo(coordinates);
    }
  }, [selectedCity, map]);


  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', zIndex: 1 }}>
      </div>
    </div>
  );
};

export default PathMap;