import pandas as pd
import numpy as np

df = pd.read_csv("Crop_recommendation.csv")

# Define realistic soil moisture ranges based on crop type
moisture_ranges = {
    'rice': (60, 80),
    'maize': (40, 60),
    'chickpea': (30, 50),
    'kidneybeans': (40, 60),
    'pigeonpeas': (30, 50),
    'mothbeans': (25, 45),
    'mungbean': (30, 50),
    'blackgram': (30, 50),
    'lentil': (30, 50),
    'pomegranate': (20, 40),
    'banana': (50, 70),
    'mango': (30, 50),
    'grapes': (30, 50),
    'watermelon': (40, 60),
    'muskmelon': (40, 60),
    'apple': (30, 50),
    'orange': (30, 50),
    'papaya': (40, 60),
    'coconut': (60, 80),
    'cotton': (30, 50),
    'jute': (60, 80),
    'coffee': (50, 70)
}

# Function to generate random moisture within range
def generate_moisture(crop):
    low, high = moisture_ranges.get(crop, (30, 50))  # default range
    return round(np.random.uniform(low, high), 2)

df["moisture"] = df["label"].apply(generate_moisture)

# Save to new CSV
df.to_csv("Crop_recommendation_with_moisture.csv", index=False)
