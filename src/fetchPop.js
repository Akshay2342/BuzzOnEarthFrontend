import axios from 'axios';

const fetchPopulation = async (city) => {
  return await fetchData('population', city);
};

const fetchParking = async (city) => {
  return await fetchData('parking', city);
};

const fetchEdges = async (city) => {
  return await fetchData('edges', city);
};

const fetchEVStations = async (city) => {
  return await fetchData('EV_stations', city);
};

// Add other functions as needed...

const fetchData = async (entity, city) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/${entity}/${city}`);
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response ? error.response.data.detail : 'An error occurred',
    };
  }
};

export { fetchPopulation, fetchParking, fetchEdges, fetchEVStations };
