import {findShortestDist_BFS} from "./algorithms/bfs.js";
import {MAP_HEIGHT, MAP_WIDTH} from "./data/constants.js";
import {BEAN_CODE} from "./data/constants.js";
import {Vertex} from "./graph/vertex.js";
import {MAP} from "./data/data_map.js";
import {adj, vertexes, fillADJ} from "./data/data_graphs.js";


fillADJ()

let score = 0
for (let i = 0; i < MAP.length; i++) {
    if (MAP[i] === 1) score++
}

function packmanMove(posX, posY) {
    let nextBean = findNearestBean()
}

//1) Знайти найближчий крекер

/**
 * шукає найближчий доступний КРЕКЕР навколо себе
 *      ***
 *      *0*
 *      ***
 * @param pacmanX
 * @param packmanY
 * @param map
 * @returns {*}
 */
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

    function findTheBestBeanLocation(){
        let neighbor_weight = {}
        for (let i = 0 ; i < neighbors.length; i++){
        }


    }


    // return neighbors[neighbors.length - 1]
    return neighbors[0]
}

function getCoordinationByMapPositions(index) {
    let y = Math.floor(index / MAP_WIDTH)
    let x = index - (y * MAP_WIDTH)
    return [x, y]
}
console.log(MAP[61])

console.log(findNearestBean(2, 1, MAP))

/**
 * повертає всіх сусидів залежно від покоління пошуку
 * @param generation
 * @param ceil
 * @param posX
 * @param posY
 * @returns {unknown[]}
 */
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

//2) Побудувати шлях до крекеру

function getYourVertexes(posX, posY) {

    for (let i = 0; i < adj.length; i++) {
        let currV = vertexes[0]
        if (stayInVertexTop(posX, posX, currV)) {
            return currV
        }

        for (let j = 0; j < adj[i].length; j++) {
            let tempV = adj[i]
            if (stayBetweenVertexes(posX, posY, currV, tempV)) {
                return [currV, tempV]
            }
        }
    }
}

/**
 * перевіряємо чи ОБ'ЄКТ стоїть на вершині (на перехресті доріг)
 * @param {number} posX
 * @param {number} posY
 * @param {Vertex} vertex
 */
function stayInVertexTop(posX, posY, vertex) {
    let x = vertex.getX(),
        y = vertex.getY()
    return x === posX && y === posY
}

/**
 * перевіряємо чи ОБ'ЄКТ стоїть між вершинами А ти Б
 * @param {number} posX
 * @param {number} posY
 * @param {Vertex} vertex1
 * @param {Vertex} vertex2
 */
function stayBetweenVertexes(posX, posY, vertex1, vertex2) {
    let x1 = vertex1.getX(),
        y1 = vertex1.getY(),
        x2 = vertex2.getX(),
        y2 = vertex2.getY(),
        maxX = Math.max(x1, x2),
        minX = Math.min(x1, x2),
        maxY = Math.max(y1, y2),
        minY = Math.min(y1, y2)
    return (posX <= maxX && posX >= minX) && (posY <= maxY && posY >= minY)
}


/**
 *
 * @param {Vertex} vertex
 */
function getIndexByVertexName(vertex) {

    let letter = vertex.getName()[0],
        number = vertex.getName()[1]
    switch (letter) {
        case "A" :
            return parseInt(number)
        case "B" :
            return 10 + parseInt(number)
        case "C" :
            return 20 + parseInt(number)
        case "D" :
            return 30 + parseInt(number)
        case "E" :
            return 40 + parseInt(number)
        case "F" :
            return 50 + parseInt(number)
    }

}

function findAllPathFromSourceToDestination(s, dest, isVisited, allPath, prefix) {
    let bfs_path = findShortestDist_BFS(adj, s, dest, vertexes.length)
    allPath.push(prefix.concat(bfs_path))
    isVisited[getIndexByVertexName(s)] = true
    isVisited[getIndexByVertexName(dest)] = true
    prefix.push(s)

    for (let i = 0; i < bfs_path.length; i++) {
        let vertexIndex = getIndexByVertexName(bfs_path[i])

        for (let j = 0; j < adj[vertexIndex].length; j++) {
            let tempVertex = getIndexByVertexName(adj[vertexIndex][j])

            if (isVisited[tempVertex] === false) {
                let newSource = adj[vertexIndex][j]
                findAllPathFromSourceToDestination(newSource, dest, isVisited, allPath, prefix)
                prefix.pop()
            }
        }
    }
    return allPath
}


// let isVisited = []
// for (let i = 0; i < vertexes.length; i++) isVisited[i] = false
// console.log(findAllPathFromSourceToDestination(vertexes[0], vertexes[3], isVisited, [], []));


/**
 *
 * @param {Vertex} v1
 * @param {Vertex} v2
 */
function isEqualVertexes(v1, v2) {
    // console.log("\n")
    // console.log(v1)
    // console.log(v2)
    return v1.getY() === v2.getY() && v1.getX() === v2.getX()
}

// getYourVertex()

/**
 * Інструкція для пакмена
 * 1) Знайти найближчий крекер
 * 2) Побудувати шлях до крекеру
 * 3) Вибрати найкращий шлях
 * 4) анімація поїдання та всього іншого
 *
 *
 * Інструкція длля привида
 * 1) знайти пакмена
 * 2) дійти до кінця вершини
 * 3) побудувати шлях до пакмена із своєї вершини до вершини де він знаходиться
 * 4) Якось мінімізувати все
 *
 *
 * Проблеми
 * як знайти сі можливі варіанти дійти з точки А до точки Б
 * як порахувати ефективність шляху
 * як зробити анімацію
 */









