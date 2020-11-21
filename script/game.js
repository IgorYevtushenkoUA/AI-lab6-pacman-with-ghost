import {COLOR_BEAN, COLOR_ROAD, COLOR_WALL, ALL_BEANS, BEAN_CODE} from "./data/constants.js";
import {BEAN_RADIUS, HEIGHT, MAP_HEIGHT, MAP_WIDTH, WIDTH} from "./data/constants.js";
import {adj, vertexes, fillADJ} from "./data/data_graphs.js";
import {Pacman} from "./characters/pacman.js";
import {MAP} from "./data/data_map.js";
import {Ghost} from "./characters/ghost.js";

export let ctx = document.getElementById('pacman_game').getContext("2d")

//   x * WIDTH + 11, y * WIDTH + 10
let startPacmanX = 35, startPacmanY = 15, ghost1X = 35, ghost1Y = 4,
    score = 0,
    timerDelay = 100,
    intervalID,
    pacman,
    ghost1


function drawMap() {
    for (let i = 0; i < MAP_HEIGHT; i++) {
        for (let j = 0; j < MAP_WIDTH; j++) {
            switch (MAP[i * MAP_WIDTH + j]) {
                case 0:
                    ctx.fillStyle = COLOR_WALL
                    ctx.fillRect(j * WIDTH, i * HEIGHT, WIDTH, HEIGHT);
                    break
                case 1:
                    ctx.fillStyle = COLOR_ROAD
                    ctx.fillRect(j * WIDTH, i * HEIGHT, WIDTH, HEIGHT);
                    ctx.fillStyle = COLOR_BEAN
                    ctx.beginPath();
                    ctx.arc(WIDTH * j + 10, HEIGHT * i + 10, BEAN_RADIUS, 0, 2 * Math.PI, true);
                    ctx.fill();
                    break
                case 2 :
                    ctx.fillStyle = COLOR_ROAD
                    ctx.fillRect(j * WIDTH, i * HEIGHT, WIDTH, HEIGHT);
                    break
                case 9:
                    ctx.fillStyle = COLOR_ROAD
                    ctx.fillRect(j * WIDTH, i * HEIGHT, WIDTH, HEIGHT);
                    break
            }
        }
    }
}

function clearPacmanFootprint(x, y) {
    ctx.clearRect(x * WIDTH, y * HEIGHT, WIDTH, HEIGHT)
    ctx.fillStyle = "black"
    ctx.fillRect(x * WIDTH, y * HEIGHT, WIDTH, HEIGHT)
}

function clearGhostFootPrint(x, y) {
    ctx.clearRect(x * WIDTH, y * HEIGHT, WIDTH, HEIGHT)

    ctx.fillStyle = "black"
    ctx.fillRect(x * WIDTH, y * HEIGHT, WIDTH, HEIGHT)
    if (MAP[y * MAP_WIDTH + x] === BEAN_CODE) {
        ctx.fillStyle = COLOR_BEAN
        ctx.beginPath();
        ctx.arc(WIDTH * x + 10, HEIGHT * y + 10, BEAN_RADIUS, 0, 2 * Math.PI, true);
        ctx.fill();
    }

}


function canEatBean(x, y) {
    return MAP[y * MAP_WIDTH + x] === 1
}

function eatBean(x, y) {
    if (canEatBean(x, y)) {
        MAP[y * MAP_WIDTH + x] = 2
        pacman.setScore(score++)
    }
    clearPacmanFootprint(x, y)
}

function initCharacters() {
    pacman = new Pacman(startPacmanX, startPacmanY)
    ghost1 = new Ghost(ghost1X, ghost1Y, "red")
    pacman.draw()
    ghost1.draw()
}

function updateCanvas() {

    let x = pacman.getX(),
        y = pacman.getY(),
        g1X = ghost1.getX(),
        g1Y = ghost1.getY()

    if (g1X === x && g1Y === y) {
        debugger
        alert("ghost kill pacman")
    }

    clearPacmanFootprint(x, y)
    clearGhostFootPrint(g1X, g1Y)

    if (score === ALL_BEANS) {
        alert("win")
        return
    }
    eatBean(x, y)

    pacman.doSmartStep(x, y, g1X, g1Y)
    pacman.draw()
    debugger

    if (pacman.getX() === g1X && pacman.getY() === g1Y){

        alert("ghost kill pacman")
        debugger
    }
    debugger


    ghost1.doSmartStep(g1X, g1Y, x, y)
    ghost1.draw()
    debugger

}


function countDown() {
    setTimeout(function () {
        intervalID = setInterval(updateCanvas, timerDelay);
    }, 1000)
}

function run() {
    countDown()
}

function main() {
    fillADJ()
    drawMap()

    initCharacters()
    run()
}

main()
