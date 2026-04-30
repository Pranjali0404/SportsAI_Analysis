import sqlite3
import hashlib
import os
import getpass

# Grab DB_PATH from environment (used by K8s PVC) or fallback to local repo directory
DB_NAME = os.environ.get("DB_PATH", "sportlytics.db")



def init_db():
    # Ensure database directory exists
    db_dir = os.path.dirname(os.path.abspath(DB_NAME))

    if db_dir and not os.path.exists(db_dir):
        try:
            os.makedirs(db_dir, exist_ok=True)
            print(f"Created database directory: {db_dir}")
        except Exception as e:
            print(f"Error creating directory {db_dir}: {e}")

    # Debug info
    print(f"Connecting to database: {DB_NAME}")

    if hasattr(os, "getuid"):
        print(f"Effective user ID: {os.getuid()}")
    else:
        print(f"Current user: {getpass.getuser()}")

    if os.path.exists(db_dir):
        print(f"Directory {db_dir} permissions: {oct(os.stat(db_dir).st_mode)}")

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """)

    # History table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        query TEXT NOT NULL,
        result TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def add_user(username, email, password):
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        hashed_pw = hash_password(password)
        cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (username, email, hashed_pw))
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        return False

def check_user(email, password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    hashed_pw = hash_password(password)
    cursor.execute("SELECT id, username FROM users WHERE email = ? AND password = ?", (email, hashed_pw))
    user = cursor.fetchone()
    conn.close()
    return user

def add_history(user_id, query, result):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO history (user_id, query, result) VALUES (?, ?, ?)", (user_id, query, result))
    conn.commit()
    conn.close()

def get_history(user_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT query, result, timestamp FROM history WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
    history = cursor.fetchall()
    conn.close()
    return history

def reset_password(email, new_password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    hashed_pw = hash_password(new_password)
    cursor.execute("UPDATE users SET password = ? WHERE email = ?", (hashed_pw, email))
    rows = cursor.rowcount
    conn.commit()
    conn.close()
    return rows > 0

init_db()
