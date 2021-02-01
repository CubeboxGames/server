const { Socket } = require("socket.io");

var gamedata = new Map();
var playerdata = new Map();
const io = require("socket.io")();
io.listen(3000);

io.on("connection", async (socket) => {
  var game = {
    id: null, // Also used as the pin
    type: null, // the type of game (name)
    players: [],
  };
  socket.on("host", async (json) => {
    game.id = generateGameID();
    game.type = json.type;
    gamedata.set(game.id, game);
    socket.emit("host", game);
  });
});

function generateUserID() {
  let id = getRandomInt(1, 9999);
  if (playerdata.has(id)) return generateUserID();
  else return id;
}
function generateGameID() {
  let id = getRandomInt(1, 9999);
  if (gamedata.has(id)) return generateGameID();
  else return id;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
