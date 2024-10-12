
import React, { useEffect, useRef, useState } from 'react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';

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


const HeatMapComponent = ({populationMap , selectedCity,evStationPlacements}) => {
  console.log({selectedCity})
  console.log({populationMap})
  console.log({evStationPlacements})
  const [populationArray, setPopulationArray] = useState([]);
  const [showEvStations, setShowEvStations] = useState(false);
    useEffect(() => {
      const array = Array.from(populationMap.entries()).map(([key, value]) => {
        const [latitude, longitude] = key.split(',').map(Number);
        return {
          weight: value,
          coordinates: [longitude, latitude],
        };
      });
      setPopulationArray(array);
    }, [populationMap]);
  
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);
  const [heatmapType, setHeatmapType] = useState('populationDensity');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [map, setMap] = useState(null);


  console.log({populationArray})
  const heatmapData = {
    populationDensity: populationArray,
    traffic: 'https://example.com/traffic-data.json',
    pollution: 'https://example.com/pollution-data.json',
  };

  // Load Google Maps script
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
    // console.log({population})
  }, []);

  // Initialize Google Maps and Deck.gl Overlay
  useEffect(() => {
    if (!googleMapsLoaded) return; // Do nothing until Google Maps is loaded

    const initializeMap = () => {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 52.5200, lng: 13.4050 },
        zoom: 11,
        styles: mapStyles,
        disableDefaultUI: true,
      });

      const overlay = new GoogleMapsOverlay({
        layers: [
          new HeatmapLayer({
            id: 'HeatmapLayer',
            data: heatmapData['populationDensity'],
            aggregation: 'SUM',
            getPosition: (d) => d.coordinates,
            getWeight: (d) => d.weight,
            radiusPixels: 25,
          }),
        ],
      });

      overlay.setMap(mapInstance);
      setMap(mapInstance);
    };

    initializeMap(); // Initialize the map and heatmap layer
  }, [googleMapsLoaded, heatmapType,populationMap]); // Re-run if the type of heatmap changes


  useEffect(() => {
    if (map && selectedCity) {
      const coordinates = cityData.get(selectedCity);
      map.panTo(coordinates);
    }
  }, [selectedCity, map]);
  const handleCheckboxChange = () => {
    setShowEvStations(!showEvStations);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {/* <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', zIndex: 1 }}> */}
        {/* <label htmlFor="heatmapType">Select Heatmap Type: </label> */}
        {/* <select
          id="heatmapType"
          value={heatmapType}
          onChange={(e) => setHeatmapType(e.target.value)}
        >
          <option value="populationDensity">Population Density</option>
          <option value="traffic">Traffic</option>
          <option value="pollution">Pollution</option>
        </select> */}
      {/* </div> */}
    </div>
  );
};

export default HeatMapComponent;
