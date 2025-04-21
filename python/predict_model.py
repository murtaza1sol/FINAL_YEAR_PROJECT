# python/predict_model.py

import sys
import json
import pickle
import numpy as np
import os

def main():

   

    if len(sys.argv) < 2:
        print("No input received", file=sys.stderr)
        sys.exit(1)

    try:
        # Load the model
        model_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'model.pkl')
 print("Model path:", model_path, file=sys.stderr)
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        # Load input from CLI
        symptoms = json.loads(sys.argv[1])

        # Make sure symptoms are in the correct order for your model
        feature_order = [
            "systemicIllness",  # assuming dropdown values 0–3
            "rectalPain",
            "soreThroat",
            "penileOedema",
            "oralLesions",
            "solitaryLesion",
            "swollenTonsils",
            "hivInfection",
            "sexuallyTransmittedInfection"
        ]

        # Create a feature vector
        features = []
        for key in feature_order:
            value = symptoms.get(key, 0)
            if isinstance(value, bool):  # checkbox fields
                features.append(int(value))
            else:
                features.append(value)

        X = np.array([features])  # 2D array for sklearn

        # Make prediction
        prediction = model.predict(X)[0]
        print(prediction)

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
