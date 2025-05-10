from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    Trainer,
    TrainingArguments,
)
from sklearn.model_selection import train_test_split
from toxicchecker.utils import load_data, ToxicDataset
import numpy as np
from sklearn.metrics import accuracy_score, f1_score
import os


def train_model():
    # Định nghĩa đường dẫn
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "data", "data.csv")
    output_dir = os.path.join(base_dir, "output", "bert_toxic")
    os.makedirs(output_dir, exist_ok=True)

    # Load data
    df, label_encoder = load_data(data_path)
    texts = df["text"].tolist()
    labels = df["label"].tolist()
    train_texts, val_texts, train_labels, val_labels = train_test_split(
        texts, labels, test_size=0.2, random_state=42
    )

    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    train_encodings = tokenizer(train_texts, truncation=True, padding=True)
    val_encodings = tokenizer(val_texts, truncation=True, padding=True)

    train_dataset = ToxicDataset(train_encodings, train_labels)
    val_dataset = ToxicDataset(val_encodings, val_labels)

    model = BertForSequenceClassification.from_pretrained(
        "bert-base-uncased", num_labels=len(set(labels))
    )

    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        preds = np.argmax(logits, axis=-1)
        return {
            "accuracy": accuracy_score(labels, preds),
            "f1": f1_score(labels, preds, average="weighted"),
        }

    training_args = TrainingArguments(
        output_dir="./results",
        save_strategy="epoch",
        logging_dir="./logs",
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        num_train_epochs=3,
        weight_decay=0.01,
        logging_steps=10,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        tokenizer=tokenizer,
        compute_metrics=compute_metrics,
    )

    trainer.train()
    trainer.save_model(output_dir)
