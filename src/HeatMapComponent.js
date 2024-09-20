
import React, { useEffect, useRef, useState } from 'react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCdlbJ4sld_viDfM-Qij71UOxtCWKGJv0c';

const HeatMapComponent = () => {
  const mapRef = useRef(null);
  const [heatmapType, setHeatmapType] = useState('populationDensity');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  const heatmapData = {
    populationDensity: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',
    traffic: 'https://example.com/traffic-data.json',
    pollution: 'https://example.com/pollution-data.json',
  };

  // useEffect(() => {
  //   const loadGoogleMapsScript = () => {
  //     const script = document.createElement('script');
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
  //     script.async = true;
  //     script.defer = true;
  //     script.onload = () => initializeMap();
  //     document.head.appendChild(script);
  //   };

  //   const initializeMap = () => {
  //     if (!window.google) {
  //       console.error('Google Maps API script not loaded');
  //       return;
  //     }
  //     if (!window.google.maps) {
  //       console.error('Google Maps API script not ');
  //       return;
  //     }
  //     if (!window.google.maps.Map) {
  //       console.error('Google Maps API script not ');
  //       return;
  //     }
  //     const map = new window.google.maps.Map(mapRef.current, {
  //       center: { lat: 37.74, lng: -122.4 },
  //       zoom: 11,
  //     });

  //     const overlay = new GoogleMapsOverlay({
  //       layers: [
  //         new HeatmapLayer({
  //           id: 'HeatmapLayer',
  //           data: heatmapData[heatmapType],
  //           aggregation: 'SUM',
  //           getPosition: (d) => d.COORDINATES,
  //           getWeight: (d) => d.SPACES,
  //           radiusPixels: 25,
  //         }),
  //       ],
  //     });

  //     overlay.setMap(map);
  //   };

  //   loadGoogleMapsScript();
  //   if (!window.google || !window.google.maps) {
  //     loadGoogleMapsScript();
  //   } else {
  //     initializeMap();
  //   }
  // }, []);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.Map) {
        setGoogleMapsLoaded(true);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, []);


  useEffect(() => {
    if(!googleMapsLoaded) return;

    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!window.google) {
        console.error('Google Maps API script not loaded');
        return;
      }
      if (!window.google.maps) {
        console.error('Google Maps API script loaded');
        return;
      }
      if (!window.google.maps.Map) {
        console.error('Google Maps API script ');
        return;
      }
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.74, lng: -122.4 },
        zoom: 11,
      });

      const overlay = new GoogleMapsOverlay({
        layers: [
          new HeatmapLayer({
            id: 'HeatmapLayer',
            data: heatmapData[heatmapType],
            aggregation: 'SUM',
            getPosition: (d) => d.COORDINATES,
            getWeight: (d) => d.SPACES,
            radiusPixels: 25,
          }),
        ],
      });

      overlay.setMap(map);
    };

    if (!window.google || !window.google.maps ) {
      loadGoogleMapsScript();
    } else {
      initializeMap();
    }
  }, [googleMapsLoaded]);

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