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
    child_process.exec('java -jar ../search/search.jar ../search/indexDirectory "' + req.body.q + '"', function(err, stdout, stderr) {
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
        queryArray = req.body.query.split(' '),
        index, post,
        query = 'SELECT * FROM queries WHERE `userid` = "??" AND `title` = "??" AND `token` = "?"';
   
    for (index = 0; index < queryArray.length; ++index) {
        connection.query(query, [userId, queryArray[index], bookTitle], function(err, results) {
            if (results.length == 0) {
                post  = {userid: userId, title: bookTitle, token: queryArray[index]};
                connection.query('INSERT INTO queries SET ?', post, function(err, result) {
                    // Neat!
                });
            }
        });
    } 
});

app.get('/relevant', function (req, res) {
    var userId = req.body.userId,
        bookTitle = req.body.book,
        queryArray = req.body.query.split(' '),
        query = 'SELECT * FROM queries WHERE `userid` = "??" AND `title` = "??" AND `token` = "?"',
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
