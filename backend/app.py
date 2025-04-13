from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Temporary in-memory store (consider replacing with DB later)
journal_entries = []
mood_entries = []

@app.route("/save", methods=["POST"])
def save_journal():
    data = request.get_json()
    entry = data.get("entry")

    if not entry:
        return jsonify({"error": "Entry is required"}), 400

    record = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "entry": entry
    }
    journal_entries.append(record)
    return jsonify({"message": "Entry saved", "entry": record}), 200

@app.route("/history", methods=["GET"])
def get_journal_history():
    return jsonify(journal_entries)

@app.route("/mood", methods=["POST"])
def save_mood():
    data = request.get_json()
    mood = data.get("mood")

    if not mood:
        return jsonify({"error": "Mood is required"}), 400

    mood_entries.append({
        "date": datetime.now().strftime("%Y-%m-%d"),
        "mood": mood
    })
    return jsonify({"message": "Mood recorded"}), 200

@app.route("/moods", methods=["GET"])
def get_moods():
    return jsonify(mood_entries)

if __name__ == "__main__":
    app.run(debug=True)
