from toxicchecker import train_eval, infer


def run_training():
    print("Starting model training...")
    train_eval.train_model()
    print("Model training completed.")


def run_inference(text):
    print("Performing inference on:", text)
    label, confidence = infer.predict(text)
    print(f"Predicted toxicity level: {label}")
    print(f"Confidence scores: {confidence}")


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage:")
        print("  python checker.py train")
        print("  python checker.py infer <text>")
        sys.exit(1)

    command = sys.argv[1]

    if command == "train":
        run_training()
    elif command == "infer" and len(sys.argv) > 2:
        run_inference(sys.argv[2])
    else:
        print("Invalid command or missing argument.")
