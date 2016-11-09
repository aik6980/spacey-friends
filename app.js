var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var players = [];

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
    players.push(socket);
    console.log(socket.id, "connected.", players.length, "connections.");
    socket.on('controller', function (data) {
        io.sockets.emit('instruction', data);
    });

    socket.on('disconnect', function() {
        players.splice(players.indexOf(socket), 1);
        console.log("Clients connected:", players.length)
    });
});