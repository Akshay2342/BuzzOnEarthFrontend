import axios from 'axios';

const fetchEVStations = async (entity, city) => {
  try {
    const response = await axios.get(`http://localhost:8000/${entity}/${city}`);
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response ? error.response.data.detail : 'An error occurred',
    };
  }
};

export default fetchEVStations;
