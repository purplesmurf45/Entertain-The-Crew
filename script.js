
var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

var Player1 = 1;
var Player2 = -1;
var turns = 0;
var players = 2;
var moves = []; 
const winBoard = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
];
var winBoard_index = -1;
/* Returns 1 if Player1 wins, -1 if Player2 wins and 0 if it is a draw */
function checkIfWon(state) {
    var status = 0;
    if (isGameOver (state, Player1)) {
        status = 1;
    }
    else if (isGameOver (state, Player2)) {
        status = -1;
    }
    else {
        status = 0;
    }

    return status;
}

function isGameOver(state, player) {
    // board = [
    //     [00, 01, 02],
    //     [10, 11, 12],
    //     [20, 21, 22]
    // ]
    const winState = [
        [state[0][0], state[0][1], state[0][2]],
        [state[1][0], state[1][1], state[1][2]],
        [state[2][0], state[2][1], state[2][2]],
        [state[0][0], state[1][0], state[2][0]],
        [state[0][1], state[1][1], state[2][1]],
        [state[0][2], state[1][2], state[2][2]],
        [state[0][0], state[1][1], state[2][2]],
        [state[0][2], state[1][1], state[2][0]]
    ];

    for (var i = 0; i < 8; i++)
    {
        var seq = winState[i]
        if (player == seq[0]) {
            if (seq[0] == seq[1] && seq[1] == seq[2]) {
                winBoard_index = i;
                return true;
            }
        }             
    }
    return false;
}

// Returns empty cells in the grid
function emptyCellsPresent(state) {
    var cells = [];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (state[i][j] == 0) {
                cells.push([i, j]);
            }
        }         
    }
    return cells;
}

// Makes the move on the board and returns true, if the move is successful
function takeTurn(x, y, player) {
    // var x = cell[0];
    // var y = cell[1];
    try {
        if (board[x][y] == 0) {
        board[x][y] = player;
        moves.push([x, y]);
        turns++;
        return true;
    }
        else {
            return false;
        }
    }
    catch (e) {
        return false;
    }
}

