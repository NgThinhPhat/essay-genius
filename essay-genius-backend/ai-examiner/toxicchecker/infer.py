from transformers import BertTokenizer, BertForSequenceClassification
import torch
import os
from .utils import get_label_encoder


def predict(text):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "output", "bert_toxic")

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model directory not found: {model_path}. Please train the model first."
        )

    tokenizer = BertTokenizer.from_pretrained(model_path)
    model = BertForSequenceClassification.from_pretrained(model_path)

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.nn.functional.softmax(logits, dim=1).squeeze()
        label_encoder = get_label_encoder()
        predicted_index = torch.argmax(outputs.logits, dim=1).item()
        label_name = label_encoder.inverse_transform([predicted_index])[0]
        confidence = (
            torch.nn.functional.softmax(outputs.logits, dim=1).detach().numpy()[0]
        )

        return label_name, confidence
