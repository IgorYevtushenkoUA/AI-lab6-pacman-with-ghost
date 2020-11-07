import {Pacman} from "../characters/pacman.js";
import {noBeans} from "./constants.js";
import {
    BOTTOM_LEFT_TOP,
    BOTTOM_ONLY, canvas,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    ctx,
    DOWN, gamePaused,
    GRID_HEIGHT,
    GRID_WIDTH, intervalId,
    LEFT,
    LEFT_BOTTOM, LEFT_ONLY, LEFT_RIGHT,
    LEFT_TOP,
    LEFT_TOP_RIGHT, MAX_BEANS, MAX_LIFE,
    maze,
    mazeContent,
    noBean,
    noBeanIndex,
    NORMAL_BEAN, restartTimer,
    RIGHT,
    RIGHT_BOTTOM,
    RIGHT_BOTTOM_LEFT, RIGHT_ONLY,
    RIGHT_TOP,
    staticGrids, timerDelay,
    TOP_BOTTOM,
    TOP_ONLY,
    TOP_RIGHT_BOTTOM,
    UP
} from "./constants";

'use strict'

let copy_pacman


function fillWithoutBeans() {
    for (let i = 0; i < noBeans.length; i++) {
        let x1 = noBeans[i][0]
        let x2 = noBeans[i][1]
        let y1 = noBeans[i][2]
        let y2 = noBeans[i][3]

        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                noBean[noBeanIndex++] = [y, x]
            }
        }
    }
}

