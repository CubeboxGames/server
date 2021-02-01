var playerdata = {};
function joingame() {
  getElm("connect").style.display = "none";
  directions("Connecting to game!");
  socket.emit("game.join", {
    id: getElm("gameid").value,
    username: getElm("playerusername").value,
  });
}
socket.on("error.invalidid", () => {
  getElm("connect").style.display = "";
  directions("Invalid ID provided! The game might have ended.");
});
socket.on("error.full", () => {
  getElm("connect").style.display = "";
  directions("The game you tried to join is full! :(");
});
socket.on("game.joined", (json) => {
  directions(
    "You have joined the game! <br>Look at the direction on the screen"
  );
});
