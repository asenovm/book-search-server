var express = require('express'),
    app = express(),
    child_process = require('child_process');

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
    child_process.exec('java -jar ../search/search.jar ../search/books ' + req.body.q, function(err, stdout, stderr) {
        if(err) {
            res.send(500); 
        } else {
            res.send(stdout);
        }
    });
});

app.post('/relevant', function (req, res) {
    var userId = req.body.userId,
        bookTitle = req.body.book,
        queryArray = req.body.query.split(' ');
   
    console.log(queryArray);

    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'robco',
        database : 'booksearch'
    });
    
    connection.connect();
    for (index = 0; index < queryArray.length; ++index) {
        var q = connection.query('SELECT * FROM queries WHERE `userid` = "??" AND `title` = "??" AND `token` = "?"', [userId, queryArray[index], bookTitle], function(err, results) {
            if (results.length == 0) {
                var post  = {userid: userId, title: bookTitle, token: queryArray[index]};
                var q = connection.query('INSERT INTO queries SET ?', post, function(err, result) {
                    // Neat!
                });
                console.log(q.sql);
            }
        });
        
        console.log(q.sql);    
    } 

    res.send(200);
});

app.get('/relevant', function (req, res) {
    var userId = req.body.userId,
        bookTitle = req.body.book,
        queryArray = req.body.query.split(' ');
   
//    console.log(queryArray);

    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'robco',
        database : 'booksearch'
    });
    
    connection.connect();
    for (index = 0; index < queryArray.length; ++index) {
        var q = connection.query('SELECT * FROM queries WHERE `userid` = "??" AND `title` = "??" AND `token` = "?"', [userId, queryArray[index], bookTitle], function(err, results) {
            if (results.length) {
                res.json({'marked':'true'});
                return;
            }
        });
        
        console.log(q.sql);    
    } 

    res.json({'marked':'false'});
});

app.listen(8080);
