import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier

crop = pd.read_csv("Crop_recommendation_clean.csv")

# Encode target labels using LabelEncoder
label_encoder = LabelEncoder()
crop['label_encoded'] = label_encoder.fit_transform(crop['label'])

X = crop.drop(['label', 'label_encoded'], axis=1)  
y = crop['label_encoded']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Normalize input features
scaler = MinMaxScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = RandomForestClassifier(random_state=42)
model.fit(X_train_scaled, y_train)

joblib.dump(model, "random_forest_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

print("✅ Model, scaler, and label encoder saved successfully!")
