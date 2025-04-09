import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Load dataset
crop = pd.read_csv("Crop_recommendation.csv")

# Encode target labels
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

# Random Forest with hyperparameter tuning
rf = RandomForestClassifier(random_state=42)

param_dist = {
    "n_estimators": [100, 200, 300],
    "max_depth": [5, 10, 15, None],
    "min_samples_split": [2, 5, 10],
    "min_samples_leaf": [1, 2, 4],
    "bootstrap": [True, False]
}

search = RandomizedSearchCV(
    rf, param_distributions=param_dist, n_iter=10, 
    scoring='accuracy', cv=5, random_state=42, verbose=1, n_jobs=-1
)

search.fit(X_train_scaled, y_train)

# Evaluate
best_rf = search.best_estimator_
y_pred = best_rf.predict(X_test_scaled)

print("🎯 Classification Report:\n", classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# Save best model
joblib.dump(best_rf, "random_forest_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

print("✅ Tuned RandomForest model, scaler, and label encoder saved successfully!")
