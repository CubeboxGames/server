/**
 * @author Blocks_n_more @ CubeboxGames
 * @description Game server for all Cubebox games and services
 */

const config = require("./config.json");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const debug = config.debug;
var data = { hosts: new Map() };

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
    ],
    methods: ["GET", "POST"],
  },
});

server.listen(3000, () => {
  console.log("Starting Game server");
  console.log("Created by Blocks_n_more @ CubeboxGames");
});

io.on("connection", async (socket) => {
  if (debug) console.log("DEBUG: User connected to server");
  socket.on("createGame", (type, maxplayers) => {
    let code = generateGameCode();
    if (code === "MAX_GAMES") return socket.emit("gameError", "MAX_GAMES");
    data.hosts.set(code, {
      players: [],
      socket: socket,
      max: maxplayers,
      id: socket.id,
      type: type,
      code:code
    });
    if (debug) console.log("DEBUG: Game created with id "+code+"!");
    socket.emit("createdGame", code, socket.id);
  });

  socket.on("joinGame", (code, username) => {
    if (!data.hosts.has(code)) return socket.emit("gameError", "UNKNOWN_GAME");
    if (data.hosts.get(code).max >= data.hosts.get(code).players.length)
      return socket.emit("gameError", "FULL_GAME");
    if (debug) console.log("DEBUG: Player joined game!");
    socket.emit("joinedGame", type);
    data.hosts
      .get(code)
      .players.push({ username: username, code: code, socket: socket, id:socket.id });
    data.hosts.get(code).socket.emit("joinedGame", username, socket.id);
  });

  socket.on("sendToPlayer", (gamecode, player, event, content) => {
    if (!data.hosts.has(gamecode))
      return socket.emit("gameError", "UNKNOWN_GAME");
    let user = data.hosts
      .get(gamecode)
      .players.filter((p) => p.id === player)[0];
    if (!user) return socket.emit("gameError", "UNKNOWN_USER");
    user.socket.emit(event, content);
  });

  socket.on("sendToAllPlayers", (gamecode, event, content) => {
    if (!data.hosts.has(gamecode))
      return socket.emit("gameError", "UNKNOWN_GAME");
    data.hosts.get(gamecode).players.forEach((p) => {
      p.emit(event, content);
    });
  });
  socket.on("sendToHost", (gamecode, event, content) => {
    if (!data.hosts.get(gamecode).players.filter((p) => p.id === socket.id)[0])
      return socket.emit("gameError", "INVALID_CALL");
    data.hosts.get(gamecode).socket.emit(event, content);
  });
  socket.on("disconnect", () => {
    if(debug) console.log("A user disconnected! Socket id:", socket.id)
    data.hosts.forEach(game=>{
      if(game.id === socket.id){
        if(debug) console.log("Host of game "+game.code+" has quit! Closing the game!");
        data.hosts.delete(game.code);
      }
      if(game.players.filter(f=>f.id === socket.id)[0]){
        game.players = game.players.filter(f=>f.id !== socket.id)
        if(debug) console.log("Player in game "+game.id+" has quit!");
      }
    })
  });
});

/**
 * @description Generates a room code
 * @returns int || String
 */
function generateGameCode() {
  if (data.hosts.size >= config.maxgames) return "MAX_GAMES";
  let code = getRandomInt(config.min, config.max);
  if (data.hosts.has(code)) return generateGameCode();
  else return code;
}

/**
 *
 * @param {int} min
 * @param {int} max
 * @returns int
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
