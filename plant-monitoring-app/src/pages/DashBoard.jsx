import { useState, useEffect, useCallback } from "react";
import SensorCard from "../components/dashboard/SensorCard";
import SensorChart from "../components/dashboard/SensorChart";
import PlantRecommendation from "../components/dashboard/PlantRecommendation";
import AlertsHistory from "../components/dashboard/AlertHistory";
import { motion } from "framer-motion";
import { SunIcon, CloudIcon, BeakerIcon, FireIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const Dashboard = ({ thresholds }) => {
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const [sensorData, setSensorData] = useState({
    temperature: { current: 29, unit: "°C" },
    humidity: { current: 78, unit: "%" },
    soilMoisture: { current: 59, unit: "%" },
    rainfall: { current: 50, unit: "mm" },
  });

  const [liveSensorData, setLiveSensorData] = useState({
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
  });

  const refreshDisplayData = () => {
    setSensorData({
      temperature: { current: liveSensorData.temperature, unit: "°C" },
      humidity: { current: liveSensorData.humidity, unit: "%" },
      soilMoisture: { current: liveSensorData.soilMoisture, unit: "%" },
      rainfall: { current: 0, unit: "mm" },
    });

    checkThresholds();
  };

  const checkThresholds = useCallback(() => {
    const currentTime = new Date().toLocaleTimeString();
    const alerts = [];

    if (thresholds) {
      if (sensorData.temperature.current > thresholds.temperature.high) {
        alerts.push(`⚠️ High Temperature Alert: ${sensorData.temperature.current}°C exceeds threshold of ${thresholds.temperature.high}°C (${currentTime})`);
      } else if (sensorData.temperature.current < thresholds.temperature.low) {
        alerts.push(`⚠️ Low Temperature Alert: ${sensorData.temperature.current}°C below threshold of ${thresholds.temperature.low}°C (${currentTime})`);
      }

      if (sensorData.humidity.current > thresholds.humidity.high) {
        alerts.push(`⚠️ High Humidity Alert: ${sensorData.humidity.current}% exceeds threshold of ${thresholds.humidity.high}% (${currentTime})`);
      } else if (sensorData.humidity.current < thresholds.humidity.low) {
        alerts.push(`⚠️ Low Humidity Alert: ${sensorData.humidity.current}% below threshold of ${thresholds.humidity.low}% (${currentTime})`);
      }

      if (sensorData.soilMoisture.current > thresholds.soilMoisture.high) {
        alerts.push(`⚠️ High Soil Moisture Alert: ${sensorData.soilMoisture.current}% exceeds threshold of ${thresholds.soilMoisture.high}% (${currentTime})`);
      } else if (sensorData.soilMoisture.current < thresholds.soilMoisture.low) {
        alerts.push(`⚠️ Low Soil Moisture Alert: ${sensorData.soilMoisture.current}% below threshold of ${thresholds.soilMoisture.low}% (${currentTime})`);
      }
    }

    if (alerts.length > 0) {
      setNotifications(prev => [...alerts, ...prev].slice(0, 10));
    }
  }, [sensorData, thresholds]);

  useEffect(() => {
    checkThresholds();
  }, [sensorData, thresholds, checkThresholds]);

  useEffect(() => {
    const fetchLiveSensorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/sensor-data");
        if (!response.ok) throw new Error("Server responded with error");

        const data = await response.json();

        setLiveSensorData({
          temperature: data.temperature,
          humidity: data.humidity,
          soilMoisture: Math.round(((1023 - data.soilMoisture) / 1023) * 100),
        });

        console.log("✅ Live sensor data:", data);
      } catch (error) {
        console.error("❌ Error fetching live sensor data:", error);
      }
    };

    const interval = setInterval(fetchLiveSensorData, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: sensorData.temperature.current,
          humidity: sensorData.humidity.current,
          soil_moisture: sensorData.soilMoisture.current,
          rainfall: sensorData.rainfall.current,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch prediction");

      const data = await response.json();
      setRecommendedCrops(data.recommended_crops || []);
      setShowGenerateButton(false);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setRecommendedCrops(["Tomatoes", "Peppers", "Cucumbers"]);
      setShowGenerateButton(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <h2 className="text-2xl font-bold mb-2">Plant Environment Dashboard</h2>
        <p className="text-gray-400">Real-time sensor data and plant recommendations based on current conditions.</p>
      </motion.div>

      <div className="flex justify-end">
        <button
          onClick={refreshDisplayData}
          className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span>Refresh Display</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard
          title="Temperature"
          value={sensorData.temperature.current}
          unit={sensorData.temperature.unit}
          icon={FireIcon}
          color="border-orange-500"
          thresholds={thresholds?.temperature}
        />
        <SensorCard
          title="Humidity"
          value={sensorData.humidity.current}
          unit={sensorData.humidity.unit}
          icon={CloudIcon}
          color="border-blue-500"
          thresholds={thresholds?.humidity}
        />
        <SensorCard
          title="Soil Moisture"
          value={sensorData.soilMoisture.current}
          unit={sensorData.soilMoisture.unit}
          icon={BeakerIcon}
          color="border-emerald-500"
          thresholds={thresholds?.soilMoisture}
        />
        <SensorCard
          title="Rainfall"
          value={sensorData.rainfall.current}
          unit={sensorData.rainfall.unit}
          icon={SunIcon}
          color="border-purple-500"
          thresholds={null}
        />
      </div>

      <AlertsHistory alerts={notifications} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SensorChart
          title="Temperature"
          data={{ labels: [new Date().toLocaleTimeString()], values: [liveSensorData.temperature] }}
          color="rgb(249, 115, 22)"
          unit="°C"
        />
        <SensorChart
          title="Humidity"
          data={{ labels: [new Date().toLocaleTimeString()], values: [liveSensorData.humidity] }}
          color="rgb(59, 130, 246)"
          unit="%"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SensorChart
          title="Soil Moisture"
          data={{ labels: [new Date().toLocaleTimeString()], values: [liveSensorData.soilMoisture] }}
          color="rgb(16, 185, 129)"
          unit="%"
        />
        <SensorChart
          title="Rainfall"
          data={{ labels: [new Date().toLocaleTimeString()], values: [sensorData.rainfall.current] }}
          color="rgb(139, 92, 246)"
          unit="mm"
        />
      </div>

      {showGenerateButton ? (
        <div className="text-center mt-6">
          <button
            onClick={fetchPrediction}
            className={`px-6 py-3 rounded-md text-white font-bold ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Recommendation"}
          </button>
        </div>
      ) : (
        <div>
          <PlantRecommendation crops={recommendedCrops} />
          <div className="text-center mt-2">
            <button
              onClick={() => setShowGenerateButton(true)}
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              Generate New Recommendation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
