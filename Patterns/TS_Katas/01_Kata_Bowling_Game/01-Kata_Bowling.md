# Kata Bowling


- Partida de bolos de 10 torns on el jugador intenta derribar 10 bolos
- Cada torn tens 1 o 2 intents per derribar-los

## Regles de la Kata Bowling:

### Strike

- Derribar tots els bolos a la primera 
- Son 10 punts + els bolos derribats als propers dos llançaments

### Spare

- Derribar tots els bolos en dos intents
- Son 10 punts + bolos derribats a la següent tirada

### Open Frame:

- No derribar tots els bolos en dos intents
- Suma els bolos derribats en aquell torn

### Décimo turno

- Jugador amb spare o strike te llançaments adicionals
- Màxim de tres boles en aquest torn

## Pistes

- La peculiaritat en la puntuació d'aquest joc es el càlcul adelantat per l'strike y l'spare
- Quan es llença un strike o un spare, la puntuació d'aquest torn queda pendent fins un o dos torns després
- Es farà el cálcul total al final de la partida

### Suggeriments pels tests

- 20 llençaments - 20 errors === 0 punts
- 20 llençaments - 10 parells de 1 === 20 punts
- 20 llençaments - 1 spare, 1 encert, 17 errors === (10+5+5 = 20)
- 19 llençaments - 1 strike, 2 encerts (2 y 3), 16 errors === (10+2+3+2+3= 20)
- 12 llençaments - 12 strikes === (10 torns * 30 punts = 300)
- 21 llençaments - 10 parells de 5 y spare, amb un 5 final === (10 torns* 15 punts = 150)
- 21 llençaments de 10 spares de 8-2 amb un 8 final === (10 torns *18punts = 180)