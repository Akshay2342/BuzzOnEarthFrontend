import React, { useEffect,useState } from 'react';
import EvStation from './EvStation';  // Component for EV Station Map
import HeatmapComponent from './HeatMapComponent';  // Component for Heatmap
import { 
  fetchPopulation, 
  fetchParking, 
  fetchEdges, 
  fetchEVStations 
} from './fetchPop'; // Adjust the import as needed
import QuestionIcon from './question.png'; // Component for Question Icon

const locations = [
  { position: [0.45, 51.47] },
  { position: [0.46, 51.48] },
  { position: [0.47, 51.49] }
];

const App = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [pinnedItems, setPinnedItems] = useState([{name : 'Sample1',},{name : "sample2"}]);

  const [population, setPopulation] = useState(null);
  const [parking, setParking] = useState(null);
  const [edges, setEdges] = useState(null);
  const [evStations, setEvStations] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

const [selectedCity, setSelectedCity] = useState('');
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']; // Example list of cities

const handleCityChange = (event) => {
  setSelectedCity(event.target.value);
};
const handleFilterChange = (event) => {
  setFilterText(event.target.value);
};

const filteredCities = cities.filter(city =>
  city.toLowerCase().includes(filterText.toLowerCase())
);
  useEffect(() => {
    const testEndpoints = async () => {
      const city = 'Frankfurt'; // Adjust city as needed
      
      // Testing population endpoint
      const populationResult = await fetchPopulation(city);
      setPopulation(populationResult);
      console.log({populationResult})
      // Testing parking endpoint
      const parkingResult = await fetchParking(city);
      setParking(parkingResult);
      
      const edgesResult = await fetchEdges(city);
      setEdges(edgesResult);
      // console.log({edgesResult})
      
      // Testing EV stations endpoint
      const evStationsResult = await fetchEVStations(city);
      setEvStations(evStationsResult);

      // You can add more fetches as needed...
    };

    testEndpoints();
  }, []);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };
  const handleCityClick = (city) => {
    setSelectedCity(city);
    setFilterText(city);
    setIsInputFocused(false);
  };
  return (
    <div className="flex flex-col h-screen">
        <div className="absolute top-[75px] left-[580px]  transform -translate-x-1/2 m-0  p-0 rounded-md  z-50 w-[660px]">
        <input
          type="text"
          className="p-2 border rounded-md w-full"
          placeholder="Enter City Name"
          value={filterText}
          onChange={handleFilterChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      {isInputFocused && (
        <ul className="border rounded-md p-2 bg-white shadow-lg">
          {filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <li
                key={index}
                className="p-1 hover:bg-gray-200 cursor-pointer"
                onMouseDown={() => handleCityClick(city)}
              >
                {city}
              </li>
            ))
          ) : (
            <li className="p-1">No cities found</li>
          )}
        </ul>
      )}
        {/* <select
          className="p-2 border rounded-md"
          value={selectedCity}
          onChange={handleCityChange}
        >
          <option value="" disabled>Select a city</option>
          {filteredCities.map((city, index) => (
            <option key={index} value={city}>{city}</option>
          ))}
        </select> */}
      </div>
    <nav style={{ backgroundColor: '#191b61' }} className="text-white p-4">        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-bold">EV Station App</div>
          <div className="space-x-4">


            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </nav> 

      <div className="flex flex-1">

      <div style={{ backgroundColor: '#151640' }} className="text-white p-4 w-1/5">
          <h2 className="text-lg font-bold mb-4">Filters</h2>
          {/* <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Option 1
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Option 2
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Option 3
            </label>
            </div> */}
            <div className="mt-4">
    <label className="block mb-2">Map</label>
    <select className="w-full p-2 bg-blue-900 text-white rounded">
      <option value="map1">Map 1</option>
      <option value="map2">Map 2</option>
      <option value="map3">Map 3</option>
    </select>
  </div>

  <div className="mt-4">
    <label className="block mb-2">SCOPE</label>
    <div className="space-y-2">
      <label className="flex items-center space-x-10">
        <input type="checkbox" className="mr-2 custom-checkbox" />
        &gt; 80%
        <span className="ml-2 inline-block w-3 h-3 bg-green-500 rounded-full"></span>

      </label>
      <label className="flex items-center space-x-6">
        <input type="checkbox" className="mr-2" />
        60 - 80%
        <span className="ml-2 inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>

      </label>
      <label className="flex items-center space-x-6">
        <input type="checkbox" className="mr-2" />
        40 - 60%
        <span className="ml-2 inline-block w-3 h-3 bg-yellow-600 rounded-full"></span>

      </label>
      <label className="flex items-center space-x-2.5">
        <input type="checkbox" className="mr-2" />
        Below 40%
        <span className="ml-2 inline-block w-3 h-3 bg-orange-500 rounded-full"></span>
      </label>
    </div>
    </div>
    <div className="mt-4 flex items-center space-x-2">
      <div className="relative group">
        <img src={QuestionIcon} alt="Info" className="info-icon cursor-pointer w-5 h-5" />
        <div className="absolute top-full mb-2 hidden w-48 p-2 text-sm text-white bg-gray-800 rounded-md shadow-md group-hover:block">
          How scope is calculated: [Your explanation here]
        </div>
      </div>
      <span className="text-sm">How scope is calculated</span>
    </div>
    <h3
                  className="text-md font-medium mt-2 cursor-pointer"
                  onClick={toggleAccordion}
                >
                  Pinned Items
                </h3>
                {isAccordionOpen && (
                  <ul>
                    {pinnedItems.map((item, index) => (
                      <li key={index} className="p-1 border-b">{item.name}</li>
                    ))}
                  </ul>
                )}
  </div>

        {/* Right Section: Maps */}
        {/* <div className="w-full flex flex-col h-full"> */}
          {/* <div className="flex flex-1 h-full"> */}
            {/* Map for EV Stations */}
            {/* <div className="w-1/2 h-full"> */}
              {/* <EvStation locations={locations} evStations={evStations} /> */}
            {/* </div> */}

            {/* Separator */}
            {/* <div className="w-0.5 bg-gray-300"></div> */}

            {/* Map for Heatmap */}
            {/* <div className="w-1/2 h-full">
              <HeatmapComponent />
            </div> */}
          {/* </div> */}
        {/* </div> */}
        
        <div className="w-full flex flex-col h-full">
          <div className="flex flex-1 h-full">
            {/* Map for EV Stations */}
            <div className="w-full h-full">
              <EvStation locations={locations} setPinnedItems= {setPinnedItems} evStations={evStations} />
            </div>

            {/* Separator */}
            <div className="w-0.5 bg-gray-300"></div>
            <div className="w-2/5 h-full bg-gray-100 p-2">
              <div className="p-2">
                <div className="bg-gray-200 p-2 rounded-md mb-2">
                  <h3 className="text-md font-medium">Locality Scope</h3>
                  <p className="text-4xl font-bold">75%</p>
                </div>
                <div className="bg-gray-200 p-2 rounded-md mb-2">
          <h3 className="text-md font-medium">Specifics</h3>
          <div className="mt-2 flex justify-between">
            <p className="text-sm font-medium">Population:</p>
            <p className="text-lg font-bold">1,234,567</p>
          </div>
          <div className="mt-2 flex justify-between">
            <p className="text-sm font-medium">Traffic:</p>
            <p className="text-lg font-bold">Moderate</p>
          </div>
          <div className="mt-2 flex justify-between">
            <p className="text-sm font-medium">Places of Interest:</p>
            <p className="text-lg font-bold">15</p>
          </div>
          </div>


          <div className="bg-gray-200 p-2 rounded-md mb-2">
            <h3 className="text-md font-medium">Compare</h3>
            <div className="mt-2 flex items-center justify-between">
              <select className="p-2 border rounded-md">
                <option>Station 1</option>
                <option>Station 2</option>
              </select>
              <span className="mx-2">vs</span>
              <select className="p-2 border rounded-md">
                <option>Station 1</option>
                <option>Station 2</option>
              </select>
            </div>
          </div>
            
          <div className="bg-gray-200 p-2 rounded-md mb-2 overflow-y-auto" style={{ maxHeight: '200px' }}>
            <h3 className="text-md font-medium">Stations</h3>
            <table className="w-full mt-2">
              <thead>
              <tr className="bg-gray-300">
            <th className="text-left text-sm font-medium p-2" style={{ borderTopLeftRadius: '10px' }}>Name</th>
            <th className="text-left text-sm font-medium p-2">Scope</th>
            <th className="text-left text-sm font-medium p-2" style={{ borderTopRightRadius: '10px' }}>Color</th>
          </tr>
              </thead>
              <tbody>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              <tr>
                  <td className="text-sm">Station 1</td>
                  <td className="text-sm">93.5</td>
                  <td className="text-sm">
                    <span className="inline-block w-4 h-4 bg-green-700 rounded-full"></span>
                  </td>
                </tr>
              </tbody>
              </table>
            </div>
              </div>
            </div>
            </div>
        </div>


      </div>
    </div>
  );
};

export default App;
