import pandas as pd
from torch.utils.data import Dataset
import torch
from sklearn.preprocessing import LabelEncoder
import joblib
import os


def load_data(file_path):
    df = pd.read_csv(file_path)
    le = LabelEncoder()
    df["label"] = le.fit_transform(df["toxicity_level"])
    return df, le


def get_label_encoder(path="toxicchecker/output/label_encoder.joblib"):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Label encoder not found at {path}")
    return joblib.load(path)


class ToxicDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return {
            "input_ids": torch.tensor(self.encodings["input_ids"][idx]),
            "attention_mask": torch.tensor(self.encodings["attention_mask"][idx]),
            "labels": torch.tensor(self.labels[idx]),
        }

