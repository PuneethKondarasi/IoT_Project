from flask import Flask, request, jsonify
import numpy as np
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model, scaler, and label encoder
model = joblib.load("random_forest_model.pkl")
scaler = joblib.load("scaler.pkl")
label_encoder = joblib.load("label_encoder.pkl")

@app.route('/')
def home():
    return "🌱 Crop Recommendation API is running on port 5001!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        temperature = data.get('temperature')
        humidity = data.get('humidity')
        soil_moisture = data.get('soilMoisture')
        rainfall = data.get('rainfall')

        N, P, K, pH = 50, 50, 50, 6.5

        if None in [temperature, humidity, soil_moisture, rainfall]:
            return jsonify({"error": "Missing input values for prediction."}), 400

        features = np.array([[N, P, K, temperature, humidity, pH, rainfall, soil_moisture]])
        transformed = scaler.transform(features)

        probabilities = model.predict_proba(transformed)[0]
        top_4_indices = np.argsort(probabilities)[-4:][::-1]

        top_4_crops = [
            {
                "name": label_encoder.inverse_transform([idx])[0],
                "probability": round(probabilities[idx] * 100, 2)
            }
            for idx in top_4_indices
        ]

        return jsonify({"recommended_crops": top_4_crops})

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
