import MySQLdb

try:
    db = MySQLdb.connect(host="127.0.0.1", user="root", passwd="")
    cursor = db.cursor()
    cursor.execute("DROP DATABASE IF EXISTS wizard_crm;")
    cursor.execute("CREATE DATABASE wizard_crm CHARACTER SET utf8 COLLATE utf8_general_ci;")
    db.close()
    print("Database 'wizard_crm' reset and created with utf8 charset.")
except Exception as e:
    print(f"Error: {e}")
