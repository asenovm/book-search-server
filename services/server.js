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
        bookTitle = req.body.book;

    res.send(200);
});

app.listen(8080);
