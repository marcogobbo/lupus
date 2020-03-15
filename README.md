# Lupus

Created by **iSolitiInQuarantena**

*14.03*
Luca:
- aggiunto "routing", una sottospecie per lo meno
- aggiornata pagina lobby
- sistemato server.js in modo da servire tutte le pagine contenute in ```/client```

*15.03 h01:20*
Luca
- update grafico di marco, aggiunto in index, lobby, game (ancora statica)
- in LOBBY viene visualizzata la lista di persone con avatar
- aggiunta selezione ruoli AUTOMATICA in base a numero di giocatori
- non si può giocare in meno di 8
- aggiunto controllo su username
    - se esiste non viene aggiunto e appare ERRORE
    - **TODO: aggiungere controllo nome != socket**
- ho provato a costruire la funzione per l'assegnazione dei ruoli ma non funge
- metodo di rimozione utente quando viene chiusa la finestra: NON FUNZIONA

*15.03 h15:03*
Luca
- aggiunto controllo: SOLO IL PRIMO GIOCATORE PUO' FAR INIZIARE LA PARTITA

*15.03 h17:17*
Filippo
- inizio stesura classe game e ruoli