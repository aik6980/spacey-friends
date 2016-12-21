var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var games = {};

app.set('view engine', 'jade');
app.set('views', __dirname + '/assets/views');

app.use(bodyParser());
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index.jade');
});

app.post('/', function(req, res) {
    if (req.body.game_name) {
        var game_name = req.body.game_name.trim().toLowerCase();
    }

    if (req.body.player_name) {
        var player_name = req.body.player_name.trim().toLowerCase();
    }

    if (req.body.requestingFor === "newGame") {
        console.log(req.body);
        var game = {
            'game_name': req.body.game_name,
            'players': []
        };
        games[game_name] = {players: {}};
        res.render('game.jade', {game_name: game_name});

    } else if (req.body.requestingFor === "controller") {
        if (!(games.hasOwnProperty(game_name))) {
            res.render('index.jade', {error: "No game named " + game_name});
        } else {
            if (games[game_name].players.hasOwnProperty(player_name)) {
                res.render('index.jade', {error: "Name already in use!"});
            } else {

                games[game_name].players[player_name] = {};
                res.render('controller.jade', {game_name: game_name, player_name: player_name});
            }
        }
    }
});

var port = process.env.PORT || 3000;

var server = server.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

io.on('connection', function (socket) {
    socket.on('gameConnect', function (data) {
        games[data.game_name].socket = socket;
    });

    socket.on('controlGame', function (data) {
        games[data.game_name].players[data.player_name].socket = socket;
        games[data.game_name].socket.emit('newShip', {player_name: data.player_name});
    });

    socket.on('controller', function (data) {
        if ( !(games.hasOwnProperty(data.game_name)) || !(games[data.game_name].hasOwnProperty("socket")) ) {
            socket.emit('redirect', {location: "home"});
        } else {
            games[data.game_name].socket.volatile.emit('instruction', data);
        }
    });

    socket.on('disconnect', function() {
        console.log("Client disconnected")
    });
});
