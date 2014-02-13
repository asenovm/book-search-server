import requests
import time
import os
import sqlite3

def init_make_request():
    global conn
    global last_hour
    global last_minute
    global queries_for_last_minute
    global queries_for_last_hour
    
    last_hour = time.clock()
    last_minute = time.clock()
    queries_for_last_minute = 0
    queries_for_last_hour = 0
    conn = sqlite3.connect('chitanka.db')

def make_request(req):
    global last_minute
    global last_hour
    global queries_for_last_minute
    global queries_for_last_hour

    time.sleep(2)
    while queries_for_last_hour > 175:
        delta = time.clock() - last_hour
        if delta < 3600:
            print "queries limit for hour reached, %d minutes remaining" % int(60-delta/60)
            time.sleep(60)
        else:
            last_hour = time.clock()
            queries_for_last_hour = 0
            
    while queries_for_last_minute > 18:
        delta = time.clock() - last_hour
        if delta < 60:
            print "queries limit for minute reached, %d seconds remaining" % int(60-delta)
            time.sleep(10)
        else:
            last_minute = time.clock()
            queries_for_last_minute = 0
    
    queries_for_last_hour += 1
    queries_for_last_minute += 1
    
    proxy = {'http': 'http://93.123.45.23:8008'}
    
    r = requests.get(req, proxies = proxy)
    #r = requests.get(req)
    
    return r

def find_books_in_text(text):
    global conn
    #print text
    c = conn.cursor()
    
    ind = 0
    ind = text.find('<span>epub</span></a></li>', ind)
    while ind != -1:
        ind = ind + 26
        ind = text.find('"', ind)
        ind = ind + 1
        book_name = text[ind:text.find('"', ind)]
        #print book_name
        c.execute('select * from books where name="%s"' % book_name)
        if len(c.fetchall()) == 0:
            c.execute('insert into books values ("%s", 0)' % book_name)
            conn.commit()
            print 'new book found: %s' % book_name
        ind = text.find('<span>epub</span></a></li>', ind)
        
    c.close()
    
def main():
    global conn
    
    c = conn.cursor()
    c.execute('select * from categories')

    cats = c.fetchall()
    flag = True
    for category in cats:
        print 'getting books in %s' % str(category[0])
        if str(category[0]) == 'savremenni-romani-i-povesti':
            flag = False
        
        if flag:
            continue
        
        tries = 5
        while tries:
            try:
                --tries
                r = make_request('http://www.chitanka.info/books/category/'+category[0])
                break
            except:
                print "exception"
                time.sleep(30)
                
        find_books_in_text(r.text)
        
        pagination = r.text.find('<ul class="pagination">')
        if pagination != -1:
            ind = r.text.find('<li class="next">')
            while r.text[ind] != '"':
                ind = ind - 1
            ind = ind + 2
            second_ind = ind + 1
            while r.text[second_ind] != '<':
                second_ind = second_ind + 1
            pages_count = int(r.text[ind:second_ind])
            for i in range(1, pages_count):
                print 'category page %d' % (i+1)
                tries = 5
                while tries:
                    try:
                        --tries
                        r = make_request('http://www.chitanka.info/books/category/'+category[0]+'.html/'+str(i+1))
                        break
                    except:
                        print "except"
                        time.sleep(30)
                        
                find_books_in_text(r.text)
                
    c.close()

if __name__ == '__main__':
    init_make_request()
    main()