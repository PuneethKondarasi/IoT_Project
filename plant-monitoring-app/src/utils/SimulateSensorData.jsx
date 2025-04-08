// utils/SimulateSensorData.js
export default function SimulateSensorData() {
    return {
      temperature: Math.floor(Math.random() * 50),
      humidity: Math.floor(Math.random() * 100),
      soilMoisture: Math.floor(Math.random() * 100),
      rainfall: Math.floor(Math.random() * 150),
    };
  }
  