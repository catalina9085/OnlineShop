import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Furnicazaur90",
        database="chat_db"
    )

def get_products():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, description FROM product")
    rows = cursor.fetchall()
    conn.close()
    return rows

def get_user_clicks(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT product_id FROM product_click WHERE user_id = %s AND clicked_at > NOW() - INTERVAL 30 DAY",
        (user_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return rows
