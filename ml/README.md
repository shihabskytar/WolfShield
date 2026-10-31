# ML pipeline (M2, not built in M0)

## Status

Skeleton only. No model, no training data, and no model card with metrics
exist yet. Nothing in this folder should be presented as a trained model.

## Intended pipeline (M2)

1. Prepare a labelled dataset (Bangla, English, Banglish; scam + benign),
   respecting each source dataset's license. See data/PROVENANCE.md.
2. Hold out a test split; never train on it.
3. Train a char n-gram TF-IDF + logistic regression baseline in Python.
4. Evaluate precision, recall, F1, and false-positive rate on a benign
   corpus (target: zero dangerous verdicts on benign messages).
5. Export to ONNX if it stays under 10 MB, otherwise to a plain JSON
   weights file with a TypeScript inference implementation.
6. Write `ml/MODEL_CARD.md` with metrics, limitations, and biases.

## Files in M0

- `train_baseline.py`: skeleton with TODOs, no training run.
- `requirements.txt`: pinned-by-M2 versions to be verified then.
