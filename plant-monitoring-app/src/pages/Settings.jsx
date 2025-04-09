import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cog6ToothIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

const Settings = () => {
  const [devices, setDevices] = useState([
    { id: 1, name: "Soil Moisture Sensor", key: "soilMoisture", status: "Checking..." },
    { id: 2, name: "Temperature Sensor", key: "temperature", status: "Checking..." },
    { id: 3, name: "Humidity Sensor", key: "humidity", status: "Checking..." },
  ]);

  const checkDeviceStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/sensor-data");
      const data = await response.json();

      const updatedDevices = devices.map((device) => ({
        ...device,
        status: data[device.key] !== undefined && data[device.key] !== null
          ? "Active"
          : "Disconnected"
      }));

      setDevices(updatedDevices);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      setDevices(devices.map(device => ({ ...device, status: "Disconnected" })));
    }
  };

  useEffect(() => {
    checkDeviceStatus(); // Initial fetch
    const interval = setInterval(checkDeviceStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <motion.div
      className="p-6 bg-gray-800 text-white rounded-lg shadow-md max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <Cog6ToothIcon className="w-6 h-6 mr-2 text-emerald-400" />
        Connected Devices
      </h2>

      <div className="p-4 bg-gray-700 rounded-lg shadow">
        <h4 className="text-md font-medium flex items-center mb-3">
          <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-emerald-400" />
          Devices List
        </h4>
        <div className="bg-gray-800 p-3 rounded-md space-y-2">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex justify-between py-1 border-b border-gray-600 last:border-b-0"
            >
              <span>{device.name}</span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  device.status === "Active"
                    ? "bg-green-500"
                    : device.status === "Checking..."
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {device.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
