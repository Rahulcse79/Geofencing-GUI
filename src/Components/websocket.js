import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";

const Device1 = () => {
  const [ws, setWs] = useState(null);
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [isConnected, setIsConnected] = useState(false);
  const [websocketOnAndOff, setWebsocketOnAndOff] = useState(false);
  const CookieName = "mobile_tracker";
  const Token = Cookies.get(CookieName);
  const TokenData = JSON.parse(Token);
  const ServerIp = "localhost";
  const ServerPort = "9901";

  const connectWebSocket = () => {
    const socket = new WebSocket(`ws://${ServerIp}:${ServerPort}`, TokenData.AuthToken);
    socket.onopen = () => {
      console.log('WebSocket connection established');
      setWs(socket);
      setIsConnected(true);
    };
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setWs(null);
      setIsConnected(false);
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    return socket;
  };

  useEffect(() => {
    let reconnectInterval;

    if (websocketOnAndOff) {
      if (!ws) {
        connectWebSocket();
      }
      reconnectInterval = setInterval(() => {
        if (!isConnected) {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }
      }, 15 * 60 * 1000);
    }

    return () => {
      if (ws) {
        ws.close();
      }
      clearInterval(reconnectInterval);
    };
  }, [ws, isConnected, websocketOnAndOff]);

  const sendCoordinates = () => {
    if (ws && ws.readyState === WebSocket.OPEN && coordinates.latitude !== null && coordinates.longitude !== null) {
      const message = {
        LiveLocation: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
      };
      ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected or coordinates not set');
    }
  };

  const getCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
        },
        (error) => {
          console.error('Error obtaining coordinates:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (websocketOnAndOff) {
        getCoordinates();
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }, [websocketOnAndOff]);

  useEffect(() => {
    if (websocketOnAndOff && coordinates.latitude !== null && coordinates.longitude !== null) {
      sendCoordinates();
    }
  }, [coordinates, websocketOnAndOff]);

  return (
    <div>
      <h1>Device 1 - Send Coordinates</h1>
      {coordinates.latitude !== null && coordinates.longitude !== null && (
        <p>
          Current Coordinates: Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
        </p>
      )}
      <button onClick={() => {
        setWebsocketOnAndOff(prev => !prev);
        if (websocketOnAndOff && ws) {
          ws.close();
        }
      }}>
        {websocketOnAndOff ? 'Turn WebSocket Off' : 'Turn WebSocket On'}
      </button>
    </div>
  );
};

export default Device1;
