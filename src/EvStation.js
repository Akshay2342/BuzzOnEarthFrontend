import React, { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import Markk from './gps.png'

const mapStyles = [
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
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


const coordinates = [
    { lat: 51.47, lng: 0.45 },
  { lat: 51.48, lng: 0.46 },
  { lat: 51.49, lng: 0.47 },
  // Add more coordinates as needed
];

// const createEvStationPlacements = (data) => {
//   const coordinatesString = data?.geometry?.slice(10, -2);
//   const coordsArray = coordinatesString.split(", ");

//   const evStations = data.EV_stations;
//   const placements = [];

//   // Convert coordinates to number
//   const coords = coordsArray.map(coord => coord.split(" ").map(Number));

//   // Calculate the center of the polygon
//   const centerLat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
//   const centerLng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;

//   // Generate EV station placements
//   if (evStations === 1) {
//       placements.push({ lat: centerLat, lng: centerLng });
//   } else {
//       const spacing = 0.0001; // Adjust spacing to prevent overlap
//       let count = 0;

//       for (let i = 0; i < evStations; i++) {
//           const latOffset = (i % Math.ceil(Math.sqrt(evStations))) * spacing;
//           const lngOffset = Math.floor(i / Math.ceil(Math.sqrt(evStations))) * spacing;

//           placements.push({
//               lat: centerLat + latOffset,
//               lng: centerLng + lngOffset
//           });
//       }
//   }

//   return placements;
// };


const createEvStationPlacements = (data) => {
  if (!data || !data.geometry) {
    console.error("Invalid data or missing geometry property");
    return [];
  }

  const coordinatesString = data.geometry.slice(10, -2);
  if (!coordinatesString) {
    console.error("Invalid geometry format");
    return [];
  }

  const coordsArray = coordinatesString.split(", ");
  if (!coordsArray.length) {
    console.error("No coordinates found in geometry");
    return [];
  }

  const evStations = data.EV_stations;
  const placements = [];

  // Convert coordinates to number
  const coords = coordsArray.map(coord => coord.split(" ").map(Number));

  // Calculate the center of the polygon
  const centerLat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
  const centerLng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;

  // Generate EV station placements
  if (evStations === 1) {
    placements.push({ lat: centerLat, lng: centerLng });
  } else {
    // Distribute EV stations evenly within the polygon
    for (let i = 0; i < evStations; i++) {
      const lat = coords[i % coords.length][1];
      const lng = coords[i % coords.length][0];
      placements.push({ lat, lng  });
    }
  }
  // console.log({placements})
  return placements;
};

export default function EvStation(evStations,setPinnedItems) {
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const mapRef = useRef(null);
  const [hoveredStation, setHoveredStation] = useState(null);

  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [customIcon, setCustomIcon] = useState(null);

  evStations = evStations?.evStations?.data;
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [markerIcon, setMarkerIcon] = useState(null);
  const defaultCenter = { lat: 51.47, lng: 0.45 };
  const Mark = {
    url: Markk, // Path to your custom marker image
    scaledSize: { width: 56, height: 56 } // Adjust the size as needed
  };
  const evStationPlacements = evStations?.flatMap(createEvStationPlacements).map((placement, index) => ({
    ...placement,
    ind:index
  }));  // const customIcon = {
  //   path: window.google.maps.SymbolPath.CIRCLE,
  //   fillColor: 'red',
  //   fillOpacity: 1,
  //   scale: 5,
  //   strokeColor: 'white',
  //   strokeWeight: 1,
  // };
  console.log({evStationPlacements, evStations})
  useEffect(() => {
    if (window.google && mapRef.current) {
      const icon = {
        path: window.google.maps?.SymbolPath.CIRCLE,
        fillColor: 'green',
        fillOpacity: 1,
        scale: 5,
        strokeColor: 'white',
        strokeWeight: 1,
      };
      setCustomIcon(icon);
    }
  }, [googleMapsLoaded]);

  const handleMouseOver = (coord, station) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredMarker(coord);
    setHoveredStation(station);
    // console.log({hoveredStation})
    };
    
    const handleMouseOut = () => {
    const timeout = setTimeout(() => {
      setHoveredMarker(null);
    }, 1200); // Adjust the delay as needed
    setHoverTimeout(timeout);
    
    };

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setGoogleMapsLoaded(true);
        const icon = {
          path: window.google.maps?.SymbolPath?.CIRCLE,
          fillColor: 'green',
          fillOpacity: 1,
          scale: 5,
          strokeColor: 'white',
          strokeWeight: 1,
        };
        setCustomIcon(icon);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, [googleMapsLoaded]);
  const handleMarkerClick = (coord) => {
    if (mapRef.current) {
      mapRef.current.panTo(coord);
    }
  };

  return (
    <APIProvider apiKey="AIzaSyBue3U52K8UDNxJxPJfCv0LiIc60-lo8p4">
        <Map
        defaultCenter={defaultCenter}
        defaultZoom={11}
        options={{ 
          styles: mapStyles,
          tilt: 85, // Tilt the map 45 degrees
          heading: 90, // Rotate the map 90 degrees
          mapTypeId: 'hybrid' // Set the map type to hybrid to enable 3D view
        }}
        onLoad={(map) => (mapRef.current = map)}
        >

        {googleMapsLoaded && (
          <Marker
            position={defaultCenter}
            icon={Mark}
          />
        )}
         {googleMapsLoaded && evStationPlacements?.map((station, index) => (
          <Marker
            key={index}
            position={{lat : station.lat,lng : station.lng}}
            icon={customIcon}
            onMouseOver={() => handleMouseOver({lat : station.lat,lng : station.lng}, station)}
            onMouseOut={handleMouseOut}
            onClick={() => handleMarkerClick({lat : station.lat,lng : station.lng})}
          />
        ))}

{hoveredMarker && (
          <InfoWindow position={hoveredMarker}>
            <div>EV Station Info {hoveredStation?.ind}</div>
            <div onClick={()=> setPinnedItems()}>add</div>
          </InfoWindow>
        )}

      </Map>
    </APIProvider>
  );
}


