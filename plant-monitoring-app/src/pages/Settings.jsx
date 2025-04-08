import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cog6ToothIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  FireIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

const Settings = ({ onApplySettings }) => {
  const [thresholds, setThresholds] = useState({
    temperature: {
      high: parseInt(localStorage.getItem("threshold.temperature.high")) || 35,
      low: parseInt(localStorage.getItem("threshold.temperature.low")) || 15
    },
    humidity: {
      high: parseInt(localStorage.getItem("threshold.humidity.high")) || 90,
      low: parseInt(localStorage.getItem("threshold.humidity.low")) || 30
    },
    soilMoisture: {
      high: parseInt(localStorage.getItem("threshold.soilMoisture.high")) || 70,
      low: parseInt(localStorage.getItem("threshold.soilMoisture.low")) || 30
    }
  });

  const [devices, setDevices] = useState([
    { id: 1, name: "Soil Moisture Sensor", status: "Active" },
    { id: 2, name: "Temperature Sensor", status: "Active" },
    { id: 3, name: "Humidity Sensor", status: "Active" },
  ]);

  const handleThresholdChange = (sensor, type, value) => {
    const updatedThresholds = {
      ...thresholds,
      [sensor]: {
        ...thresholds[sensor],
        [type]: parseInt(value),
      },
    };
    setThresholds(updatedThresholds);
    if (onApplySettings) {
      onApplySettings({ thresholds: updatedThresholds });
    }
  };

  const saveSettings = () => {
    Object.entries(thresholds).forEach(([sensor, values]) => {
      Object.entries(values).forEach(([type, value]) => {
        localStorage.setItem(`threshold.${sensor}.${type}`, value);
      });
    });

    alert("✅ Settings saved successfully!");
  };

  const resetSettings = () => {
    const defaultThresholds = {
      temperature: { high: 35, low: 15 },
      humidity: { high: 90, low: 30 },
      soilMoisture: { high: 70, low: 30 }
    };
    setThresholds(defaultThresholds);

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('threshold.')) {
        localStorage.removeItem(key);
      }
    });

    alert("⚠️ Settings reset to default!");
  };

  const ThresholdSetting = ({ title, icon: Icon, iconColor, sensor, min, max }) => (
    <div className="p-4 bg-gray-700 dark:bg-gray-700 rounded-lg shadow">
      <h4 className="text-md font-medium flex items-center mb-3">
        <Icon className={`w-5 h-5 mr-2 ${iconColor}`} />
        {title} Thresholds
      </h4>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm">High ({thresholds[sensor].high}%)</label>
            <span className="text-sm font-medium">{thresholds[sensor].high}%</span>
          </div>
          <input
            type="range"
            min={min || 0}
            max={max || 100}
            value={thresholds[sensor].high}
            onChange={(e) => handleThresholdChange(sensor, 'high', e.target.value)}
            className="w-full bg-gray-600"
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm">Low ({thresholds[sensor].low}%)</label>
            <span className="text-sm font-medium">{thresholds[sensor].low}%</span>
          </div>
          <input
            type="range"
            min={min || 0}
            max={max || 100}
            value={thresholds[sensor].low}
            onChange={(e) => handleThresholdChange(sensor, 'low', e.target.value)}
            className="w-full bg-gray-600"
          />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="p-6 bg-gray-800 text-white rounded-lg shadow-md max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <Cog6ToothIcon className="w-6 h-6 mr-2 text-emerald-400" />
        Threshold Settings
      </h2>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ThresholdSetting
          title="Temperature"
          icon={FireIcon}
          iconColor="text-orange-500"
          sensor="temperature"
          min={0}
          max={50}
        />
        <ThresholdSetting
          title="Humidity"
          icon={CloudIcon}
          iconColor="text-blue-500"
          sensor="humidity"
        />
        <ThresholdSetting
          title="Soil Moisture"
          icon={BeakerIcon}
          iconColor="text-emerald-500"
          sensor="soilMoisture"
        />
        
        {/* Connected Devices */}
        <div className="p-4 bg-gray-700 rounded-lg shadow">
          <h4 className="text-md font-medium flex items-center mb-3">
            <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-emerald-400" />
            Connected Devices
          </h4>
          <div className="bg-gray-800 p-3 rounded-md space-y-2">
            {devices.map((device) => (
              <div key={device.id} className="flex justify-between py-1 border-b border-gray-600 last:border-b-0">
                <span>{device.name}</span>
                <span className={`text-sm px-3 py-1 rounded-full ${device.status === "Active" ? "bg-green-500" : "bg-red-500"}`}>
                  {device.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save & Reset Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={saveSettings}
          className="px-6 py-2 bg-emerald-600 rounded-md hover:bg-emerald-700 font-medium"
        >
          Save Settings
        </button>
        <button
          onClick={resetSettings}
          className="px-6 py-2 bg-red-600 rounded-md hover:bg-red-700 font-medium"
        >
          Reset to Default
        </button>
      </div>
    </motion.div>
  );
};

export default Settings;
