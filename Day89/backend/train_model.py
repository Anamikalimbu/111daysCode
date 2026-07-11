"""
train_model.py
----------------
Trains a Logistic Regression model on the loan approval dataset and
saves both the trained model and the fitted StandardScaler to disk
using joblib, so the Flask API (app.py) can load them at request time.

Steps performed (exactly as required):
1. Load the CSV dataset.
2. Clean the data:
   - Convert Annual_Income to absolute values.
   - Convert Loan_Amount to absolute values.
   - Clip Credit_Score maximum to 850.
3. Separate features and target.
4. Train/Test split (80/20) with stratify=True and random_state=42.
5. Standardize features using StandardScaler.
6. Train LogisticRegression(random_state=42).
7. Save both the trained model and scaler using joblib.
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "loan_dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

FEATURE_COLUMNS = [
    "Age",
    "Annual_Income",
    "Credit_Score",
    "Loan_Amount",
    "Employment_Years",
]
TARGET_COLUMN = "Loan_Approved"


def load_data(path: str) -> pd.DataFrame:
    """1. Load the CSV dataset."""
    df = pd.read_csv(path)
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """2. Clean the data."""
    df = df.copy()
    df["Annual_Income"] = df["Annual_Income"].abs()
    df["Loan_Amount"] = df["Loan_Amount"].abs()
    df["Credit_Score"] = df["Credit_Score"].clip(upper=850)
    return df


def main():
    print("Loading dataset from:", DATA_PATH)
    df = load_data(DATA_PATH)

    print("Cleaning data...")
    df = clean_data(df)

    print("Separating features and target...")
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    print("Splitting train/test (80/20, stratify=True, random_state=42)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    print("Standardizing features with StandardScaler...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("Training LogisticRegression(random_state=42)...")
    model = LogisticRegression(random_state=42)
    model.fit(X_train_scaled, y_train)

    # Quick evaluation for visibility in the console
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nTest Accuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred))

    print("Saving model and scaler with joblib...")
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    print(f"Model saved to:  {MODEL_PATH}")
    print(f"Scaler saved to: {SCALER_PATH}")
    print("\nTraining complete!")


if __name__ == "__main__":
    main()
