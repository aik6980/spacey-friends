var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var players = [];
var games = [];

app.set('view engine', 'jade');
app.set('views', __dirname + '/assets/views');

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res){
    res.render('index.jade');
});

app.get('/controller', function(req, res){
    if (players.length > 2) {
        res.send("Too many controllers already connected");
    } else {
        res.render('controller.jade');
    }
});

var port = process.env.PORT || 3000;

var server = server.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

io.on('connection', function (socket) {
    if (socket.handshake.headers.referer.endsWith("controller")) {
        players.push(socket);
        console.log("Controller connected");
        console.log(socket.id, "connected.", players.length, "connections.");
    } else {
        games.push(socket);
        console.log("Game connected:", socket.id);
    }

    socket.on('controller', function (data) {
        if (games.length > 0) {
            games[0].emit('instruction', data);
        }
    });

    socket.on('disconnect', function() {
        players.splice(players.indexOf(socket), 1);
        console.log("Clients connected:", players.length)
    });
});
