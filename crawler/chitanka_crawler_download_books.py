import requests
import time
import os
import sqlite3

from chitanka_crawler_get_books_list import init_make_request, make_request

def download_book(book_name):
    tries = 5
    while tries:
        try:
            tries -= 1
            r = requests.get('http://chitanka.info'+book_name)
            break
        except:
            print "exception"
            time.sleep(30)

    if not tries:
        return False
    
    with open('tmp.zip', 'wb') as f:
        for chunk in r.iter_content(chunk_size=1024): 
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)
                f.flush()
    os.system("7za.exe -obooks x tmp.zip")
    
    return True

def main():
    global conn
    
    c = conn.cursor()
    
    c.execute('select count(*) from books')
    books_count = c.fetchone()[0]
    
    c.execute('select count(*) from books where downloaded = 0')
    new_books_count = c.fetchone()[0]
    
    c.execute('select name from books where downloaded = 0')
    books = c.fetchall()
    
    for book in books:
        print '%d/%d downloaded, current: %s' % ((books_count - new_books_count), books_count, str(book[0]))
        if download_book(str(book[0])):
            c.execute('update books set downloaded = 1 where name = "%s"' % str(book[0]))
            conn.commit()
            new_books_count -= 1
                
    c.close()

if __name__ == '__main__':
    init_make_request()
    global conn
    main()