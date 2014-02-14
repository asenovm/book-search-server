var express = require('express'),
    app = express();

app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:9000");
   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
   res.header('Access-Control-Allow-Credentials', true);
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   next();
});

app.get('/search', function (req, res) {
    res.json({
        "books": [
            {
                "title": "Sherlock Holmes",
                "image": "http://example.com/image.png",
                "relevance": "0.77"
            }, {
                "title": "Withering Heights",
                "image": "http://example.com/image2.png",
                "relevance": "0.54"
            }, {
                "title": "The Picture of Dorian Gray",
                "image": "http://example.com/image3.png",
                "relevance": "0.36"
            }   
        ]
    });
    res.send(200);
});

app.listen(8080);
