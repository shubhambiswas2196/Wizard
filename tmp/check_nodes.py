import sqlite3

def check_campaign_node():
    conn = sqlite3.connect('c:/Users/Shubham/Desktop/Wizard/db.sqlite3')
    cursor = conn.cursor()
    cursor.execute("SELECT node_id, type, data FROM nodes_workflownode")
    nodes = cursor.fetchall()
    print(f"Total nodes: {len(nodes)}")
    for node_id, ntype, data in nodes:
        if "Campaign Started" in data:
            print(f"Found match: ID={node_id}, Type={ntype}, Data={data}")
    conn.close()

if __name__ == "__main__":
    check_campaign_node()
