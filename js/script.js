// Carico file audio
var sun = new Audio('./sound/sun.mp3');
var moon = new Audio('./sound/moon.mp3');

// Imposto timer da 15 secondi
var timer = 15;

// Timer
function onTimer() {
  // Inserisce timer nel h1 con id Timer
  document.getElementById("Timer").innerHTML = timer;
  timer--;
  // Se il timer è a zero eseguo la transizione
  if (timer < 0) {
    // Faccio transizione giorno -> notte cambiando posizione sole e luna
    document.getElementById("Sun").style = "top: 50%;";
    document.getElementById("Moon").style = "top: 10%;";
    // Cambio sfondo
    document.body.style = "background: #2C3E50;"
    // Avvio suono lupo
    moon.play();
  }
  // Decremento di un secondo
  else {
    setTimeout(onTimer, 1000);
  }
}

// Controllo che il DOM sia stato caricato per porter agire sugli elementi della pagina
window.onload = onTimer;
