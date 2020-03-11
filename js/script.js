var sun = new Audio('./sound/sun.mp3');
var moon = new Audio('./sound/moon.mp3');
var timer = 15;
function onTimer() {
  document.getElementById("Timer").innerHTML = timer;
  timer--;
  if (timer < 0) {
    document.getElementById("Sun").style = "top: 50%;";
    document.getElementById("Moon").style = "top: 10%;";
    document.body.style = "background: #2C3E50;"
    moon.play();
  }
  else {
    setTimeout(onTimer, 1000);
  }
}


//test commit
window.onload = onTimer;
