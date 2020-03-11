// Carico file audio
var sun = new Audio('./assets/sounds/sun.mp3');
var moon = new Audio('./assets/sounds/moon.mp3');

// Imposto timer da 15 secondi
var timer = 15;
var day = true;

// Timer
function onTimer() {
    // Inserisce timer nel h1 con id Timer
    // document.getElementById("Timer").innerHTML = timer;
    timer--;
    console.log(timer)
    // Se il timer è a zero eseguo la transizione
    if (timer < 0) {
        if (day) {

            // Faccio transizione giorno -> notte cambiando posizione sole e luna
            document.getElementById("Sun").style = "top: 50%;";
            document.getElementById("Moon").style = "top: 10%;";

            // Cambio sfondo
            document.body.style = "background: #2C3E50;"
            // Avvio suono lupo
            // moon.play();
        }
        else {
            document.getElementById("Moon").style = "top: 50%;";
            document.getElementById("Sun").style = "top: 10%;";
            document.body.style = "background: #00B4FF;"
        }
        day = !day;
        timer = 15;
        setTimeout(onTimer, 1000);
    }
    // Decremento di un secondo
    else {
        setTimeout(onTimer, 1000);
    }
}

// Controllo che il DOM sia stato caricato per porter agire sugli elementi della pagina
window.onload = onTimer;
