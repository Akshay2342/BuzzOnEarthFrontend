
// import React, { useEffect, useRef, useState } from 'react';
// import { HeatmapLayer } from '@deck.gl/aggregation-layers';
// import { GoogleMapsOverlay } from '@deck.gl/google-maps';

// const GOOGLE_MAPS_API_KEY = 'AIzaSyCdlbJ4sld_viDfM-Qij71UOxtCWKGJv0c';

// const HeatMapComponent = (population) => {
//   const mapRef = useRef(null);
//   const [heatmapType, setHeatmapType] = useState('populationDensity');
//   const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

//   const heatmapData = {
//     populationDensity: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',
//     traffic: 'https://example.com/traffic-data.json',
//     pollution: 'https://example.com/pollution-data.json',
//   };

//   useEffect(() => {
//     const checkGoogleMaps = () => {
//       if (window.google && window.google.maps && window.google.maps.Map) {
//         setGoogleMapsLoaded(true);
//       } else {
//         setTimeout(checkGoogleMaps, 100);
//       }
//     };
//     checkGoogleMaps();
//   }, []);


//   useEffect(() => {
//     if(!googleMapsLoaded) return;

//     const loadGoogleMapsScript = () => {
//       const script = document.createElement('script');
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
//       script.async = true;
//       script.defer = true;
//       script.onload = () => initializeMap();
//       document.head.appendChild(script);
//     };

//     const initializeMap = () => {
//       if (!window.google) {
//         console.error('Google Maps API script not loaded');
//         return;
//       }
//       if (!window.google.maps) {
//         console.error('Google Maps API script loaded');
//         return;
//       }
//       if (!window.google.maps.Map) {
//         console.error('Google Maps API script ');
//         return;
//       }
//       const map = new window.google.maps.Map(mapRef.current, {
//         center: { lat: 37.74, lng: -122.4 },
//         zoom: 11,
//       });

//       const overlay = new GoogleMapsOverlay({
//         layers: [
//           new HeatmapLayer({
//             id: 'HeatmapLayer',
//             // data: heatmapData[heatmapType],
//             aggregation: 'SUM',
//             getPosition: (d) => d.COORDINATES,
//             getWeight: (d) => d.SPACES,
//             radiusPixels: 25,
//           }),
//         ],
//       });

//       overlay.setMap(map);
//     };

//     if (!window.google || !window.google.maps ) {
//       loadGoogleMapsScript();
//     } else {
//       initializeMap();
//     }
//   }, [googleMapsLoaded]);

//   return (
//     // <>hii</>
//     <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
//       <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
//       <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', zIndex: 1 }}>
//         <label htmlFor="heatmapType">Select Heatmap Type: </label>
//     { /*    <select
//           id="heatmapType"
//           value={heatmapType}
//           onChange={(e) => setHeatmapType(e.target.value)}
//         >
//           <option value="populationDensity">Population Density</option>
//           <option value="traffic">Traffic</option>
//           <option value="pollution">Pollution</option>
//         </select>
//         */}
//       </div>
//     </div>
//   );
// };

// export default HeatMapComponent;



import React, { useEffect, useRef, useState } from 'react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';


const HeatMapComponent = ({populationMap}) => {
  const [populationArray, setPopulationArray] = useState([]);
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
  const data =[
      {"ADDRESS":"939 ELLIS ST","RACKS":2,"SPACES":4,"COORDINATES":[-122.42177834,37.78346622]},
      {"ADDRESS":"1380 HOWARD ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.414411,37.774458]},
      {"ADDRESS":"1195 OAK ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.438887,37.772737]},
      {"ADDRESS":"1387 VALENCIA ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.42019976,37.75087429]},
      {"ADDRESS":"180 TOWNSEND ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.392606,37.779369]},
      {"ADDRESS":"247 FILLMORE ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.43065953,37.77185018]},
      {"ADDRESS":"247 FILLMORE ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.43065953,37.77185018]},
      {"ADDRESS":"2690 MISSION ST","RACKS":2,"SPACES":4,"COORDINATES":[-122.418974,37.754029]},
      {"ADDRESS":"400 MCALLISTER ST","RACKS":7,"SPACES":14,"COORDINATES":[-122.419014,37.780519]},
      {"ADDRESS":"680 08TH ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.404719,37.770128]},
      {"ADDRESS":"101 TOWNSEND ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.390466,37.780226]},
      {"ADDRESS":"1186 FOLSOM ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.409866,37.77547]},
      {"ADDRESS":"1301 SANSOME ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.403298,37.802327]},
      {"ADDRESS":"1304 VALENCIA ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.420935,37.751851]},
      {"ADDRESS":"1380 VALENCIA ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.420834,37.750802]},
      {"ADDRESS":"1601 HOWARD ST","RACKS":2,"SPACES":4,"COORDINATES":[-122.416789,37.771394]},
      {"ADDRESS":"1700 FILBERT ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.427674,37.799281]},
      {"ADDRESS":"1700 OCEAN AVE","RACKS":1,"SPACES":2,"COORDINATES":[-122.460192,37.724988]},
      {"ADDRESS":"201 GUERRERO ST","RACKS":2,"SPACES":4,"COORDINATES":[-122.424167,37.767853]},
      {"ADDRESS":"2500 16TH ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.411968,37.76582]},
      {"ADDRESS":"2525 16TH ST","RACKS":1,"SPACES":2,"COORDINATES":[-122.411897,37.765121]},
  ];
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
      script.onload = () => setGoogleMapsLoaded(true); // Only set when the script is fully loaded
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
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.74, lng: -122.4 },
        zoom: 11,
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

      overlay.setMap(map);
    };

    initializeMap(); // Initialize the map and heatmap layer
  }, [googleMapsLoaded, heatmapType]); // Re-run if the type of heatmap changes

  

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', zIndex: 1 }}>
        <label htmlFor="heatmapType">Select Heatmap Type: </label>
        <select
          id="heatmapType"
          value={heatmapType}
          onChange={(e) => setHeatmapType(e.target.value)}
        >
          <option value="populationDensity">Population Density</option>
          <option value="traffic">Traffic</option>
          <option value="pollution">Pollution</option>
        </select>
      </div>
    </div>
  );
};

export default HeatMapComponent;
