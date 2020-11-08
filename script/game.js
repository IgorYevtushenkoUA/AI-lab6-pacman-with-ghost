import {BEAN_RADIUS, HEIGHT, MAP_HEIGHT, MAP_WIDTH, WIDTH} from "./data/constants.js";
import {COLOR_BEAN, COLOR_ROAD, COLOR_WALL} from "./data/constants.js";
import {adj, vertexes, fillADJ} from "./data/data_graphs.js";
import {Pacman} from "./characters/pacman.js";
import {MAP} from "./data/data_map.js";

export let ctx = document.getElementById('pacman_game').getContext("2d")

//   x * WIDTH + 11, y * WIDTH + 10
let startPacmanX = 2, startPacmanY = 1,
    score = 0,
    timerDelay = 300,
    intervalID,
    pacman


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

function canEatBean(x, y) {
    return MAP[y * MAP_WIDTH + x] === 1
}

function eatBean(x, y) {
    if (canEatBean(x, y)) {
        MAP[y * MAP_WIDTH + x] = 2
        score++
    }
    clearPacmanFootprint(x, y)
}

function initCharacters() {
    pacman = new Pacman(startPacmanX, startPacmanY)
    pacman.draw()
}

function updateCanvas() {

    let x = pacman.getX(),
        y = pacman.getY()
    clearPacmanFootprint(x, y)


    // pacman.doOneStep("RIGHT", x, y)
    pacman.doSmartStep(x, y)
    pacman.draw()
    debugger
    eatBean(x, y)

    alert(score)
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
