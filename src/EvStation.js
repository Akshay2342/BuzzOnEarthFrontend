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

export default function EvStation({ hoveredStation,setHoveredStation ,defaultCenter,  setHoveredProbability, evStationPlacements,  selectedScopes, setCurrentDensity,evStations, pinnedItems , setPinnedItems,populationMap, selectedCity}) {
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const mapRef = useRef(null);
  // const [hoveredStation, setHoveredStation] = useState(null);
  const [map, setMap] = useState(null);
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
    }, 2000); // Adjust the delay as needed
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
      console.log(`Panning to coordinates:`, coord);
      mapRef.current.panTo(coord);
  };
  useEffect(() => {
      console.log(`Panning to default center:`, defaultCenter);
      mapRef?.current?.panTo(selectedCity);
  }, [defaultCenter,selectedCity]);
  
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
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <Map
        defaultCenter={defaultCenter}
        defaultZoom={10}
        customIcon={customIcon}
        disableDefaultUI
        options={{ 
          styles: mapStyles,
          tilt: 85, // Tilt the map 45 degrees
          heading: 90, // Rotate the map 90 degrees
          mapTypeId: 'hybrid' // Set the map type to hybrid to enable 3D view
        }}
        onLoad={(map) => {
          mapRef.current = map;
        }}        >
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


