// Modify these settings if you have lots of games or players
const settings = {
  game: {
    minpin: 1000, // The minumum value of the pin, Default: 1000
    maxpin: 9999, // The maximum value of the pin, Default: 9999
    maxplayers: 10, // Maximum amount of players in a game, Default: 10
  },
  player: {
    minid: 1000, // The minimum value of a player's id, Default: 1000
    maxid: 9999, // The maximum value of a player's id, Default: 9999
  },
};

// Source
var gamedata = new Map();
var playerdata = new Map();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
server.listen(()=>{
  console.log("Started server")
});
app.use(express.static("./public/"))
io.on("connection", async (socket) => {
  console.log("A user connected");
  var game = {
    host: {
      type: null,
      players: [],
    },
    socket: null,
    id: null,
    user: {
      username: null,
      userid: null,
      gameid: null,
    },
  };

  // Main player joining stuff
  socket.on("game.host", async (json) => {
    // Creates a game session and saves the data
    game.id = generateGameID();
    game.host.type = json.type;
    game.socket = socket;
    gamedata.set(game.id, game);
    socket.emit("game.createdgame", game);
  });

  socket.on("game.join", (json) => {
    console.log(json)
    // Player joining mechanics
    if (!gamedata.has(json.id)) return socket.emit("error.invalidid");
    if (gamedata.get(json.id).host.players.length >= settings.game.maxplayers)
      return socket.emit("error.full"); // May be removed if audience is added
    game.user.gameid = json.id;
    game.user.userid = generateUserID();
    game.user.username = json.username;
    playerdata.set(game.user.userid, game);
    io.emit("game.playerjoin", {userdata: game.user});
    socket.emit("game.joined", {userdata: game.user});
  });

  socket.on("disconnect", () => {
    // Host/player disconnect system
    // Host disconnect
    if (game.id) {
      io.emit("game.closed", { id: game.id });
      gamedata.delete(game.id); // Make sure to delete the player id so that theres no issues with lots of games
    }
    // Player disconnect
    if (game.user.id) {
      io.emit("game.playerleave", {
        id: game.user.id,
        username: game.user.username,
      });
      playerdata.delete(game.user.id); // Make sure to delete the player id so that theres no issues with lots of players
    }
  });

  socket.on("game.pause", (json) => {
    // This is used as a "pause" menu. When the host is showing instructions or something
    io.emit("game.pause", { id: json.id, img: json.img });
  });

  socket.on("game.unpause", (json) => {
    // Disable the pause thing, althought i dont see really who would use it
    io.emit("game.unpause", { id: json.id });
  });
});

// Generates an ID for the user
function generateUserID() {
  let id = getRandomInt(settings.player.minid, settings.player.maxid);
  if (playerdata.has(id)) return generateUserID();
  else return id;
}

// Generates an ID for the game
function generateGameID() {
  let id = getRandomInt(settings.game.minpin, settings.game.maxpin);
  if (gamedata.has(id)) return generateGameID();
  else return id;
}
// Random integer (doy)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
