// Grid Design 

// A   B   C
// P   Q   R
// X   Y   Z

// O, V, H, VH, TV, TH 

// O   = x , y 
// V   = Math.abs(x - 25) ,  y 
// H   =  x  , Math.abs(x - 25)
// VH = Math.abs(x - 25) , Math.abs(y - 25)
// TV  - Math.abs(y - 25) , x
// TH -  y , Math.abs(x - 25)



var reversi = {
    // 0 = Normal | 1 = Cylinder | 2 = Torus | 3 = Moebius Strip | 4 = Klein Bottle 
    // 5 = Real Projection Plane | 6 = Sphere | 7 = 2 Mirrors | 8 = 4 Mirrors 
    mode: 6,
    father: null,
    score: null,
    rows: 24,
    cols: 24,
    grid: [],
    states: {
        'blank': { 'id' : 0, 'color': 'white' },
        'white': { 'id' : 1, 'color': 'white' },
        'black': { 'id' : 2, 'color': 'black' },
    },

    // This is in the order of the grid, ie, [a-b-c||p-q-r||x-y-z]
    // [-1,-1] = empty board | [0,0] = O | [25, 0] = V | [0, 25] = H 
    //[25,25] = VH | [-1,0] = TV | [0,-1] = TH
    // 0 = Normal | 1 = Cylinder | 2 = Torus | 3 = Moebius Strip | 4 = Klein Bottle 
    // 5 = Real Projection Plane | 6 = Sphere | 7 = 2 Mirrors | 8 = 4 Mirrors 
    topology: [ 
        [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[0,0],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
        [[-1,-1],[-1,-1],[-1,-1],[0,0],[0,0],[0,0],[-1,-1],[-1,-1],[-1,-1]],
        [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
        [[-1,-1],[-1,-1],[-1,-1],[25,0],[0,0],[25,0],[-1,-1],[-1,-1],[-1,-1]],
        [[25,0],[25,0],[25,0],[25,0],[0,0],[25,0],[25,0],[25,0],[25,0]],
        [[25,25],[25,0],[25,25],[25,0],[0,0],[25,0],[25,25],[25,0],[25,25]],
        [[25,25],[-1,0],[25,25],[0,-1],[0,0],[0,-1],[25,25],[-1,0],[25,25]],
        [[-1,-1],[-1,-1],[-1,-1],[0,25],[0,0],[0,25],[-1,-1],[-1,-1],[-1,-1]],
        [[25,25],[25,0],[25,25],[0,25],[0,0],[0,25],[25,25],[25,0],[25,25]]
    ],

    init: function(selector) {
        
        this.father = document.getElementById(selector);
        
        // make sure we have a valid element selected
        if (null === this.father) {
            
            return;
        }
        
        // append .reversi class to the father element
        this.father.className = (this.father.className ? this.father.className + ' ' : '') + 'reversi';
        
        // prepare and draw grid
        this.prepareGrid();
        
        // place initial items
        this.initGame();
    },
    /**
    *
    */
    initGame: function() {
        
        // the black player begins the game
        // this.setTurn(this.states.black);
        // this.setItemState(this.rows/2 , this.cols/2 , this.states.white);
        // this.setItemState(this.rows/2 , this.cols/2 + 1 , this.states.black);
        // this.setItemState(this.rows/2 + 1 , this.cols/2 , this.states.black);
        // this.setItemState(this.rows/2 + 1 , this.cols/2 + 1 , this.states.white);
        // this.setScore(2, 2);
        this.setTurn(this.states.white);
        this.setItemState(10,11,this.states.black);
        this.setItemState(10,13,this.states.black);
        this.setItemState(11,11,this.states.black);
        this.setItemState(11,12,this.states.black);
        this.setItemState(11,13,this.states.black);
        this.setItemState(12,13,this.states.black);
        this.setItemState(13,13,this.states.black);
        this.setItemState(13,11,this.states.black);
        this.setItemState(13,10,this.states.black);
        this.setItemState(14,10,this.states.black);
        this.setItemState(14,11,this.states.black);
        this.setItemState(14,12,this.states.black);
        this.setItemState(12,9,this.states.white);
        this.setItemState(12,10,this.states.white);
        this.setItemState(12,11,this.states.white);
        this.setItemState(12,12,this.states.white);
        this.setItemState(12,14,this.states.white);
        this.setItemState(12,15,this.states.white);
        this.setItemState(13,12,this.states.white);
        this.setScore(12, 7);
    },
    
    passTurn: function() {
    
        var turn = (this.turn.id === this.states.black.id) ? this.states.white : this.states.black;
        
        this.setTurn(turn);
    },
    
    setTurn: function(state) {
        
        this.turn = state;
        
        var isBlack = (state.id === this.states.black.id);
        
        this.score.black.elem.style.background = isBlack ? '#3e8e41': '';
        this.score.white.elem.style.background = isBlack ? '': '#3e8e41';
    },
    
    initItemState: function(elem) {
        
        return {
            'state': this.states.blank,
            'elem': elem,
        };
    },
    
    isVisible: function(state) {
        
        return (state.id === this.states.white.id || state.id === this.states.black.id );
    },
    
    isVisibleItem: function(row, col) {
        
        return this.isVisible(this.grid[row][col].state);
    },
    
    isValidPosition: function(row, col) {
        return (row >= 1 && row <= this.rows) && (col >= 1 && col <= this.cols);
    },

    changeState: function(row, col, state){
        this.grid[row][col].state = state;
        this.grid[row][col].elem.style.visibility =  this.isVisible(state) ? 'visible' : 'hidden';
        this.grid[row][col].elem.style.backgroundColor = state.color;
    },
    
    setItemState: function(row, col, state) {
        var c = 0;
        var a = 0;
        var b = 0;
        var xf = Math.floor((col - 1)/8);
        var yf = Math.floor((row - 1)/8);

        for ( var i = -8*yf ; i <= 8*(2 - yf); i = i + 8 ){
            for ( var j = -8*xf ; j <= 8*(2 - xf) ; j = j + 8){
                a = this.topology[this.mode][c][0];
                b = this.topology[this.mode][c][1];
                c = c + 1;
                if (a == -1 && b == -1) { continue; }
                else if (a == -1){
                    this.changeState( Math.abs(col - 25) + i, Math.abs(row - b) + j, state);
                }
                else if (b == -1){
                    this.changeState( Math.abs(col - a) + i, Math.abs(row - 25) + j, state);
                }
                else{
                    this.changeState( Math.abs(row - a) + i, Math.abs(col - b) + j, state);
                }
                
            }
        }
        
    },
    
    prepareGrid: function() {
        
        // create table structure for grid
        var table = document.createElement('table');
        
        // apply some base styling for table
        // table.setAttribute('border', 0);
        // table.setAttribute('cellpadding', 0);
        // table.setAttribute('cellspacing', 0);
        
        for (var i = 1; i <= this.rows; i++) {
            
            var tr = document.createElement('tr');
            
            table.appendChild(tr);
            
            this.grid[i] = [];
            
            for (var j = 1; j <= this.cols; j++) {
                
                var td = document.createElement('td');

                tr.appendChild(td);

                if ( !((j >= 9 && j <= 16) && (i >= 9 && i <= 16))) {
                    td.style.backgroundColor = 'grey';
                }

                else {
                    // bind move action to onclick event on each item in the Inner Grid
                    this.bindMove(td, i, j);
                }
                
                // we are also storing html element for better manipulation later
                this.grid[i][j] = this.initItemState(td.appendChild(document.createElement('span')));
            }
        }

        // prepare score bar
        var scoreBar = document.createElement('div'),
            scoreBlack = document.createElement('span'),
            scoreWhite = document.createElement('span');
            
        scoreBlack.className = 'score-node score-black';
        scoreWhite.className = 'score-node score-white';
        
        // append score bar items
        scoreBar.appendChild(scoreBlack);
        scoreBar.appendChild(scoreWhite);
        
        // append score bar
        this.father.appendChild(scoreBar);
        
        // set the score object
        this.score = {
            'black': { 
                'elem': scoreBlack,
                'state': 0
            },
            'white': { 
                'elem': scoreWhite,
                'state': 0
            },
        }
        
        // append table
        this.father.appendChild(table);
    },
    
    recalcuteScore: function()  {
        
        var scoreWhite = 0,
            scoreBlack = 0;
            
        for (var i = 9; i <= 16; i++) {

            for (var j = 9; j <= 16; j++) {
                
                if (this.isValidPosition(i, j) && this.isVisibleItem(i, j)) {
                    
                    if (this.grid[i][j].state.id === this.states.black.id) {
                        
                        scoreBlack++;
                    } else {
                        
                        scoreWhite++;
                    }
                }
            }
        }
        
        this.setScore(scoreBlack, scoreWhite);
    },
    
    setScore: function(scoreBlack, scoreWhite) {
        
        this.score.black.state = scoreBlack;
        this.score.white.state = scoreWhite;
        
        this.score.black.elem.innerHTML = '&nbsp;' + scoreBlack + '&nbsp;';
        this.score.white.elem.innerHTML = '&nbsp;' + scoreWhite + '&nbsp;';
    },
    
    isValidMove: function(row, col) {
        
        var current = this.turn,
            rowCheck,
            colCheck,
            toCheck = (current.id === this.states.black.id) ? this.states.white : this.states.black;
            
        if ( this.isVisibleItem(row, col)) {
            
            return false;
        }
        
        // check all eight directions
        for (var rowDir = -1; rowDir <= 1; rowDir++) {
            
            for (var colDir = -1; colDir <= 1; colDir++) {
                
                // dont check the actual position
                if (rowDir === 0 && colDir === 0) { continue; }
                
                // move to next item
                rowCheck = row + rowDir;
                colCheck = col + colDir;
                
                // were any items found ?
                var itemFound = false;
                
                // look for valid items
                // look for visible items
                // look for items with opposite color
                while (this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck) && this.grid[rowCheck][colCheck].state.id === toCheck.id) {
                    
                    // move to next position
                    rowCheck += rowDir;
                    colCheck += colDir;
                    
                    // item found
                    itemFound = true; 
                }
                
                // if some items were found
                if (itemFound) {

                    // now we need to check that the next item is one of ours
                    if (this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck) && this.grid[rowCheck][colCheck].state.id === current.id) {
                        
                        // we have a valid move
                        // this.grid[row][col].elem.style.background = "red";
                        return true;
                    }
                }
            }
        }
        
        return false;
    },
    
    canMove: function() {
        
        for (var i = 1; i <= 24; i++) {

            for (var j = 1; j <= 24; j++) {
                
                if (this.isValidMove(i, j)) {
                    
                    return true;
                }
            }
        }
        
        return false;
    },
    
    bindMove: function(elem, row, col) {
        
        var self = this;
        
        elem.onclick = function(event) {
            
        if (self.canMove()) {
                
                // if have a valid move
                if (self.isValidMove(row, col)) {

                    // make the move
                    self.move(row, col);
                    
                    // check whether the another player can now move, if not, pass turn back to other player
                    if ( ! self.canMove()) {
                        
                        self.passTurn();
                        
                        // check the end of the game
                        if ( ! self.canMove()) {

                            self.endGame();
                        }
                    }

                    // in case of full grid, end the game
                    if (self.checkEnd()) {

                        self.endGame();
                    }
                }
            }
        };
    },
    
    endGame: function() {
        
        var result = (this.score.black.state > this.score.white.state) 
            ? 
                1 
            : ( 
                (this.score.white.state > this.score.black.state) ? -1 : 0 
            ), message;
        
        switch (result) {
            
            case 1:  { message = 'Black Wins.'; } break;
            case -1: { message = 'White Wins.'; } break;
            case 0:  { message = 'Draw.'; } break;
        }
        
        alert(message);
        
        // reset the game
        this.reset();
    },
    
    clear: function() {
        
        for (var i = 1; i <= this.rows; i++) {

            for (var j = 1; j <= this.cols; j++) {
                
                this.setItemState(i, j, this.states.blank);
            }
        }
    },
    
    reset: function() {

        // clear items
        this.clear();
        
        // reinit game
        this.initGame();
    },

    toggle: function() {

        for(var i = 1 ; i <= this.rows; i++){
            for (var j = 1; j <= this.cols; j++) {
                if ( !((j >= 9 && j <= 16) && (i >= 9 && i <= 16))) {
                    this.grid[i][j].elem.style.visibility = 'hidden';
                }
            }
        }
    },

    checkEnd: function(lastMove) {
        
        for (var i = 1; i <= this.rows; i++) {

            for (var j = 1; j <= this.cols; j++) {
                
                if (this.isValidPosition(i, j) && ! this.isVisibleItem(i, j)) {
                    
                    return false;
                }
            }
        }
        
        return true;
    },

    move: function(row, col) {
        
        var finalItems = [],
            current = this.turn,
            rowCheck,
            colCheck,
            toCheck = (current.id === this.states.black.id) ? this.states.white : this.states.black;
        
        // check all eight directions
        for (var rowDir = -1; rowDir <= 1; rowDir++) {
            
            for (var colDir = -1; colDir <= 1; colDir++) {
                
                // dont check the actual position
                if (rowDir === 0 && colDir === 0) {
                    
                    continue;
                }
                
                // move to next item
                rowCheck = row + rowDir;
                colCheck = col + colDir;
                
                // possible items array
                var possibleItems = [];

                // look for valid items
                // look for visible items
                // look for items with opposite color
                while (this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck) && this.grid[rowCheck][colCheck].state.id === toCheck.id) {
                    
                    possibleItems.push([rowCheck, colCheck]);
                    
                    // move to next position
                    rowCheck += rowDir;
                    colCheck += colDir;
                }
                
                // if some items were found
                if (possibleItems.length) {

                    // now we need to check that the next item is one of ours
                    if (this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck) && this.grid[rowCheck][colCheck].state.id === current.id) {
                        
                        // push the actual item
                        finalItems.push([row, col]);
                        
                        // push each item actual line
                        for (var item in possibleItems) {
                            
                            finalItems.push(possibleItems[item]);
                        }
                    }
                }
            }
        }
        
        // check for items to check
        if (finalItems.length) {
            
            for (var item in finalItems) {
                
                this.setItemState(finalItems[item][0], finalItems[item][1], current);

            }
        }
        
        // pass turn to the other player
        this.setTurn(toCheck);
        
        // recalculate score each turn
        this.recalcuteScore();
    }
};


