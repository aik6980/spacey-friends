var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/assets/views');

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res){
    res.render('index.jade');
});

app.get('/controller', function(req, res){
    res.render('controller.jade');
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});