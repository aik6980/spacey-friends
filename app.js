var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

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

var server = server.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});