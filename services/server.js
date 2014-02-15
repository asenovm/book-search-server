var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'robco',
    database : 'booksearch'
});
connection.connect();

var express = require('express'),
    app = express(),
    child_process = require('child_process'),
    mysql      = require('mysql'),
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'robco',
        database : 'booksearch'
    });

connection.connect();
app.use(express.bodyParser());

app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:9000");
   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
   res.header('Access-Control-Allow-Credentials', true);
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   next();
});

app.post('/search', function (req, res) {
    console.log(req.body.q);
    var tokens = req.body.q.split(' ');
    var userId = req.body.userId;
    var callbackCount = 0;
    var result;
    
    var markedBooks = [];

    for (index = 0; index < tokens.length; ++index) {
        var q = connection.query('SELECT DISTINCT title FROM queries WHERE `userid` = ? AND `token` = ?', [userId, tokens[index]], function(err, result) {
        ++callbackCount;
        markedBooks = markedBooks.concat(result);
        if(callbackCount === tokens.length) {
            child_process.exec('java -jar ../search/search.jar ../search/indexDirectory "' + req.body.q + '"', function(err, stdout, stderr) {
            if(err) {
                res.send(500); 
            } else {
                markedBooks = markedBooks.map(function (item) {
                    return item.title;
                });

                result = JSON.parse(stdout);
                result.books.forEach(function (item) {
                    if(markedBooks.indexOf(item.title) >= 0) {
                        item.relevance = Math.min(item.relevance * 1.2, 1);
                    }
                });

                result.books.sort(function (first, second) {
                    return second.relevance - first.relevance;                
                });

                res.json(result);
            }
        });
        }
        });
        
        console.log(q.sql);    
    } 
    
    
});

function callbackInsert(post) {
    return function(err, results) {
            console.log(results.length);
            console.log(results)
            if (results.length == 0) {
                var q = connection.query('INSERT INTO queries SET ?', post, function(err, result) {
                    // Neat!
                });
                console.log(q.sql);
            }
           }
}

app.post('/relevant', function (req, res) {
    var userId = req.body.userId,
        bookTitle = req.body.book.substring(0, 64),
        queryArray = req.body.query.split(' ');
   
    console.log(queryArray);
    
    for (index = 0; index < queryArray.length; ++index) {
        var q = connection.query('SELECT * FROM queries WHERE `userid` = ? AND `title` = ? AND `token` = ?', [userId, queryArray[index], bookTitle], callbackInsert({userid: userId, title: bookTitle, token: queryArray[index]}));
        
        console.log(q.sql);    
    } 
});

app.get('/relevant', function (req, res) {
    var userId = req.body.userId,
        bookTitle = req.body.book,
        queryArray = req.body.query.split(' '),
        query = 'SELECT * FROM queries WHERE `userid` = ? AND `title` = ? AND `token` = ?',
        callbackCount = 0;
   
    for (index = 0; index < queryArray.length; ++index) {
        connection.query(query, [userId, queryArray[index], bookTitle], function(err, results) {
            ++callbackCount;
            if(callbackCount === queryArray.length - 1 && results.length) {
                res.json({'marked': 'true'});
            } else if (!results.length) {
                res.json({'marked':'false'});
                return;
            }
        });
    } 
});

app.listen(8080);
