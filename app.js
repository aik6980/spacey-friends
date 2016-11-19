var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var players = [];
var games = [];

app.set('view engine', 'jade');
app.set('views', __dirname + '/assets/views');

app.use(bodyParser());
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
    res.render('index.jade');
});

app.post('/', function(req, res) {
    var game_name = req.body.game_name;
    var player_name = req.body.player_name;

    if (req.body.requestingFor === "newGame") {
        console.log(req.body);
        var game = {
            'game_name': req.body.game_name,
            'players': []
        };
        games.push(game);
        res.render('game.jade', {game_name: game_name});

    } else if (req.body.requestingFor === "controller") {
        var game_index = searchArrayOfObjectsByProperty("game_name", game_name, games);
        if (!(game_index)) {
            res.render('index.jade', {error: "No game named " + game_name});
        } else {
            var player = {
                'player_name': player_name
            };
            games[game_index].players.push(player);
            res.render('controller.jade', {game_name: game_name, player_name: player_name});
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
    if (socket.handshake.headers.referer.endsWith("controller")) {
        players.push(socket);
        console.log("Controller connected");
        console.log(socket.id, "connected.", players.length, "connections.");
    } else {
        games.push(socket);
        console.log("Game connected:", socket.id);
    }

    socket.on('gameConnect', function (data) {
        var gameIndex = searchArrayOfObjectsByProperty("game_name", data.game_name, games);
        games[gameIndex].socket = socket;
    });

    socket.on('controlGame', function (data) {
        var gameIndex = searchArrayOfObjectsByProperty("game_name", data.game_name, games);
        var playerIndex = searchArrayOfObjectsByProperty("player_name", data.player_name, games[gameIndex].players);
        games[gameIndex].players[playerIndex].socket = socket;
    });

    socket.on('controller', function (data) {
        var gameIndex = searchArrayOfObjectsByProperty("game_name", data.game_name, games);
        if (games.length > 0) {
            games[gameIndex].socket.emit('instruction', data);
        }
    });

    socket.on('disconnect', function() {
        players.splice(players.indexOf(socket), 1);
        console.log("Clients connected:", players.length)
    });
});

/**
 * Searches an array of objects for a property within the objects
 *
 * @param {String} propertyToCheck The property that you are looking to match to.
 * @param {String} dataToFind The value to search for within the supplied property.
 * @param {Array} arrayToSearch Name of the array to search.
 */
function searchArrayOfObjectsByProperty(propertyToCheck, dataToFind, arrayToSearch) {
    for (var i=0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][propertyToCheck] == dataToFind) return i;
    }
    return false;
}
