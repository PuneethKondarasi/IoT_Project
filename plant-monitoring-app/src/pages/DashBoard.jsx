import { useState, useEffect, useCallback } from "react";
import SensorCard from "../components/dashboard/SensorCard";
import SensorChart from "../components/dashboard/SensorChart";
import PlantRecommendation from "../components/dashboard/PlantRecommendation";
import AlertsHistory from "../components/dashboard/AlertHistory";
import { motion } from "framer-motion";
import {
  SunIcon,
  CloudIcon,
  BeakerIcon,
  FireIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const Dashboard = ({ thresholds }) => {
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const [sensorData, setSensorData] = useState({
    temperature: { current: 0, unit: "°C" },
    humidity: { current: 0, unit: "%" },
    soilMoisture: { current: 0, unit: "%" },
    rainfall: { current: 0, unit: "mm" },
  });

  const [liveSensorData, setLiveSensorData] = useState({
    temperature: null,
    humidity: null,
    soilMoisture: null,
    rainfall: null,
  });

  const [forecastRainfall, setForecastRainfall] = useState(0);

  useEffect(() => {
    const fetchRainfallForecast = async () => {
      try {
        const res = await fetch("http://localhost:5000/forecast-rainfall");
        const data = await res.json();
        setForecastRainfall(data.rainfall);
      } catch (error) {
        console.error("Error fetching forecast rainfall:", error);
      }
    };

    fetchRainfallForecast();
  }, []);

  const refreshDisplayData = () => {
    if (
      liveSensorData.temperature === null ||
      liveSensorData.humidity === null ||
      liveSensorData.soilMoisture === null ||
      liveSensorData.rainfall === null
    ) {
      setSensorData({
        temperature: { current: "Not Connected", unit: "°C" },
        humidity: { current: "Not Connected", unit: "%" },
        soilMoisture: { current: "Not Connected", unit: "%" },
        rainfall: { current: "Not Connected", unit: "mm" },
      });
      return;
    }

    setSensorData({
      temperature: { current: liveSensorData.temperature, unit: "°C" },
      humidity: { current: liveSensorData.humidity, unit: "%" },
      soilMoisture: { current: liveSensorData.soilMoisture, unit: "%" },
      rainfall: { current: liveSensorData.rainfall, unit: "mm" },
    });

    checkThresholds(
      liveSensorData.temperature,
      liveSensorData.humidity,
      liveSensorData.soilMoisture,
      liveSensorData.rainfall
    );
  };

  const checkThresholds = useCallback((temp, hum, moist, rain) => {
    const currentTime = new Date().toLocaleTimeString();
    const alerts = [];

    if (thresholds) {
      if (temp > thresholds.temperature.high) {
        alerts.push(`⚠️ High Temperature Alert: ${temp}°C exceeds ${thresholds.temperature.high}°C (${currentTime})`);
      } else if (temp < thresholds.temperature.low) {
        alerts.push(`⚠️ Low Temperature Alert: ${temp}°C below ${thresholds.temperature.low}°C (${currentTime})`);
      }

      if (hum > thresholds.humidity.high) {
        alerts.push(`⚠️ High Humidity Alert: ${hum}% exceeds ${thresholds.humidity.high}% (${currentTime})`);
      } else if (hum < thresholds.humidity.low) {
        alerts.push(`⚠️ Low Humidity Alert: ${hum}% below ${thresholds.humidity.low}% (${currentTime})`);
      }

      if (moist > thresholds.soilMoisture.high) {
        alerts.push(`⚠️ High Soil Moisture Alert: ${moist}% exceeds ${thresholds.soilMoisture.high}% (${currentTime})`);
      } else if (moist < thresholds.soilMoisture.low) {
        alerts.push(`⚠️ Low Soil Moisture Alert: ${moist}% below ${thresholds.soilMoisture.low}% (${currentTime})`);
      }

      if (rain > thresholds.rainfall.high) {
        alerts.push(`⚠️ Heavy Rainfall Forecast: ${rain} mm exceeds ${thresholds.rainfall.high} mm (${currentTime})`);
      } else if (thresholds.rainfall.low !== undefined && rain < thresholds.rainfall.low) {
        alerts.push(`⚠️ Low Rainfall Forecast: ${rain} mm below ${thresholds.rainfall.low} mm (${currentTime})`);
      }
    }

    if (alerts.length > 0) {
      setNotifications((prev) => [...alerts, ...prev].slice(0, 10));
    }
  }, [thresholds]);

  useEffect(() => {
    const fetchLiveSensorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/sensor-data");
        if (!response.ok) throw new Error("Server responded with error");

        const data = await response.json();
        const temp = data.temperature;
        const hum = data.humidity;
        const moist = Math.round(((1023 - data.soilMoisture) / 1023) * 100);
        const rain = data.rainfall;

        setLiveSensorData({ temperature: temp, humidity: hum, soilMoisture: moist, rainfall: rain });
      } catch (error) {
        console.error("❌ Error fetching live sensor data:", error);
        setLiveSensorData({ temperature: null, humidity: null, soilMoisture: null, rainfall: null });
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
          soilMoisture: sensorData.soilMoisture.current,  // ✅ FIXED HERE
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
  

  const isConnected = liveSensorData.temperature !== null;

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
        <SensorCard title="Temperature" value={sensorData.temperature.current} unit={sensorData.temperature.unit} icon={FireIcon} color="border-orange-500" thresholds={thresholds?.temperature} />
        <SensorCard title="Humidity" value={sensorData.humidity.current} unit={sensorData.humidity.unit} icon={CloudIcon} color="border-blue-500" thresholds={thresholds?.humidity} />
        <SensorCard title="Soil Moisture" value={sensorData.soilMoisture.current} unit={sensorData.soilMoisture.unit} icon={BeakerIcon} color="border-emerald-500" thresholds={thresholds?.soilMoisture} />
        <SensorCard title="Rainfall" value={sensorData.rainfall.current} unit={sensorData.rainfall.unit} icon={SunIcon} color="border-purple-500" thresholds={null} />
      </div>

      <AlertsHistory alerts={notifications} />

      {isConnected && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SensorChart title="Temperature" data={{ labels: [new Date().toLocaleTimeString()], values: [liveSensorData.temperature] }} color="rgb(249, 115, 22)" unit="°C" />
            <SensorChart title="Humidity" data={{ labels: [new Date().toLocaleTimeString()], values: [liveSensorData.humidity] }} color="rgb(59, 130, 246)" unit="%" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SensorChart title="Soil Moisture" data={{ labels: [new Date().toLocaleTimeString()], values: [liveSensorData.soilMoisture] }} color="rgb(16, 185, 129)" unit="%" />
            <SensorChart title="Rainfall" data={{ labels: [new Date().toLocaleTimeString()], values: [liveSensorData.rainfall] }} color="rgb(139, 92, 246)" unit="mm" />
          </div>
        </>
      )}

      {showGenerateButton ? (
        <div className="text-center mt-6">
          <button onClick={fetchPrediction} className={`px-6 py-3 rounded-md text-white font-bold ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`} disabled={loading}>
            {loading ? "Generating..." : "Generate Recommendation"}
          </button>
        </div>
      ) : (
        <div>
          <PlantRecommendation crops={recommendedCrops} />
          <div className="text-center mt-2">
            <button onClick={() => setShowGenerateButton(true)} className="text-blue-500 hover:text-blue-400 text-sm">
              Generate New Recommendation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
