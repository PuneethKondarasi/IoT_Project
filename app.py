from flask import Flask, request, jsonify
import numpy as np
import joblib
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load the trained model and scaler
model = joblib.load("random_forest_model.pkl")
scaler = joblib.load("scaler.pkl")

# Crop mapping
crop_dict = {
    1: 'Rice', 2: 'Maize', 3: 'Jute', 4: 'Cotton', 5: 'Coconut', 6: 'Papaya', 7: 'Orange',
    8: 'Apple', 9: 'Muskmelon', 10: 'Watermelon', 11: 'Grapes', 12: 'Mango', 13: 'Banana',
    14: 'Pomegranate', 15: 'Lentil', 16: 'Blackgram', 17: 'Mungbean', 18: 'Mothbeans',
    19: 'Pigeonpeas', 20: 'Kidneybeans', 21: 'Chickpea', 22: 'Coffee'
}


@app.route('/')
def home():
    return "🌱 Crop Recommendation API is running!"


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        temperature = data.get('temperature')
        humidity = data.get('humidity')
        soil_moisture = data.get('soilMoisture')
        rainfall = data.get('rainfall')

        # Default values for missing features (N, P, K, pH)
        N, P, K, pH = 50, 50, 50, 6.5  # Average values

        # Prepare feature array (NOTE: soilMoisture not used in model)
        features = np.array([[N, P, K, temperature, humidity, pH, rainfall]])
        transformed_features = scaler.transform(features)

        # ✅ Get prediction probabilities
        probabilities = model.predict_proba(transformed_features)[0]

        # ✅ Get the top 4 crop indices
        top_4_indices = np.argsort(probabilities)[-4:][::-1]

        # ✅ Convert indices to crop names and probabilities
        top_4_crops = [
            {"name": crop_dict[idx + 1], "probability": round(probabilities[idx] * 100, 2)}
            for idx in top_4_indices
        ]

        print("🌾 Top 4 Predicted Crops:", top_4_crops)

        return jsonify({"recommended_crops": top_4_crops})

    except Exception as e:
        print(f"❌ Error in /predict: {str(e)}")
        return jsonify({"error": str(e)})


# ✅ Optional: Simulated sensor data route for frontend testing
@app.route('/sensor-data', methods=['GET'])
def get_sensor_data():
    try:
        # Simulate sensor values
        temperature = round(random.uniform(15, 40), 2)
        humidity = round(random.uniform(30, 90), 2)
        soil_moisture = round(random.uniform(10, 80), 2)
        rainfall = round(random.uniform(0, 10), 2)

        # Check thresholds and prepare notifications
        notifications = []
        if temperature > 35:
            notifications.append("🔥 High Temperature Alert!")
        elif temperature < 18:
            notifications.append("❄️ Low Temperature Alert!")

        if humidity < 40:
            notifications.append("💧 Low Humidity Detected!")

        if soil_moisture < 20:
            notifications.append("🌱 Soil is too dry!")

        if rainfall > 8:
            notifications.append("🌧️ Heavy Rainfall Detected!")

        return jsonify({
            "sensorData": {
                "temperature": temperature,
                "humidity": humidity,
                "soilMoisture": soil_moisture,
                "rainfall": rainfall
            },
            "notifications": notifications
        })

    except Exception as e:
        print(f"❌ Error in /sensor-data: {str(e)}")
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
