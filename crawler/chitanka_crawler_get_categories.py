import requests
import time
import os
import sqlite3

def main():
    conn = sqlite3.connect('chitanka.db')
    c = conn.cursor()
    r = requests.get('http://www.chitanka.info/books')
    ind = 0
    ind = r.text.find('books/category/', ind)
    while ind != -1:
        ind = ind + 15
        print r.text[ind:r.text.find('"', ind)]
        c.execute("insert into categories values ('"+r.text[ind:r.text.find('"', ind)]+"')")
        ind = r.text.find('books/category/', ind)
    conn.commit()
    c.close()

if __name__ == '__main__':
    main()