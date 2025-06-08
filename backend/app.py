import os
import sqlite3
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS  # <-- Add this line

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # <-- Here

# ...existing code...
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'images')
DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'animals.db')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# ...existing code...

# Ensure folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# --- Initialize DB and table ---
def init_db():
    with sqlite3.connect(DATABASE) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS animals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                image_filename TEXT NOT NULL
            )
        ''')
        conn.commit()

# --- Auto-insert images from folder ---
def insert_animals_from_folder():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        for filename in os.listdir(UPLOAD_FOLDER):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                name = os.path.splitext(filename)[0]
                # Check if already exists
                cursor.execute("SELECT 1 FROM animals WHERE image_filename = ?", (filename,))
                if not cursor.fetchone():
                    cursor.execute("INSERT INTO animals (name, image_filename) VALUES (?, ?)", (name, filename))
        conn.commit()

# --- API to list all animals ---
@app.route('/api/animals', methods=['GET'])
def get_animals():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, image_filename FROM animals")
        rows = cursor.fetchall()
        animals = [
            {
                'id': row[0],
                'name': row[1],
                'image_url': f"/images/{row[2]}"
            }
            for row in rows
        ]
        return jsonify(animals)

# --- Serve image files ---
@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ...existing code...

@app.route('/')
def index():
    return "Welcome to the Animal API!"

# ...existing code...

# --- App Start ---
if __name__ == '__main__':
    init_db()
    insert_animals_from_folder()
    app.run(debug=True)
