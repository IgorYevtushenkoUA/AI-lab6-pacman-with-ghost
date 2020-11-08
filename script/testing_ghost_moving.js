import {findShortestDist_BFS} from "./algorithms/bfs.js";
import {MAP_HEIGHT, MAP_WIDTH} from "./data/constants.js";
import {BEAN_CODE} from "./data/constants.js";
import {Vertex} from "./graph/vertex.js";
import {MAP} from "./data/data_map.js";
import {adj, vertexes, fillADJ} from "./data/data_graphs.js";

fillADJ()


let map = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,2,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,2,1,1,1,1,1,1,1,2,2,2,2,2,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

let score = 0

function findNearestBean(pacmanX, packmanY, map) {
    let generation = 0
    let ceil = 1
    let isBean = false
    let allNeighbors = []
    let neighbors
    while (!isBean && ceil !== MAP_WIDTH) {
        generation++
        ceil += 2
        allNeighbors = findNeighbor(generation, ceil, pacmanX, packmanY)
        // знаходимо всі одиниці та видаляємо дублікати
        neighbors = [...new Set(allNeighbors.filter(item => MAP[item] === 1))]
        isBean = neighbors.length > 0
    }
    // return neighbors[neighbors.length - 1]
    return neighbors[0]
}

function findNearestBean2(pacmanX, pacmanY, map) {
    let generation = 0,
        ceil = 1,
        isBean = false,
        allNeighbors = [],
        neighbors
    // todo del && ceil !== MAP_WIDTH (we have score to know when finish)
    while (!isBean && ceil !== MAP_WIDTH) {
        generation++
        ceil += 2
        allNeighbors = findNeighbor(generation, ceil, pacmanX, pacmanY)
        // знаходимо всі одиниці та видаляємо дублікати
        neighbors = [...new Set(allNeighbors.filter(item => MAP[item] === 1))]
        isBean = neighbors.length > 0
    }
    console.log(neighbors)
    let bean_weight = countBeanWeight(pacmanX, pacmanY, neighbors)
    let best_bean_position = Array.from(sortMap(bean_weight))
    return best_bean_position[0][0]
}

function findNeighbor(generation, ceil, posX, posY) {
    function hasLeftNeighbors() {
        return (posX - generation) >= 0
    }

    function hasRightNeighbors() {
        return (posX - generation) <= MAP_WIDTH
    }

    function hasTopNeighbors() {
        return (posY - generation) >= 0
    }

    function hasBottomNeighbors() {
        return (posY - generation) <= MAP_HEIGHT
    }

    function getLeftNeighbors() {
        let neighbors = []

        if (hasLeftNeighbors()) {
            let x = posX - generation
            for (let y = posY - (ceil - 1) / 2, c = 0; c++ < ceil; y++) {
                if (y < 0) continue

                let currentCeilNumber = y * MAP_WIDTH + x
                neighbors.push(currentCeilNumber)
            }
        }
        return neighbors
    }

    function getRightNeighbors() {
        let neighbors = []
        if (hasRightNeighbors()) {
            let x = posX + generation
            for (let y = posY - (ceil - 1) / 2, c = 0; c++ < ceil; y++) {
                if (y < 0) continue

                let currentCeilNumber = y * MAP_WIDTH + x
                neighbors.push(currentCeilNumber)
            }
        }
        return neighbors
    }

    function getBottomNeighbors() {
        let neighbors = []
        if (hasBottomNeighbors()) {
            let y = posY + generation
            for (let x = posX - (ceil - 1) / 2, c = 0; c++ < ceil; x++) {
                if (x < 0) continue

                let currentCeilNumber = y * MAP_WIDTH + x
                neighbors.push(currentCeilNumber)
            }
        }
        return neighbors
    }

    function getTopNeighbors() {
        let neighbors = []
        if (hasTopNeighbors()) {
            let y = posY - generation
            for (let x = posX - (ceil - 1) / 2, c = 0; c++ < ceil; x++) {
                if (x < 0) continue

                let currentCeilNumber = y * MAP_WIDTH + x
                neighbors.push(currentCeilNumber)
            }
        }
        return neighbors
    }

    // top - right - bottom - left
    let neighbors =
        getTopNeighbors()
            .concat(getRightNeighbors()
                .concat(getBottomNeighbors()
                    .concat(getLeftNeighbors())))

    return neighbors
}


function heuristic(x, y, x2, y2) {
    return Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2))
}

function countBeanWeight(pacmanX, pacmanY, neighbors) {
    let neighbor_weight = new Map()
    for (let i = 0; i < neighbors.length; i++) {
        let beanCoordination = getBEANCoordinationByMapPositions(neighbors[i]),
            beanX = beanCoordination[0],
            beanY = beanCoordination[1],
            val = -1 * heuristic(pacmanX, pacmanY, beanX, beanY)

        if (isOneLineY(pacmanX, beanX) || isOneLineX(pacmanY, beanY)) val++

        neighbor_weight.set(neighbors[i], val)
    }
    return neighbor_weight
}

function getBEANCoordinationByMapPositions(index) {
    let y = Math.floor(index / MAP_WIDTH)
    let x = index - (y * MAP_WIDTH)
    return [x, y]
}

function isOneLineY(pacX, beanX) {
    return pacX === beanX
}

function isOneLineX(pacY, beanY) {
    return pacY === beanY
}

function sortMap(map) {
    map[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    }
    return map
}

console.log(findNearestBean(55, 1, map))
console.log(findNearestBean2(55, 1, map))
console.log(getBEANCoordinationByMapPositions(114))
