import sqlite3
    
def main():
    conn = sqlite3.connect('chitanka.db')
    c = conn.cursor()
    c.execute('create table categories (name text)')
    c.execute('create table books (name text, downloaded boolean)')
    conn.commit()
    c.close()

if __name__ == '__main__':
    main()