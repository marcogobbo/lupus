// Carico file audio
var sun = new Audio('./assets/sounds/sun.mp3');
var moon = new Audio('./assets/sounds/moon.mp3');

// Imposto timer da 15 secondi
var timer = 15;
var isDay = true;
var min = Math.floor(timer/60);
var sec = timer-min*60;

// Per non ripetere 30 volte il calcolo
function computeTime() {
  min = Math.floor(timer/60);
  sec = timer-min*60;
}


// Timer
function onTimer() {
    // Inserisce timer nel h1 con id Timer
    if (sec < 10) {
      document.getElementById("Timer").innerHTML = min + ":0" + sec;
    }
    else {
      document.getElementById("Timer").innerHTML = min + ":" + sec;
    }

    timer--;
    computeTime()
    console.log(timer)
    // Se il timer è a zero eseguo la transizione
    if (timer < 0) {
        if (isDay) {

            // Faccio transizione giorno -> notte cambiando posizione sole e luna
            document.getElementById("Sun").style = "top: 50%;";
            document.getElementById("Moon").style = "top: 10%;";

            // Cambio sfondo
            document.body.style = "background: #2C3E50;"
            // Avvio suono lupo
            //moon.play();
        }
        else {

            // Faccio transizione notte -> giorno cambiando posizione luna e sole
            document.getElementById("Moon").style = "top: 50%;";
            document.getElementById("Sun").style = "top: 10%;";

            // Cambio sfondo
            document.body.style = "background: #00B4FF;";

            // Avvio suono
            //sun.play();
        }
        // Cambio la giornata
        isDay = !isDay;
        // Resetto il timer
        timer = 15;
        computeTime()
        setTimeout(onTimer, 1000);
    }
    // Decremento di un secondo
    else {
        setTimeout(onTimer, 1000);
    }
}

// Controllo che il DOM sia stato caricato per porter agire sugli elementi della pagina
window.onload = onTimer;
