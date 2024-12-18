const submit = document.getElementById('submit');
const generateBtn = document.getElementById('generate');
const checkSolutionBtn = document.getElementById('check-solution');
const invalidInputMsg = document.getElementById('invalid-input-msg');

submit.addEventListener('click', answer);
generateBtn.addEventListener('click', generatePuzzle);
checkSolutionBtn.addEventListener('click', checkSolution);

// Sample puzzles for different difficulties
const puzzles = {
    easy: [
        '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
        '170000006800051000090600070000700000020000080000003000060005020000160009500000014'
    ],
    medium: [
        '600120384008459072000006005000264030070080006940003000310000050089700000502000190',
        '008400000700000400020970000500007000000362000000100003000095060004000008000004700'
    ],
    hard: [
        '300200000000107000706030500070009080900020004010800050009040301000702000000008006',
        '100007090030020008009600500005300900010080002600004000300000010040000007007000300'
    ]
};

function generatePuzzle() {
    const difficulties = Object.keys(puzzles);
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const puzzleSet = puzzles[randomDifficulty];
    const selectedPuzzle = puzzleSet[Math.floor(Math.random() * puzzleSet.length)];
    
    for(let i = 0; i < 81; i++) {
        const input = document.getElementsByTagName('input')[i];
        const value = selectedPuzzle[i];
        input.value = value === '0' ? '' : value;
        
        if(value !== '0') {
            input.readOnly = true;
            input.style.color = 'black';
        } else {
            input.readOnly = false;
            input.style.color = 'rgb(89, 89, 231)';
        }
    }
}

function answer() {
    var A = new Array();
    for (let i = 0; i < 81; i++) {
        const inputValue = Number(document.getElementsByTagName('input')[i].value);
        
        if (!isNaN(inputValue) && (inputValue === 0 || (inputValue >= 1 && inputValue <= 9))) {
            A[i] = inputValue;
        } else {
            A[i] = 0;
            invalidInputMsg.style.display = 'block';
            return;
        }
    }
    
    invalidInputMsg.style.display = 'none';
    
    for(let i = 0; i < 81; i++) {
        if(A[i] == 0) {
            document.getElementsByTagName('input')[i].style.color = 'rgb(89, 89, 231)';
        }
    }
    
    var board = [];
    while(A.length > 0) {
        board.push(A.splice(0, 9));
    }
    
    let N = board.length;
    let inputValid = checkInput(board);
    
    if(inputValid) {
        if (solveSudoku(board, N)) {
            print(board);
        } else {
            alert('No Solution');
        }
    }
}

function isZero(board) {
    let sum = 0;
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            sum += board[i][j];
        }
    }
    return sum == 0;
}

function checkInput(board) {
    if(isZero(board)) {
        document.getElementById('alert-msg').style.display = 'block';
        return false;
    }
    document.getElementById('alert-msg').style.display = 'none';
    return true;
}

function isSafe(board, row, col, value) {
    // Check row
    for(let j = 0; j < board.length; j++) {
        if (board[row][j] == value) return false;
    }
    
    // Check column
    for(let i = 0; i < board.length; i++) {
        if (board[i][col] == value) return false;
    }
    
    // Check 3x3 box
    let sqrt = Math.floor(Math.sqrt(board.length));
    let boxRowStart = row - row % sqrt;
    let boxColStart = col - col % sqrt;
    
    for(let i = boxRowStart; i < boxRowStart + sqrt; i++) {
        for(let j = boxColStart; j < boxColStart + sqrt; j++) {
            if (board[i][j] == value) return false;
        }
    }
    return true;
}

function solveSudoku(board, n) {
    let row = -1;
    let col = -1;
    let isEmpty = true;
    
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            if (board[i][j] == 0) {
                row = i;
                col = j;
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) break;
    }
    
    if (isEmpty) return true;
    
    for(let num = 1; num <= n; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board, n)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

function print(board) {
    const output = [];
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            output.push(board[i][j]);
        }
    }
    
    for(let k = 0; k < 81; k++) {
        document.getElementsByTagName('input')[k].value = output[k];
    }
}

function checkSolution() {
    const board = [];
    let isFilled = true;
    
    // Convert grid to 2D array and check if all cells are filled
    for(let i = 0; i < 9; i++) {
        const row = [];
        for(let j = 0; j < 9; j++) {
            const value = Number(document.getElementsByTagName('input')[i * 9 + j].value);
            if(!value) {
                isFilled = false;
            }
            row.push(value);
        }
        board.push(row);
    }
    
    if(!isFilled) {
        alert('Please fill all cells before checking!');
        return;
    }
    
    // Check if solution is valid
    let isValid = true;
    for(let i = 0; i < 9 && isValid; i++) {
        for(let j = 0; j < 9 && isValid; j++) {
            const temp = board[i][j];
            board[i][j] = 0;
            if(!isSafe(board, i, j, temp)) {
                isValid = false;
            }
            board[i][j] = temp;
        }
    }
    
    if(isValid) {
        alert('Congratulations! Your solution is correct!');
    } else {
        alert('Sorry, the solution is incorrect. Keep trying!');
    }
}

