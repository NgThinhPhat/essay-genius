from .utils import load_data
import joblib
import os

if __name__ == "__main__":
    data_path = "toxicchecker/data/data.csv"
    output_dir = "toxicchecker/output"
    os.makedirs(output_dir, exist_ok=True)

    df, label_encoder = load_data(data_path)
    joblib.dump(label_encoder, os.path.join(output_dir, "label_encoder.joblib"))
    print("✅ Label encoder saved successfully.")
