var express = require('express'),
    app = express();

app.get('/search', function (req, res) {
    //TODO start java app using lucene with req.query.q
    res.send(200);
});

app.listen(8080);
