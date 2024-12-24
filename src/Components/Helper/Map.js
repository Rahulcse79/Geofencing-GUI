import React, { createContext, useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Cookies from "js-cookie";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { FormControlLabel, Switch } from '@mui/material';
import { AiOutlineClear } from "react-icons/ai";
import { IoSaveSharp } from "react-icons/io5";
import { ImHistory } from "react-icons/im";
import { RiMenuAddFill } from "react-icons/ri";
import LiveImg from "../Images/live.png";
import StartImg from "../Images/flag.png";
import EndImg from "../Images/navigation.png";
import { IoIosRemoveCircle } from 'react-icons/io';
import { MdOutlineRemoveFromQueue } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [isAlert, setIsAlert] = useState(false);

  return (
    <DataContext.Provider value={{ isAlert, setIsAlert }}>
      {children}
    </DataContext.Provider>
  );
};

const Map = () => {

  const [isAlert, setIsAlert] = useState(false);
  const [username, setUserName] = useState("");
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [locationHistory, setLocationHistory] = useState(false);
  const [memberlocationHistory, setMemberLocationHistory] = useState(false);
  const [livelocation, setLivelocation] = useState({ latitude: 0, longitude: 0 });
  const [fetchLiveLocations, setfetchLiveLocations] = useState(false);
  const [LocationHistoryArray, setLocationHistoryArray] = useState([]);
  const [memberLocationHistoryArray, setMemberLocationHistoryArray] = useState([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [CurrpolygonCoordinates, setCurrPolygonCoordinates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState("");
  const [fetchLocations, setfetchLocations] = useState(false);
  const [members, setMembers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();
  const CookieName = "mobile_tracker";
  const Token = Cookies.get(CookieName);
  const ServerIp = "localhost";
  const ServerPort = "9901";

  const customIcon = new L.Icon({
    iconUrl: LiveImg,
    iconSize: [35, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const historyLocationIconStart = new L.Icon({
    iconUrl: StartImg,
    iconSize: [35, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const historyLocationIconMiddle = new L.DivIcon({
    html: '<div style="width: 8px; height: 8px; background-color: red; border-radius: 50%;"></div>',
    className: 'custom-red-circle-icon',
    iconSize: [8, 8],
  });

  const historyLocationIconEnd = new L.Icon({
    iconUrl: EndImg,
    iconSize: [25, 31],
    iconAnchor: [12, 21],
    popupAnchor: [1, -34],
  });

  function formatTimeToIST(time) {
    return new Date(time).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  const centerPosition = [28.6210, 77.3828];

  // const checkDeviceOutsidePolygon = () => {
  //   const polygonLayer = L.polygon(polygonCoordinates);
  //   locations.forEach((location) => {
  //     const devicePosition = L.latLng(location.Latitude, location.Longitude);
  //     if (!polygonLayer.getBounds().contains(devicePosition)) {
  //       console.log("DeviceId outside polygon:", location.DeviceId);
  //     }
  //   });
  // };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserSelect = async (user) => {
    await setSelectedUser(user);
    setIsDropdownOpen(false);
    HandleLocationHistory(user);
  };

  const HandleLocationHistory = async (user) => {
    try {
      if (!Token) {
        navigate("/");
        return;
      } else if (user === null) {
        alert("First select member to fetch member location history.");
        return;
      } 
      const TokenData = JSON.parse(Token);
      let response = await fetch(
        `http://${ServerIp}:${ServerPort}/api/member/location-history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TokenData.AuthToken}`,
            "Content-Type": "application/json",
            MemberUserName: user,
          },
        }
      );
      const data = await response.json();
      if (data.status === 1) {
        setMemberLocationHistoryArray(data.LocationHistory);
      } else {
        alert("Failed to receive member location history.");
      }
    } catch (error) {
      console.log("An error occurred while receiving member location history. Please try again later.");
    }
  };

  const getCoordinates = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLivelocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error obtaining coordinates.');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const DeviceAlert = async (event) => {
    try {
      if (!Token) {
        navigate("/");
        return;
      }
      if (!isAlert && CurrpolygonCoordinates.length === 0) {
        alert("First you set your geofencing area then start alert.");
        return;
      }
      const TokenData = JSON.parse(Token);
      const newAlertState = !isAlert;
      const response = await fetch(
        `http://${ServerIp}:${ServerPort}/api/setAlert`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TokenData.AuthToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            alert: newAlertState
          }),
        }
      );
      const data = await response.json();
      if (data.status === 1) {
        setIsAlert(newAlertState);
      } else {
        alert(data.message || "Failed to set alert.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while setting the alert.");
    }
  };

  const GetMemberData = async () => {
    try {
      if (!Token) {
        navigate("/");
        return;
      }
      if (members.length === 0) {
        alert("Member list should not be empty.");
        setfetchLocations(false);
      }
      const TokenData = JSON.parse(Token);
      const response = await fetch(`http://${ServerIp}:${ServerPort}/api/livelocation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TokenData.AuthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOfLiveLocation: members
        }),
      });
      const data = await response.json();
      if (data.status === 1 && data.data) {
        const processedLocations = await Object.entries(data.data).map(([username, coords]) => ({
          username,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }));
        await setLocations(processedLocations);
      }
    } catch (error) {
      console.error("An error occurred while receiving live location.");
    }
  };

  useEffect(() => {

    if (fetchLocations) {
      GetMemberData();
      const intervalId = setInterval(async () => {
        await GetMemberData();
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [Token, navigate, fetchLocations]);

  useEffect(() => {

    const GetUserData = async () => {
      try {
        if (!Token) {
          navigate("/");
          return;
        }
        const TokenData = JSON.parse(Token);
        let response = await fetch(
          `http://${ServerIp}:${ServerPort}/api/getUserData`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${TokenData.AuthToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.status === 1) {
          setCurrPolygonCoordinates(data.polygonCoordinates);
          setIsAlert(data.alert);
          setUserName(TokenData.username);
          setLocationHistoryArray(data.LocationHistory)
          setMembers(data.members)
        } else {
          alert("Failed to receive geofencing coordinates.");
          navigate("/");
        }
      } catch (error) {
        navigate("/");
        console.log("An error occurred while receiving geofencing coordinates. Please try again later.");
      }
    };

    GetUserData();

    const intervalId = setInterval(() => {
      if (fetchLiveLocations) {
        getCoordinates();
      }
    }, 10000);
    return () => clearInterval(intervalId);

  }, [Token, livelocation, fetchLiveLocations, setCurrPolygonCoordinates, setIsAlert, navigate, setLocationHistoryArray]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isDrawingMode) {
          const { lat, lng } = e.latlng;
          setPolygonCoordinates((prevCoords) => [...prevCoords, [lat, lng]]);
        }
      },
    });
    return null;
  };

  const SavePolygon = async () => {
    try {
      if (!Token) navigate("/");
      const TokenData = JSON.parse(Token);
      let response = await fetch(
        `http://${ServerIp}:${ServerPort}/api/setgeofencing`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TokenData.AuthToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            polygonCoordinates: polygonCoordinates
          }),
        }
      );
      const data = await response.json();
      if (data.status === 1) {
        alert("Geofencing coordinates saved successfully.");
        HandleClear();
        setIsDrawingMode(false);
        setCurrPolygonCoordinates(polygonCoordinates);
      } else {
        alert("Failed to save geofencing coordinates.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while saving geofencing coordinates.");
    }
  };

  const HandleClear = () => {
    setPolygonCoordinates([]);
  }

  const handleRemoveMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleInputChange = (e) => {
    setNewMember(e.target.value);
  };

  const HandleAddMember = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMember === username) {
      alert("Do not add self username");
      return;
    }
    if (newMember.trim() === '') return;
    setMembers((prevMembers) => [...prevMembers, newMember]);
    setNewMember('');
  };

  const HandleSubmitApiCall = async () => {
    try {
      if (!Token) {
        navigate("/");
        return;
      }
      const TokenData = JSON.parse(Token);
      const response = await fetch(
        `http://${ServerIp}:${ServerPort}/api/setMember`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TokenData.AuthToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            members: members
          }),
        }
      );
      const data = await response.json();
      if (data.status === 1) {
        setMembers(members);
        alert("Members list updated successfully.");
        window.location.reload();
      } else {
        alert(data.message || "Failed to set members.");
      }
    } catch (error) {
      alert("An error occurred while setting the members.");
    }
  };

  const HandleClearGeofencing = () => {
    if (CurrpolygonCoordinates.length === 0) {
      alert("Geofencing coordinates already clear.");
      return;
    }
    setCurrPolygonCoordinates([]);
    SavePolygon();
  }

  return (
    <div className="map-card">
      <h1>Locate location Here</h1>
      <div className="container">
        <FormControlLabel
          control={<Switch checked={isAlert} onChange={DeviceAlert} />}
          label={<span className="form-control-label">{isAlert ? "Stop alert" : "Start alert"}</span>}
        />
        <FormControlLabel
          control={<Switch checked={isDrawingMode} onChange={() => setIsDrawingMode(!isDrawingMode)} />}
          label={<span className="form-control-label">{isDrawingMode ? "Stop Polygon Action" : "Start Polygon Action"}</span>}
        />
        <FormControlLabel
          control={<Switch checked={locationHistory} onChange={() => setLocationHistory(!locationHistory)} />}
          label={<span className="form-control-label">My Location history</span>}
        />
        <FormControlLabel
          control={
            <Switch
              checked={memberlocationHistory}
              onChange={() => {
                if (selectedUser == null) {
                  alert("First select a member to fetch location history.");
                  return;
                }
                setMemberLocationHistory(!memberlocationHistory);
              }}
            />
          }
          label={<span className="form-control-label">Location history</span>}
        />
        <FormControlLabel
          control={<Switch checked={fetchLiveLocations} onChange={() => setfetchLiveLocations(!fetchLiveLocations)} />}
          label={<span className="form-control-label">My Live location</span>}
        />
        <FormControlLabel
          control={<Switch checked={fetchLocations} onChange={() => setfetchLocations(!fetchLocations)} />}
          label={<span className="form-control-label">Member Live location</span>}
        />
      </div>

      <div className="icon-container">
        <div className="tooltip-container">
          <ImHistory className="icon-button icon" onClick={() => HandleLocationHistory(selectedUser)} />
          <span className="tooltip">Refresh History</span>
        </div>
        <div className="tooltip-container">
          <IoSaveSharp className="icon-button icon" onClick={SavePolygon} />
          <span className="tooltip">Save</span>
        </div>
        <div className="tooltip-container">
          <AiOutlineClear className="icon-button icon" onClick={HandleClear} />
          <span className="tooltip">Clear</span>
        </div>
        <div className="tooltip-container">
          <MdOutlineRemoveFromQueue className="icon-button icon" onClick={HandleClearGeofencing} />
          <span className="tooltip">Clear geofencing</span>
        </div>
        <div className="tooltip-container">
          <RiMenuAddFill className="icon-button icon" onClick={HandleAddMember} />
          <span className="tooltip">Add member</span>
        </div>
        <div className="tooltip-container">
          <FaClipboardList className="icon-button icon" onClick={toggleDropdown} />
          <span className="tooltip">Member list</span>
        </div>
        <div>
          {isDropdownOpen && (
            <div className="overlay">
              <div className="modal">
                <button
                  className="close-btn"
                  onClick={() => setIsDropdownOpen(false)}
                  title="Close"
                >
                  X
                </button>
                <div className="member-list">
                  <h2>Select member to see location history</h2>
                  <ul>
                    {members.length > 0 ? (
                      members.map((user, index) => (
                        <li
                          key={index}
                          className={`dropdown-item ${selectedUser === user ? 'selected' : ''}`}
                          onClick={() => handleUserSelect(user)}
                        >
                          {user}
                        </li>
                      ))
                    ) : (
                      <li className="dropdown-item">Loading...</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          {showForm && (
            <div className="overlay">
              <div className="modal">
                <button className="close-btn" onClick={() => setShowForm(false)} title="Close">
                  X
                </button>
                <div className="member-list">
                  <h2>Member List</h2>
                  <ul>
                    {members.map((member, index) => (
                      <li key={index}>
                        {member}
                        <span className="icon-remove" onClick={() => handleRemoveMember(index)} style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}>
                          <IoIosRemoveCircle />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="form-container">
                  <h2>Add Member</h2>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="memberName">Member username: </label>
                    <input
                      type="text"
                      id="memberName"
                      name="memberName"
                      value={newMember}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="ButtonMenu">
                      <button type="submit">+</button>
                      <button type="button" onClick={HandleSubmitApiCall}>Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {(!showForm && !isDropdownOpen) && (<MapContainer
        center={centerPosition}
        zoom={14}
        style={{ width: "100%", height: "600px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {fetchLocations && Array.isArray(locations) && locations.map((location, idx) => (
          location.latitude !== undefined && location.longitude !== undefined && (
            <Marker
              key={idx}
              position={[location.latitude, location.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div>
                  <p>DeviceId: {location.username}</p>
                  <p>Latitude: {location.latitude}</p>
                  <p>Longitude: {location.longitude}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {fetchLiveLocations && livelocation.latitude && livelocation.longitude && (
          <Marker position={[livelocation.latitude, livelocation.longitude]} icon={customIcon}>
            <Popup>
              <div>
                <p>DeviceId: {username}</p>
                <p>Latitude: {livelocation.latitude}</p>
                <p>Longitude: {livelocation.longitude}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {CurrpolygonCoordinates.length > 0 && (
          <Polygon positions={CurrpolygonCoordinates} pathOptions={{ color: "green" }} />
        )}

        {polygonCoordinates.length > 0 && (
          <Polygon positions={polygonCoordinates} pathOptions={{ color: "red" }} />
        )}

        {polygonCoordinates.length > 0 && (
          <Polygon positions={polygonCoordinates} pathOptions={{ color: "red" }} />
        )}

        {locationHistory && LocationHistoryArray.length > 0 && (
          <>
            {LocationHistoryArray
              .sort((a, b) => new Date(a.time) - new Date(b.time))
              .map((location, index) => (
                <Marker
                  key={location._id}
                  position={[location.coordinates[0], location.coordinates[1]]}
                  icon={index === 0 ? historyLocationIconStart : index === LocationHistoryArray.length - 1 ? historyLocationIconEnd : historyLocationIconMiddle}
                >
                  <Popup>
                    <div>
                      <p>Username: {username}</p>
                      <p>Latitude: {location.coordinates[0]}</p>
                      <p>Longitude: {location.coordinates[1]}</p>
                      <p>Date & time: {formatTimeToIST(location.time)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            {LocationHistoryArray
              .sort((a, b) => new Date(a.time) - new Date(b.time))
              .map((location, index) => (
                index < LocationHistoryArray.length - 1 && (
                  <Polyline
                    key={index}
                    positions={[
                      [LocationHistoryArray[index].coordinates[0], LocationHistoryArray[index].coordinates[1]],
                      [LocationHistoryArray[index + 1].coordinates[0], LocationHistoryArray[index + 1].coordinates[1]]
                    ]}
                    pathOptions={{ color: "red" }}
                  />
                )
              ))}
          </>
        )}

        {memberlocationHistory && memberLocationHistoryArray.length > 0 && (
          <>
            {memberLocationHistoryArray
              .sort((a, b) => new Date(a.time) - new Date(b.time))
              .map((location, index) => (
                <Marker
                  key={location._id}
                  position={[location.coordinates[0], location.coordinates[1]]}
                  icon={index === 0 ? historyLocationIconStart : index === memberLocationHistoryArray.length - 1 ? historyLocationIconEnd : historyLocationIconMiddle}
                >
                  <Popup>
                    <div>
                      <p>Username: {selectedUser}</p>
                      <p>Latitude: {location.coordinates[0]}</p>
                      <p>Longitude: {location.coordinates[1]}</p>
                      <p>Date & time: {formatTimeToIST(location.time)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            {memberLocationHistoryArray
              .sort((a, b) => new Date(a.time) - new Date(b.time))
              .map((location, index) => (
                index < memberLocationHistoryArray.length - 1 && (
                  <Polyline
                    key={index}
                    positions={[
                      [memberLocationHistoryArray[index].coordinates[0], memberLocationHistoryArray[index].coordinates[1]],
                      [memberLocationHistoryArray[index + 1].coordinates[0], memberLocationHistoryArray[index + 1].coordinates[1]]
                    ]}
                    pathOptions={{ color: "yellow" }}
                  />
                )
              ))}
          </>
        )}
      </MapContainer>)}
    </div>
  );
};

export default Map;