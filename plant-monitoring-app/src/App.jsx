import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/DashBoard";
import Settings from "./pages/Settings";
import SimulateSensorData from "./utils/SimulateSensorData"; // ✅ Import
import "./index.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState([]); // ✅ New state
  const [sensorData, setSensorData] = useState({ // ✅ New state
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

  // Apply theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-white", "text-gray-900");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-gray-900", "text-white");
      document.body.classList.add("bg-white", "text-gray-900");
    }
  }, [theme]);

  // Simulate sensor data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const data = SimulateSensorData();
      setSensorData(data);

      const now = new Date().toLocaleTimeString();
      const alerts = [];

      // Threshold checks
      if (data.temperature > thresholds.temperature.high) {
        alerts.push({ message: `🌡️ High Temperature: ${data.temperature}°C`, time: now });
      } else if (data.temperature < thresholds.temperature.low) {
        alerts.push({ message: `🌡️ Low Temperature: ${data.temperature}°C`, time: now });
      }

      if (data.humidity > thresholds.humidity.high) {
        alerts.push({ message: `💧 High Humidity: ${data.humidity}%`, time: now });
      } else if (data.humidity < thresholds.humidity.low) {
        alerts.push({ message: `💧 Low Humidity: ${data.humidity}%`, time: now });
      }

      if (data.soilMoisture > thresholds.soilMoisture.high) {
        alerts.push({ message: `🌱 Soil Moisture Too High: ${data.soilMoisture}`, time: now });
      } else if (data.soilMoisture < thresholds.soilMoisture.low) {
        alerts.push({ message: `🌱 Soil Too Dry: ${data.soilMoisture}`, time: now });
      }

      if (data.rainfall > thresholds.rainfall.high) {
        alerts.push({ message: `🌧️ Heavy Rainfall: ${data.rainfall} mm`, time: now });
      } else if (data.rainfall < thresholds.rainfall.low) {
        alerts.push({ message: `🌧️ Very Low Rainfall: ${data.rainfall} mm`, time: now });
      }

      if (alerts.length > 0) {
        setNotifications((prev) => [...alerts, ...prev]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [thresholds]);

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
            notifications={notifications} // ✅ Pass notifications
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
                    sensorData={sensorData} // ✅ Pass sensor data
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