/*----------------------------------------ALGORITHMS (MINIMAX)----------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/

function miniMax (state, depth, player) {
    var bestMove;
    //Maximising Player
    if (player == Player1) {
        bestMove = [-1, -1, -1000];
    }
    //Maximising Player
    else {
        bestMove = [-1, -1, +1000];
    }

    var temp = checkIfWon(state);
    if (depth == 0 || temp != 0) {
        return [-1, -1, temp];
    }

    emptyCellsPresent(state).forEach(function (cell) {
        var x = cell[0];
        var y = cell[1];
        state[x][y] = player;
        var tscore = miniMax (state, depth - 1, (-1) * player);
        //Now undo the assignment
        state[x][y] = 0;
        tscore[0] = x;
        tscore[1] = y;

        if (player == Player1) {
            //Greater score for Maximising player
			if (tscore[2] > bestMove[2])
				bestMove = tscore;
		}
		else {
            //Lower score for Minimising player
			if (tscore[2] < bestMove[2])
				bestMove = tscore;
		}
    });

    return bestMove;
}

function optimizedMove(player) {
    var x, y;
	var move;
	var cell;

	if (emptyCellsPresent(board).length == 9) {
		x = parseInt(Math.random() * 3);
		y = parseInt(Math.random() * 3);
	}
	else {
		move = miniMax(board, emptyCellsPresent(board).length, player);
		x = move[0];
		y = move[1];
	}

	if (takeTurn(x, y, player)) {
		cell = document.getElementById(String(x) + String(y));
		cell.innerHTML = "O";
    }
    // return cell;
}

function clickedCell(cell) {
	var button = document.getElementById("restart");
    var conditionToContinue = checkIfWon(board) == 0 && emptyCellsPresent(board).length > 0;
    
/*----------------------------------For Human vs Computer -----------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/

    if (players == 1) {
        if (conditionToContinue == true) {
            var x = cell.id.split("")[0];
            var y = cell.id.split("")[1];
            var move = takeTurn(x, y, Player2);
            if (move == true) {
                cell.innerHTML = "X";
                if (conditionToContinue)
                    optimizedMove(Player1);    
            }
        }
        if (isGameOver(board, Player1)) {
            var lines = winBoard[winBoard_index];
            var cell;
            var msg;

            for (var i = 0; i < lines.length; i++) {
                cell = document.getElementById(String(lines[i][0]) + String(lines[i][1]));
                cell.style.color = "red";
            }

            msg = document.getElementById("message");
            msg.innerHTML = "Computer Wins!";
        }
        if (emptyCellsPresent(board).length == 0 && checkIfWon(board) == 0) {
            var msg = document.getElementById("message");
            msg.innerHTML = "Draw!";
        }
        if (checkIfWon(board) == 1 || checkIfWon(board) == -1 || emptyCellsPresent(board).length == 0) {
            button.value = "Restart";
            button.disabled = false;
        }
    }

/*----------------------------------For Human vs Human -----------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/

    else if (players == 2) {
        if (conditionToContinue == true) {
            var x = cell.id.split("")[0];
            var y = cell.id.split("")[1];
            var p = turns % 2 == 0 ? Player2 : Player1;
            var move = takeTurn(x, y, p);
            // var move = document.getElementById(String(x) + String(y));
            if (move == true) {
                if (turns % 2 != 0) {
                    cell.innerHTML = "X";
                }
                else {
                    cell.innerHTML = "O";
                } 
            }
        }
        if (isGameOver(board, Player1)) {
            var lines = winBoard[winBoard_index];
            var cell;
            var msg;

            for (var i = 0; i < lines.length; i++) {
                cell = document.getElementById(String(lines[i][0]) + String(lines[i][1]));
                cell.style.color = "red";
            }

            msg = document.getElementById("message");
            msg.innerHTML = "O wins!";
        }
        if (isGameOver(board, Player2)) {
            var lines = winBoard[winBoard_index];
            var cell;
            var msg;

            for (var i = 0; i < lines.length; i++) {
                cell = document.getElementById(String(lines[i][0]) + String(lines[i][1]));
                cell.style.color = "red";
            }

            msg = document.getElementById("message");
            msg.innerHTML = "X wins!";
        }
        if (emptyCellsPresent(board).length == 0 && checkIfWon(board) == 0) {
            var msg = document.getElementById("message");
            msg.innerHTML = "Draw!";
        }
        if (checkIfWon(board) == 1 || checkIfWon(board) == -1 || emptyCellsPresent(board).length == 0) {
            button.value = "Restart";
            button.disabled = false;
        }
        
    }
}

/*----------------------------------------------Buttons-----------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/


function humanVsHuman(button) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            board[i][j] = 0;
            Board = document.getElementById(String(i) + String(j));
            Board.innerHTML = "";
        }
    }
    button.disabled = true;
    // button.value = "Playing..."
    var b1 = document.getElementById("HvC");
    b1.disabled = false;
    b1.value = "v/s Computer";
    msg = document.getElementById("message");
    msg.innerHTML = "";
    players = 2;
    turns = 0;
}

function humanVsComputer(button) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            board[i][j] = 0;
            htmlBoard = document.getElementById(String(i) + String(j));
            htmlBoard.style.color = "#444";
            htmlBoard.innerHTML = "";
        }
    }
    button.disabled = true;
    // button.value = "Playing..."
    var b1 = document.getElementById("HvH");
    b1.disabled = false;
    b1.value = "v/s Human";
    msg = document.getElementById("message");
    msg.innerHTML = "";
    players = 1;
    turns = 0;
    var b2 = document.getElementById("SA");
    b2.disabled = false;
}

function startComputerBnt(button) {
    if (players == 1) {
        restartBnt(button);
        optimizedMove(Player1);
        button.disabled = true;
        var b1 = document.getElementById("HP");
        b1.disabled = false;
    }
    button.disabled = true;
}

function startHumanBnt(button) {
    if (players == 1) {
        // optimizedMove(Player1);
        restartBnt(button);
        button.disabled = true;
        var b1 = document.getElementById("SA");
        b1.disabled = false;
    }
    button.disabled = true;
}

function restartBnt(button) {
    var htmlBoard;
    var msg;
    button.active = true;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            board[i][j] = 0;
            htmlBoard = document.getElementById(String(i) + String(j));
            htmlBoard.style.color = "#444";
            htmlBoard.innerHTML = "";
        }
    }
    moves.splice(0, moves.length);
    turns = 0;
    winBoard_index = -1;
    msg = document.getElementById("message");
    msg.innerHTML = "";
}

function undoButton() {
    if (moves.length != 0 && checkIfWon(board) == 0) {
        var temp = moves.pop();
        turns--;
        var x = temp[0];
        var y = temp[1];
        var cell = document.getElementById(String(x) + String(y));
        board[x][y] = 0
        cell.innerHTML = "";
        msg = document.getElementById("message");
        msg.innerHTML = "";
    }
}
