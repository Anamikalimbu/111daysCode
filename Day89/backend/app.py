"""
app.py
-------
Flask backend that serves the Loan Approval Prediction model.

Endpoints:
    GET  /health   -> simple health check
    POST /predict  -> accepts JSON with applicant info and returns a prediction

Run with:
    python app.py
The server will start on http://localhost:5000
"""

import os
import traceback

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

FEATURE_COLUMNS = [
    "Age",
    "Annual_Income",
    "Credit_Score",
    "Loan_Amount",
    "Employment_Years",
]

app = Flask(__name__)
CORS(app)  # allow the React dev server (different port) to call this API

# ---------------------------------------------------------------------------
# Load model + scaler once at startup
# ---------------------------------------------------------------------------
if not (os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH)):
    raise FileNotFoundError(
        "model.pkl / scaler.pkl not found. Run `python train_model.py` first "
        "to train the model and generate these files."
    )

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


def validate_payload(data: dict):
    """Validate incoming JSON payload. Returns (is_valid, error_message)."""
    if not isinstance(data, dict):
        return False, "Request body must be a JSON object."

    missing = [f for f in FEATURE_COLUMNS if f not in data or data[f] in (None, "")]
    if missing:
        return False, f"Missing required field(s): {', '.join(missing)}"

    try:
        age = float(data["Age"])
        annual_income = float(data["Annual_Income"])
        credit_score = float(data["Credit_Score"])
        loan_amount = float(data["Loan_Amount"])
        employment_years = float(data["Employment_Years"])
    except (TypeError, ValueError):
        return False, "All fields must be numeric."

    if age <= 18:
        return False, "Age must be greater than 18."
    if not (300 <= credit_score <= 850):
        return False, "Credit_Score must be between 300 and 850."
    if annual_income < 0 or loan_amount < 0 or employment_years < 0:
        return False, "Annual_Income, Loan_Amount and Employment_Years cannot be negative."

    return True, None


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True, silent=True)
        if data is None:
            return jsonify({"error": "Invalid or missing JSON body."}), 400

        is_valid, error_message = validate_payload(data)
        if not is_valid:
            return jsonify({"error": error_message}), 400

        # Convert JSON -> DataFrame (preserve column order used during training)
        input_df = pd.DataFrame([{
            "Age": float(data["Age"]),
            "Annual_Income": abs(float(data["Annual_Income"])),
            "Credit_Score": min(float(data["Credit_Score"]), 850),
            "Loan_Amount": abs(float(data["Loan_Amount"])),
            "Employment_Years": float(data["Employment_Years"]),
        }])[FEATURE_COLUMNS]

        # Scale using the saved scaler
        scaled_input = scaler.transform(input_df)

        # Predict using the saved Logistic Regression model
        prediction = int(model.predict(scaled_input)[0])
        probability = float(model.predict_proba(scaled_input)[0][1])

        response = {
            "prediction": prediction,
            "status": "Approved" if prediction == 1 else "Denied",
            "probability": round(probability, 4),
        }
        return jsonify(response), 200

    except Exception as exc:  # noqa: BLE001
        traceback.print_exc()
        return jsonify({"error": f"Prediction failed: {str(exc)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
