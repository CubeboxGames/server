function directions(text) {
  getElm("directions").innerHTML = text;
}
function getElm(id) {
  return document.getElementById(id);
}
function navtoggle() {
  if (
    getElm("navbartext").innerHTML ===
    '<i class="fas fa-bars"></i> CubeBox Games'
  ) {
    getElm(
      "navbartext"
    ).innerHTML = `<i class="fas fa-times"></i> CubeBox Games`;

    getElm("navbarinfo").innerHTML =
      `<hr class="navhr">` +
      `<a href="/"><i class="fas fa-gamepad"></i> Home</a>` +
      `<br><br>` +
      `<a href="/about.html"><i class="fas fa-question"></i> About</a>`;
  } else {
    getElm("navbartext").innerHTML =
      '<i class="fas fa-bars"></i> CubeBox Games';
    getElm("navbarinfo").innerHTML = "";
  }
}
