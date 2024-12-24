import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const DistanceMap = () => {
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [steps, setSteps] = useState([]);

  const users = {
    user1: [28.6210, 77.3828], // User 1 coordinates
   
    user4: [28.8210, 78.5828], // User 4 coordinates
  };

  const fetchRoute = async (start, end) => {
    const apiKey = "5b3ce3597851110001cf6248aa7f0e4deb8c48529c9966a2fb592e34"; // Replace with your OpenRouteService API key
    const url = `https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('API Response:', data);  // Log the response

      if (data.routes && data.routes[0]) {
        const route = data.routes[0].geometry.coordinates;
        const steps = data.routes[0].segments[0].steps;

        // Convert [lng, lat] to [lat, lng]
        const path = route.map((point) => [point[1], point[0]]);
        setRouteCoordinates(path);
        setSteps(steps);
      } else {
        console.error('No routes found');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  useEffect(() => {
    if (selectedStart && selectedEnd) {
      // Fetch route when both start and end are selected
      fetchRoute(selectedStart, selectedEnd);
    }
  }, [selectedStart, selectedEnd]);

  const handleRadioChange = (user, type) => {
    if (type === 'start') setSelectedStart(users[user]);
    if (type === 'end') setSelectedEnd(users[user]);
  };

  const pathOptions = { color: 'red', weight: 4 };

  return (
    <div>
      <h2>Select Points to Measure Distance</h2>

      <div>
        <p>Select Start Point:</p>
        {Object.keys(users).map((user) => (
          <label key={user}>
            <input
              type="radio"
              name="startPoint"
              onChange={() => handleRadioChange(user, 'start')}
            />
            {user}
          </label>
        ))}
      </div>

      <div>
        <p>Select End Point:</p>
        {Object.keys(users).map((user) => (
          <label key={user}>
            <input
              type="radio"
              name="endPoint"
              onChange={() => handleRadioChange(user, 'end')}
            />
            {user}
          </label>
        ))}
      </div>

      {/* Map to display route and steps */}
      <MapContainer center={selectedStart || users.user1} zoom={10} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Display markers for each user */}
        {Object.keys(users).map((user) => (
          <Marker key={user} position={users[user]}>
            <Popup>{user}</Popup>
          </Marker>
        ))}

        {/* Display the road path if a route is fetched */}
        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} pathOptions={pathOptions} />
        )}

        {/* Display instructions for each step */}
        {steps.map((step, index) => (
          <Marker key={index} position={[step.start_location[1], step.start_location[0]]}>
            <Popup>{step.instruction}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Display distance if both start and end are selected */}
      {selectedStart && selectedEnd && routeCoordinates.length > 0 && (
        <div>
          <h3>Route Instructions:</h3>
          <ul>
            {steps.map((step, index) => (
              <li key={index}>
                {step.instruction} ({step.distance} meters)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DistanceMap;
