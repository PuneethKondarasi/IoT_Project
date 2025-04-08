# predict_server.py
from flask import Flask, request, jsonify
import numpy as np
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and scaler
model = joblib.load("random_forest_model.pkl")
scaler = joblib.load("scaler.pkl")

# Crop dictionary
crop_dict = {
    1: 'Rice', 2: 'Maize', 3: 'Jute', 4: 'Cotton', 5: 'Coconut', 6: 'Papaya', 7: 'Orange',
    8: 'Apple', 9: 'Muskmelon', 10: 'Watermelon', 11: 'Grapes', 12: 'Mango', 13: 'Banana',
    14: 'Pomegranate', 15: 'Lentil', 16: 'Blackgram', 17: 'Mungbean', 18: 'Mothbeans',
    19: 'Pigeonpeas', 20: 'Kidneybeans', 21: 'Chickpea', 22: 'Coffee'
}

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

        # Use default values
        N, P, K, pH = 50, 50, 50, 6.5
        features = np.array([[N, P, K, temperature, humidity, pH, rainfall]])
        transformed = scaler.transform(features)

        probabilities = model.predict_proba(transformed)[0]
        top_4_indices = np.argsort(probabilities)[-4:][::-1]
        top_4_crops = [
            {"name": crop_dict[idx + 1], "probability": round(probabilities[idx] * 100, 2)}
            for idx in top_4_indices
        ]

        return jsonify({"recommended_crops": top_4_crops})

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
