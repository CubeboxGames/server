/**
 * @author Blocks_n_more @ CubeboxGames
 * @description Game server for all Cubebox games and services
 */

const config = require("./config.json");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const debug = true;
var data = { hosts: new Map(), players: new Map() };

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

app.get("/", (req, res) => {
  res.redirect(404, "https://cbjoin.github.io/");
});

io.on("connected", async (socket) => {
  if (debug) console.log("DEBUG: User connected to server");
  socket.on("createGame", () => {
    let code = generateGameCode();
    if (code === "MAX_GAMES") return socket.emit("gameError", "MAX_GAMES");
    data.hosts.set(code, { players: [], socket: socket });
    socket.emit("createdGame", code);
  });
  socket.on("joinGame", (code, username) =>{
    
  })
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
