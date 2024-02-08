from datetime import datetime
import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, request, redirect, jsonify

#CREATE_LINKS_TABLE = ("CREATE TABLE IF NOT EXISTS links (id SERIAL PRIMARY KEY, link TEXT, shortcode TEXT, dateCreated TIMESTAMP);") #Only needs to be run the first time
INSERT_LINK_RETURN_ID = ("INSERT INTO links (link, shortcode, dateCreated) VALUES (%s, %s, %s) RETURNING id;")
GET_LAST_LINKS = ("SELECT * FROM links ORDER BY id DESC LIMIT 10;")
SELECT_LINK_BY_SHORTCODE = ("SELECT link FROM links WHERE shortcode = %s;")

load_dotenv()

app = Flask(__name__)
url = os.environ.get("DATABASE_URL")
connection = psycopg2.connect(url)

@app.post("/api/link")
def create_link():
    data = request.get_json()
    link = data["link"]
    shortcode = data["shortcode"]
    date = datetime.now()
    with connection:
        with connection.cursor() as cursor:
            #cursor.execute(CREATE_LINKS_TABLE) // Only needs to run the first time
            cursor.execute(INSERT_LINK_RETURN_ID, (link, shortcode, date))
            link_id = cursor.fetchone()[0]
    return {"id": link_id, "shortcode": shortcode, "message": f"Link {link} shortened."}, 201

@app.get("/api/links")
def get_links():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_LAST_LINKS)
            links = cursor.fetchall()
            link_list = []
            for link in links:
                obj = {"id": link[0], "link": link[1], "shortcode": link[2], "created": link[3]}
                link_list.append(obj)
    return link_list

@app.get("/api/link/<shortcode>")
def redirect_to(shortcode):
    print(shortcode)
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SELECT_LINK_BY_SHORTCODE, (shortcode,))
            redirect_link = cursor.fetchone()[0]
    return redirect(redirect_link)