function initCanvas(width, height) {
    if (width === undefined || !(width instanceof Number)) {
        width = CANVAS_WIDTH;
    }
    if (height === undefined || !(height instanceof Number)) {
        height = CANVAS_HEIGHT;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function initMaze() {
    for (let i = 0; i < maze.length; i++) {
        let oneRow = new Array(CANVAS_WIDTH / GRID_WIDTH);
        maze[i] = oneRow;
    }

    for (let row = 0; row < CANVAS_HEIGHT / GRID_HEIGHT; row++) {
        for (let col = 0; col < CANVAS_WIDTH / GRID_WIDTH; col++) {
            let beanType = NORMAL_BEAN;
            if (row > 14)
                var newGrid
            try {
                newGrid = new Grid(col * GRID_WIDTH, row * GRID_HEIGHT, mazeContent[row][col], beanType);
            } catch (e) {
                console.log('mistake')
            }

            maze[row][col] = newGrid;
            newGrid.draw();
        }
    }

    for (let i = 0; i < noBean.length - 2; i++) {
        let x = noBean[i][0];
        let y = noBean[i][1];

        try {
            maze[x][y].beanType = undefined;
            maze[x][y].draw();
        } catch (e) {

        }

    }


}

function initFields() {
    fillWithoutBeans()
}

//get opposite direction
function oppositeDir(dir) {
    switch (dir) {
        case UP:
            return DOWN;
            break;

        case DOWN:
            return UP;
            break;

        case LEFT:
            return RIGHT;
            break;

        case RIGHT:
            return LEFT;
            break;

        default:
            return -1;//err
    }
}

function getRowIndex(yCord) {
    if (yCord === undefined) {
        return -1;//err
    }
    return parseInt(yCord / GRID_HEIGHT);
}

function getColIndex(xCord) {
    if (xCord === undefined) {
        return -1;//err
    }
    return parseInt(xCord / GRID_WIDTH);
}

function fixGrids(x, y) {
    let row = getRowIndex(y);
    let col = getColIndex(x);

    if (xOnGridCenter(y)) {
        maze[row][col].draw();
        if (col + 1 < maze.length && !staticArrayContains([row, col + 1])) {
            maze[row][col + 1].draw();
        }
        if (col - 1 >= 0 && !staticArrayContains([row, col - 1])) {
            maze[row][col - 1].draw();
        }
    } else if (yOnGridCenter(x)) {
        maze[row][col].draw();
        if (row + 1 < maze.length && !staticArrayContains([row + 1, col])) {
            maze[row + 1][col].draw();
        }
        if (row - 1 >= 0 && !staticArrayContains([row - 1, col])) {
            maze[row - 1][col].draw();
        }
    }
}

function staticArrayContains(cord) {
    let x = cord[0];
    let y = cord[1];
    for (let i = 0; i < staticGrids.length; i++) {
        if (x === staticGrids[i][0] &&
            y === staticGrids[i][1]) {
            return true;
        }
    }
    return false;
}

function onGridCenter(x, y) {
    return xOnGridCenter(y) && yOnGridCenter(x);
}

function xOnGridCenter(y) {
    return ((y - GRID_WIDTH / 2) % GRID_WIDTH) === 0;
}

function yOnGridCenter(x) {
    return ((x - GRID_HEIGHT / 2) % GRID_HEIGHT) === 0;
}

//see if sprite can move one more step at the given (x,y) facing the given direction
function canMove(x, y, dir) {
    if (!onGridCenter(x, y)) {
        return true;
    }
    let canMove = false;
    let currGrid = maze[getRowIndex(y)][getColIndex(x)];
    let gridType = currGrid.gridType;
    switch (dir) {
        case UP:
            if (gridType != LEFT_TOP && gridType != RIGHT_TOP && gridType != TOP_BOTTOM
                && gridType != TOP_ONLY && gridType != LEFT_TOP_RIGHT
                && gridType != TOP_RIGHT_BOTTOM && gridType != BOTTOM_LEFT_TOP) {
                canMove = true;
            }
            break;

        case DOWN:
            if (gridType != LEFT_BOTTOM && gridType != TOP_BOTTOM && gridType != RIGHT_BOTTOM
                && gridType != BOTTOM_ONLY && gridType != RIGHT_BOTTOM_LEFT
                && gridType != BOTTOM_LEFT_TOP && gridType != TOP_RIGHT_BOTTOM) {
                canMove = true;
            }
            break;

        case LEFT:
            if (gridType != LEFT_BOTTOM && gridType != LEFT_TOP && gridType != LEFT_ONLY
                && gridType != LEFT_RIGHT && gridType != LEFT_TOP_RIGHT
                && gridType != BOTTOM_LEFT_TOP && gridType != RIGHT_BOTTOM_LEFT) {
                canMove = true;
            }
            break;

        case RIGHT:
            if (gridType != RIGHT_BOTTOM && gridType != RIGHT_TOP && gridType != RIGHT_ONLY
                && gridType != LEFT_RIGHT && gridType != RIGHT_BOTTOM_LEFT
                && gridType != TOP_RIGHT_BOTTOM && gridType != LEFT_TOP_RIGHT) {
                canMove = true;
            }
            break;
        default:
            break;


    }
    return canMove;
}

//show welcome screen
function welcomeScreen() {

    gameOn = false;
    gamePaused = false;
    ctx.fillStyle = "white";
    ctx.font = "80px monospace";
    ctx.textAlign = "center";
    ctx.fillText("PACMAN", CANVAS_WIDTH / 2, 170);
    ctx.font = "20px monospace";
    ctx.fillText("Press s to start", CANVAS_WIDTH / 2, 220);

}

//update canvas for each frame.
function updateCanvas() {
    restartTimer++;
    eatBean();

    let x = copy_pacman.getX()
    let y = copy_pacman.getY()
    console.log(x)
    copy_pacman.doOneStep("LEFT", x, pacmanStartLoc[0] * GRID_HEIGHT + GRID_HEIGHT / 2)
    debugger
}

//try to eat a bean
function eatBean() {

}

function countDown() {
    setTimeout(function () {
        intervalId = setInterval(updateCanvas, timerDelay);
    }, 1000)
}

//listen to keyDown event
function onKeyDown(event) {
    let keycode = event.keyCode;
    let pauseCode = 81; //q to pause
    let continueCode = 69; //e to resume
    let restartCode = 82; //r to restart
    let godModeCode = 71; //g to enter god mode

    // wasd
    let wCode = 87;
    let aCode = 65;
    let sCode = 83;
    let dCode = 68;
    //arrow keys
    let leftCode = 37;
    let upCode = 38;
    let rightCode = 39;
    let downCode = 40;

    //start game
    if (!gameOn) {
        if (keycode === sCode) {
            clearInterval(intervalId);
            gameOn = true;
            gamePaused = false;
            initMaze();
            run();
            return;
        } else if (keycode === godModeCode) {
            clearInterval(intervalId);
            gameOn = true;
            gamePaused = false;
            initMaze();
            run(true);
            return;
        }
    } else {

        //pause game
        if (keycode === pauseCode && !gamePaused) {
            clearInterval(intervalId);
            gamePaused = true;
            return;
        }

        //resume game
        if (keycode === continueCode && gamePaused) {
            intervalId = setInterval(updateCanvas, timerDelay);
            gamePaused = false;
            return;
        }

        //restart game
        if (keycode === restartCode && restartTimer > 0) {
            //can't restart game if a game was just refreshed.
            restartTimer = 0;
            clearInterval(intervalId);
            gameOn = true;
            gamePaused = false;
            score = 0;
            life = MAX_LIFE;
            beansLeft = MAX_BEANS;
            initMaze();
            run();
        }

    }
}

function run() {
    let x = 5, y = 14
    copy_pacman = new Pacman2(x * GRID_WIDTH + GRID_WIDTH / 2, y * GRID_HEIGHT + GRID_HEIGHT / 2)
    copy_pacman.draw()
    countDown();
}

initFields();
initCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
canvas.addEventListener('keydown', onKeyDown, false);
canvas.setAttribute('tabindex', '0');
canvas.focus();
welcomeScreen();


