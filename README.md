# 🌾 Smart Farming Dashboard

A real-time **IoT-based Smart Farming Dashboard** built with **React**, **Flask**, and **Arduino sensors**, enabling efficient monitoring of critical environmental conditions like **temperature**, **humidity**, **soil moisture**, and **forecasted rainfall**. This system provides actionable insights for optimized crop growth and sustainable farming practices.

---

## 🚀 Features

- **Live Sensor Monitoring** via Arduino (DHT11 + Soil Moisture Sensor)
- **Rainfall Forecasting** using OpenWeather API
- **ML-Based Crop Recommendation** (Random Forest)
- **Dynamic Data Visualization** with line graphs
- **Real-Time Alerts & Notifications** on threshold breaches
- **Fully Responsive UI** using modern React + Tailwind CSS

---

## 🛠 Tech Stack

| Frontend       | Backend       | Machine Learning | IoT & API      |
|----------------|---------------|------------------|----------------|
| React + Vite   | Flask (Python) | scikit-learn     | Arduino (DHT11, Soil Moisture) |
| Tailwind CSS   | REST API       | joblib           | OpenWeather API |

---

## 🖼️ Screenshots

![Image](https://github.com/user-attachments/assets/01498f60-b4e0-43ea-9fe5-d3b64a0a5a7e)
![Image](https://github.com/user-attachments/assets/6c8558ec-d0d5-411f-9a19-932675d86c47)
![Image](https://github.com/user-attachments/assets/f9a2c423-1884-476e-99ed-453ae2a67f1f)

---

## 🔧 Setup Instructions

### Prerequisites

- Node.js & npm
- Python
- Arduino IDE (for uploading sensor code)
- Arduino board + DHT11 + Soil Moisture Sensor
- COM port available (e.g., `COM4`)

---

## Project Setup

### Backend Setup
```bash
cd backend
python train_model.py
python sensor_server.py
# Open a new terminal
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 Hardware Setup
- **DHT11 sensor** for temperature & humidity
- **Soil Moisture Sensor** for soil condition

### Steps:
1. Connect both sensors to Arduino.
2. Upload the data-collecting sketch to the Arduino.
3. The data is sent via Serial COM to the Flask backend.

---

## 🧠 Crop Recommendation Model
- **Model**: Random Forest Classifier
- **Training**: Trained on the Crop Recommendation Dataset
- **Preprocessing**: Encoded target labels and scaled features using MinMaxScaler
- **Model**: Saved as `.pkl` files for prediction usage

---

## ✅ Future Enhancements
- Add SMS/email alerts on critical breaches
- Implement database storage (MongoDB or PostgreSQL)
- Add custom Threshold Settings
- Deploy to cloud (Render/Heroku for Flask, Netlify/Vercel for React)

---

## 👨‍💻 Contributors

- **Puneeth Kondarasi**  
  Engineering Student @ Vellore Institute of Technology  
  [LinkedIn](https://www.linkedin.com/in/puneeth-kondarasi/) | [GitHub](https://github.com/PuneethKondarasi)
  
- **Aditya Hiregoudar**  
  Engineering Student @ Vellore Institute of Technology  
  [LinkedIn](https://www.linkedin.com/in/aditya-hiregoudar-a8391124a/) | [GitHub](https://github.com/Aditya-Hiregoudar)

- **Varshith Lakkakula**  
  Engineering Student @ Vellore Institute of Technology  
  [LinkedIn](https://www.linkedin.com/in/l-s-pavan-varshith-9629852a8/)
