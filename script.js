// ========================================
// SNAKE & LADDER - 2 PLAYER
// ========================================


// PLAYER DATA

let players = [
    {
        name: "",
        mobile: "",
        position: 0
    },

    {
        name: "",
        mobile: "",
        position: 0
    }
];


let currentPlayer = 0;

let gameOver = false;

let rolling = false;


// DICE

const diceFaces = [
    "",
    "⚀",
    "⚁",
    "⚂",
    "⚃",
    "⚄",
    "⚅"
];


// SNAKES

const snakes = {

    99: 54,
    95: 75,
    92: 88,
    89: 68,
    74: 53,
    64: 60,
    62: 19,
    49: 11,
    47: 26,
    16: 6

};


// LADDERS

const ladders = {

    2: 38,
    7: 14,
    8: 31,
    15: 26,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    78: 98

};


// ========================================
// START GAME
// ========================================

function startGame() {

    const name1 =
        document.getElementById("name1")
        .value.trim();

    const mobile1 =
        document.getElementById("mobile1")
        .value.trim();


    const name2 =
        document.getElementById("name2")
        .value.trim();

    const mobile2 =
        document.getElementById("mobile2")
        .value.trim();


    const error =
        document.getElementById("error");


    error.textContent = "";


    // NAME CHECK

    if (
        name1 === "" ||
        name2 === ""
    ) {

        error.textContent =
            "⚠️ Enter both player names.";

        return;
    }


    // MOBILE CHECK

    const mobilePattern =
        /^[6-9][0-9]{9}$/;


    if (
        !mobilePattern.test(mobile1) ||
        !mobilePattern.test(mobile2)
    ) {

        error.textContent =
            "⚠️ Enter valid 10-digit mobile numbers.";

        return;
    }


    // SAME MOBILE

    if (mobile1 === mobile2) {

        error.textContent =
            "⚠️ Both players need different mobile numbers.";

        return;
    }


    // SAVE DATA

    players[0] = {
        name: name1,
        mobile: mobile1,
        position: 0
    };


    players[1] = {
        name: name2,
        mobile: mobile2,
        position: 0
    };


    currentPlayer = 0;

    gameOver = false;

    rolling = false;


    // SHOW PLAYER INFO

    document.getElementById("showName1")
        .textContent = name1;

    document.getElementById("showMobile1")
        .textContent = mobile1;


    document.getElementById("showName2")
        .textContent = name2;

    document.getElementById("showMobile2")
        .textContent = mobile2;


    // CREATE BOARD

    createBoard();


    updateGame();

    updateTurn();


    // PAGE CHANGE

    document
        .getElementById("loginPage")
        .classList.add("hidden");


    document
        .getElementById("gamePage")
        .classList.remove("hidden");

}


// ========================================
// CREATE BOARD
// ========================================

function createBoard() {

    const board =
        document.getElementById("board");


    board.innerHTML = "";


    for (
        let row = 9;
        row >= 0;
        row--
    ) {

        let numbers = [];


        let start =
            row * 10 + 1;


        for (
            let i = 0;
            i < 10;
            i++
        ) {

            numbers.push(
                start + i
            );

        }


        // ZIG ZAG

        if (
            (9 - row) % 2 === 1
        ) {

            numbers.reverse();

        }


        numbers.forEach(number => {

            const cell =
                document.createElement("div");


            cell.className = "cell";

            cell.id =
                "cell-" + number;


            // NUMBER

            const numberText =
                document.createElement("span");


            numberText.className =
                "number";


            numberText.textContent =
                number;


            cell.appendChild(numberText);


            // SNAKE

            if (
                snakes[number]
            ) {

                cell.classList.add("snake");


                const snake =
                    document.createElement("span");


                snake.className =
                    "special";


                snake.textContent =
                    "🐍";


                cell.appendChild(snake);

            }


            // LADDER

            if (
                ladders[number]
            ) {

                cell.classList.add("ladder");


                const ladder =
                    document.createElement("span");


                ladder.className =
                    "special";


                ladder.textContent =
                    "🪜";


                cell.appendChild(ladder);

            }


            // TOKEN AREA

            const tokenArea =
                document.createElement("div");


            tokenArea.className =
                "tokenArea";


            tokenArea.id =
                "tokens-" + number;


            cell.appendChild(tokenArea);


            board.appendChild(cell);

        });

    }

}


// ========================================
// ROLL DICE
// ========================================

function rollDice() {

    if (
        gameOver ||
        rolling
    ) {

        return;
    }


    rolling = true;


    document.getElementById("rollBtn")
        .disabled = true;


    const dice =
        document.getElementById("dice");


    dice.classList.add("rolling");


    // IMPORTANT:
    // Generate ONE number only.
    // Same number will move player.

    const finalNumber =
        Math.floor(
            Math.random() * 6
        ) + 1;


    let count = 0;


    const animation =
        setInterval(() => {

            const random =
                Math.floor(
                    Math.random() * 6
                ) + 1;


            dice.textContent =
                diceFaces[random];


            count++;


            if (count >= 12) {

                clearInterval(animation);


                dice.classList.remove(
                    "rolling"
                );


                dice.textContent =
                    diceFaces[finalNumber];


                movePlayer(finalNumber);

            }

        }, 80);

}


// ========================================
// MOVE PLAYER
// ========================================

