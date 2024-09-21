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

// const createCustomIcon = (color) => {
//   const svgMarker = {
//     path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z',
//     fillColor: color,
//     fillOpacity: 1,
//     scale: 1,
//     strokeColor: 'white',
//     strokeWeight: 1,
//   };
//   // console.log(object)
//   return svgMarker;
// };


const createCustomIcon = (color) => {
  const svgMarker = {
    path: 'M 0, 0 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0', // Circle path
    fillColor: color,
    fillOpacity: 1,
    scale: 0.4,
    strokeColor: 'white',
    strokeWeight: 1,
  };
  return svgMarker;
};

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


// const createEvStationPlacements = (data) => {
//   if (!data || !data.geometry) {
//     console.error("Invalid data or missing geometry property");
//     return [];
//   }

//   const coordinatesString = data.geometry.slice(10, -2);
//   if (!coordinatesString) {
//     console.error("Invalid geometry format");
//     return [];
//   }

//   const coordsArray = coordinatesString.split(", ");
//   if (!coordsArray.length) {
//     console.error("No coordinates found in geometry");
//     return [];
//   }

//   const evStations = data.EV_stations;
//   const placements = [];

//   // Convert coordinates to number
//   const coords = coordsArray.map(coord => coord.split(" ").map(Number));

//   // Calculate the center of the polygon
//   const centerLat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
//   const centerLng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;

//   // Generate EV station placements
//   if (evStations === 1) {
//     placements.push({ lat: centerLat, lng: centerLng });
//   } else {
//     // Distribute EV stations evenly within the polygon
//     for (let i = 0; i < evStations; i++) {
//       const lat = coords[i % coords.length][1];
//       const lng = coords[i % coords.length][0];
//       placements.push({ lat, lng  });
//     }
//   }
//   // console.log({placements})
//   return placements;
// };
const getScopeColor = (scope) => {
  if (scope > 80) {
    return 'green';
  } else if (scope > 60) {
    return 'yellow';
  } else if (scope > 40) {
    return 'orange';
  } else {
    return 'red';
  }
};

export default function EvStation({ hoveredStation,setHoveredStation ,defaultCenter,  setHoveredProbability, evStationPlacements,  selectedScopes, setCurrentDensity,evStations, pinnedItems , setPinnedItems,populationMap}) {
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const mapRef = useRef(null);
  // const [hoveredStation, setHoveredStation] = useState(null);
  
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [customIcon, setCustomIcon] = useState(null);
  
  evStations = evStations?.data;
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [markerIcon, setMarkerIcon] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // const defaultCenter = { lat: 51.47, lng: 0.45 };
  const Mark = {
    url: Markk, // Path to your custom marker image
    scaledSize: { width: 56, height: 56 } // Adjust the size as needed
  };
  const handleAddToPinnedItems = () => {
    setPinnedItems([...pinnedItems, hoveredStation]);
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 3000); // Hide snackbar after 3 seconds
  };
  // const evStationPlacements = evStations?.flatMap(createEvStationPlacements).map((placement, index) => ({
  //   ...placement,
  //   ind:index
  // }));
  // setEvStationPlacements(evplace)
  // const customIcon = {
    //   path: window.google.maps.SymbolPath.CIRCLE,
    //   fillColor: 'red',
    //   fillOpacity: 1,
    //   scale: 5,
    //   strokeColor: 'white',
    //   strokeWeight: 1,
    // };
    console.log({evStationPlacements})
    useEffect(()=>{
      console.log({hoveredStation})
    },[hoveredStation]);
    useEffect(() => {
      if (window.google && mapRef.current) {
        const icon = {
          path: window.google.maps.SymbolPath.CIRCLE,
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
    setHoveredProbability(station.prob); // Set hovered probability
    setHoveredStation(station);
    console.log({hoveredStation})
    };
    
    const handleMouseOut = () => {
    const timeout = setTimeout(() => {
      setHoveredMarker(null);
    }, 1200); // Adjust the delay as needed
    setHoverTimeout(timeout);
    // setHoveredProbability(0); // Reset hovered probability

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
  useEffect(() => {
    if( mapRef.current && defaultCenter){
      mapRef.current.panTo(defaultCenter)
    }
    console.log({defaultCenter})
  }, [defaultCenter]);
  
  const getPopulationDensity = (lat, lng) => {
    const key = `${lat},${lng}`;
    const x = populationMap?.get(key) 
    if(x) setCurrentDensity(x)
    return x.toFixed(2) || 'No data';
  };

  const isWithinScope = (probability) => {
    // Check if the station's probability falls within any selected scope
    return selectedScopes.some(
      (scope) => probability >= scope.mini && probability <= scope.maxi
    );
  };

  return (
    <APIProvider apiKey="AIzaSyBue3U52K8UDNxJxPJfCv0LiIc60-lo8p4">
        <Map
        defaultCenter={defaultCenter}
        defaultZoom={8}
        customIcon={customIcon}
        options={{ 
          styles: mapStyles,
          tilt: 85, // Tilt the map 45 degrees
          heading: 90, // Rotate the map 90 degrees
          mapTypeId: 'hybrid' // Set the map type to hybrid to enable 3D view
        }}
        onLoad={(map) => (mapRef.current = map)}
        >
        {googleMapsLoaded && evStationPlacements?.filter((station) => {
              const probability = parseFloat(station.prob?.probability) || 0;
              return isWithinScope(probability); // Filter stations based on selected scopes
            }).map((station, index) => {
          const probability = parseFloat(station.prob?.probability) || 0; // Default to 0 if probability is missing
          // const color = probability > 0.5 ? 'green' : 'red'; // Change color based on probability
          const customIcon = createCustomIcon(getScopeColor(probability*100));
          console.log({probability})
          return (
            <Marker
              key={index}
              position={{ lat: station.lat, lng: station.lng }}
              {...(customIcon && { icon: customIcon })} // Conditionally add the icon property
              onMouseOver={() => handleMouseOver({ lat: station.lat, lng: station.lng }, station)}
              onMouseOut={handleMouseOut}
              onClick={() => handleMarkerClick({ lat: station.lat, lng: station.lng })}
            />
          );
        })}

{hoveredMarker && (
  <InfoWindow
    position={hoveredMarker}
    options={{ disableAutoPan: true, closeBoxURL: '' }}
  >
    <div className="p-2">
      <div className="mb-1 font-bold text-sm">EV Station Details</div>
      <div className="mb-1 text-xs">
        <span className="font-semibold">ID:</span> {hoveredStation?.ind}
      </div>
      <div className="mb-1 text-xs">
        <span className="font-semibold">Population Density:</span> {getPopulationDensity(hoveredStation?.lat, hoveredStation?.lng)}
      </div>
      <div className="mb-1 text-xs">
        <span className="font-semibold">Probability:</span> {hoveredStation?.prob?.probability ? (hoveredStation.prob.probability * 100).toFixed(2) + '%' : 'N/A'}
      </div>
      <button
        onClick={handleAddToPinnedItems}
        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
      >
        Add
      </button>
    </div>
  </InfoWindow>
)}

{snackbarVisible && (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
    Successfully added to pinned items!
  </div>
)}
      </Map>
    </APIProvider>
  );
}


