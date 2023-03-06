'use strict';

const controller = {
    guesses: 0,

    processGuess: function(guess) {
        const location = parseGuess(guess);
        if (location) {
            this.guesses++;
            const hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('You sank all my battleships in ' + this.guesses + ' guesses');
            }
        }
    }
}

const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships : [{ locations: [0, 0, 0], hits: ['', '', ''] },
         { locations: [0, 0, 0], hits: ['', '', ''] },
         { locations: [0, 0, 0], hits: ['', '', '']}
        ],

    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            const ship = this.ships[i];
            const index = ship.locations.indexOf(guess);

            if (ship.hits[index] === 'hit') {
                ship.hits[index] = 'hit';
                view.displayMessage('You already hit that location!');
                return true;
            } else if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');

                if(this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed.');
        return false;
        },
    
        isSunk: function(ship) {
            for (let i = 0; i < this.shipLength; i++) {
                if (ship.hits[i] !== 'hit') {
                    return false;
                }
            }
            return true;
        },

    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.colision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        if (direction === 1) {
            //  horizontal ship
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
        } else {
            //vertical ship
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
            col = Math.floor(Math.random() * this.boardSize);
        }

    let newShipLocations = [];
    for ( let i = 0; i < this.shipLength; i ++) {
    if (direction === 1) {
        // add location to array for horizontal ship
        newShipLocations.push(row + '' + (col + i));
    } else {
        // add locatino to array for vertical ship
        newShipLocations.push((row + i) + '' + col);
        }
    }
    return newShipLocations;
    },

    colision: function(locations) {
        // For each ship already on the board...
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            // Check to see if any of the locations are in an existing locations array...
            for (let j = 0; j < locations.length; j++) { 
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};
   



let view = {
    displayMessage: function(msg) {
        const messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function(location){
        const cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
        
    },
    
    displayMiss: function(location){
        const cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};


// Functions


function parseGuess(guess) {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        alert('Please, enter a letter and a number on the board!');
    } else {
        const firstChar = guess.charAt(0);
        const row = alphabet.indexOf(firstChar);
        const column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert('Oops, that is not on the board!');
        } else if (row < 0 || row >= model.boardSize || 
            column < 0 || column >= model.boardSize) {
            alert('That is off the board!');
        } else {
            return row + column;
        }
    }
     return null;
}


function handleFireButton() {
    const guessInput = document.getElementById('guessInput');
    const guess =  guessInput.value;
    controller.processGuess(guess);

    // resets the form input to  an empty string, avoiding deleting manually
    guessInput.value = '';  
}

window.onload = init;

function init() {
    const fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;

    //using the return/enter key to submit the form's input
    const guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

     model.generateShipLocations();  

}

function handleKeyPress(e) {
    const fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}




