import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/DashBoard";
import Settings from "./pages/Settings";
import "./index.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notifications] = useState([]);
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
    rainfall: 0,
  });

  const [thresholds, setThresholds] = useState({
    temperature: {
      high: parseInt(localStorage.getItem("threshold.temperature.high")) || 35,
      low: parseInt(localStorage.getItem("threshold.temperature.low")) || 15,
    },
    humidity: {
      high: parseInt(localStorage.getItem("threshold.humidity.high")) || 90,
      low: parseInt(localStorage.getItem("threshold.humidity.low")) || 30,
    },
    soilMoisture: {
      high: parseInt(localStorage.getItem("threshold.soilMoisture.high")) || 70,
      low: parseInt(localStorage.getItem("threshold.soilMoisture.low")) || 30,
    },
    rainfall: {
      high: parseInt(localStorage.getItem("threshold.rainfall.high")) || 100,
      low: parseInt(localStorage.getItem("threshold.rainfall.low")) || 0,
    },
  });

  // Simulate sensor data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
        fetch("http://localhost:5000/sensor-data")
        .then((res) => {
          if (!res.ok) throw new Error("Server responded with error");
          return res.json();
        })
        .then((data) => {
          console.log("✅ Sensor Data:", data);
          setSensorData(data);
        })
        .catch((err) => {
          console.error("Error fetching sensor data:", err.message);
        });
    }, 5000);
  
    return () => clearInterval(interval);
  }, []);
  
  
  const handleSettingsChange = (settings) => {
    if (settings.theme) setTheme(settings.theme);
    if (settings.thresholds) setThresholds(settings.thresholds);
  };

  return (
    <Router>
      <div
        className={`flex h-screen overflow-hidden ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} theme={theme} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            theme={theme}
            notifications={notifications}
          />
          <div
            className={`p-8 flex-1 overflow-y-auto ${
              theme === "dark" ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    thresholds={thresholds}
                    sensorData={sensorData}
                    notifications={notifications}
                  />
                }
              />
              <Route
                path="/settings"
                element={<Settings onApplySettings={handleSettingsChange} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
