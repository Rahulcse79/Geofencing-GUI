import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Geofencing from "./Components/Geofencing";
import Home from './Components/Home';
import LogIn from './Components/LogIn';
import Setting from './Components/Setting';
import History from './Components/History';
import MessageLogs from './Components/MessageLogs';
import CallLogs from './Components/CallLogs';
import Web from './Components/websocket';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          
          <Route path="/geofencing" element={<Geofencing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<LogIn />} />
          <Route path="/system-setting" element={<Setting />} />
          <Route path="/history" element={<History />} />
          <Route path="/message-logs" element={<MessageLogs />} />
          <Route path="/call-logs" element={<CallLogs />} />
          <Route path="/web" element={<Web />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