function movePlayer(diceNumber) {

    const player =
        players[currentPlayer];


    const oldPosition =
        player.position;


    const target =
        oldPosition + diceNumber;


    document.getElementById("message")
        .textContent =
        `${player.name} rolled ${diceNumber}`;


    // MORE THAN 100

    if (target > 100) {

        document.getElementById("message")
            .textContent =
            `${player.name} needs ${100 - oldPosition} to reach 100.`;


        setTimeout(() => {

            nextTurn();

        }, 1000);


        return;
    }


    // MOVE

    player.position =
        target;


    updateGame();


    // LADDER

    if (
        ladders[target]
    ) {

        document.getElementById("message")
            .textContent =
            `🪜 ${player.name} got a ladder!`;


        setTimeout(() => {

            player.position =
                ladders[target];


            updateGame();


            checkWinner();

        }, 1000);


        return;
    }


    // SNAKE

    if (
        snakes[target]
    ) {

        document.getElementById("message")
            .textContent =
            `🐍 ${player.name} got a snake!`;


        setTimeout(() => {

            player.position =
                snakes[target];


            updateGame();


            checkWinner();

        }, 1000);


        return;
    }


    // NORMAL

    setTimeout(() => {

        checkWinner();

    }, 500);

}


// ========================================
// CHECK WINNER
// ========================================

function checkWinner() {

    const player =
        players[currentPlayer];


    if (
        player.position === 100
    ) {

        gameOver = true;

        rolling = false;


        showWinner();

        return;
    }


    nextTurn();

}


// ========================================
// NEXT TURN
// ========================================

function nextTurn() {

    if (gameOver) {
        return;
    }


    currentPlayer =
        currentPlayer === 0
            ? 1
            : 0;


    rolling = false;


    document.getElementById("rollBtn")
        .disabled = false;


    updateTurn();

}


// ========================================
// UPDATE TURN
// ========================================

function updateTurn() {

    const player =
        players[currentPlayer];


    document.getElementById("turn")
        .textContent =
        `🎯 ${player.name}'s Turn`;


    document.getElementById("card1")
        .classList.remove("active");


    document.getElementById("card2")
        .classList.remove("active");


    if (
        currentPlayer === 0
    ) {

        document.getElementById("card1")
            .classList.add("active");

    } else {

        document.getElementById("card2")
            .classList.add("active");

    }


    document.getElementById("message")
        .textContent =
        `${player.name}, roll the dice!`;

}


// ========================================
// UPDATE GAME
// ========================================

function updateGame() {

    document.getElementById("pos1")
        .textContent =
        players[0].position;


    document.getElementById("pos2")
        .textContent =
        players[1].position;


    document.getElementById("bar1")
        .style.width =
        players[0].position + "%";


    document.getElementById("bar2")
        .style.width =
        players[1].position + "%";


    updateTokens();

}


// ========================================
// UPDATE TOKENS
// ========================================

function updateTokens() {

    // CLEAR ALL TOKEN AREAS

    document
        .querySelectorAll(".tokenArea")
        .forEach(area => {

            area.innerHTML = "";

        });


    // PLAYER 1

    if (
        players[0].position > 0
    ) {

        addToken(
            players[0].position,
            "P1",
            "p1Token"
        );

    }


    // PLAYER 2

    if (
        players[1].position > 0
    ) {

        addToken(
            players[1].position,
            "P2",
            "p2Token"
        );

    }

}


// ========================================
// ADD TOKEN
// ========================================

function addToken(
    position,
    text,
    className
) {

    const area =
        document.getElementById(
            "tokens-" + position
        );


    if (!area) {
        return;
    }


    const token =
        document.createElement("div");


    token.className =
        "token " + className;


    token.textContent =
        text;


    area.appendChild(token);

}


// ========================================
// SHOW WINNER
// ========================================

function showWinner() {

    const winner =
        players[currentPlayer];


    document.getElementById("winnerName")
        .textContent =
        `🏆 ${winner.name}`;


    document.getElementById("winnerUser")
        .textContent =
        winner.name;


    document.getElementById("winnerMobile")
        .textContent =
        winner.mobile;


    document.getElementById("winnerModal")
        .classList.remove("hidden");

}


// ========================================
// PLAY AGAIN
// ========================================

function playAgain() {

    players[0].position = 0;

    players[1].position = 0;


    currentPlayer = 0;

    gameOver = false;

    rolling = false;


    document.getElementById("winnerModal")
        .classList.add("hidden");


    document.getElementById("dice")
        .textContent = "🎲";


    document.getElementById("rollBtn")
        .disabled = false;


    updateGame();

    updateTurn();

}


// ========================================
// BACK TO LOGIN
// ========================================

function backHome() {

    document.getElementById("winnerModal")
        .classList.add("hidden");


    document.getElementById("gamePage")
        .classList.add("hidden");


    document.getElementById("loginPage")
        .classList.remove("hidden");


    players[0].position = 0;

    players[1].position = 0;


    currentPlayer = 0;

    gameOver = false;

    rolling = false;

}


// ========================================
// MOBILE INPUT
// ONLY NUMBERS + 10 DIGITS
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const inputs =
            document.querySelectorAll(
                'input[type="tel"]'
            );


        inputs.forEach(input => {

            input.addEventListener(
                "input",
                function() {

                    this.value =
                        this.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                }
            );

        });

    }
);