import {Vertex} from "./graph/vertex.js";

let map_copy = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
    0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]
let adj = []
let vertexes = [
    //A
    new Vertex("A0", 0, 0, 0),
    new Vertex("A1", 0, 3, 1),
    new Vertex("A2", 4, 3, 2),
    new Vertex("A3", 4, 0, 3),
    new Vertex("A4", 14, 0, 4),
    new Vertex("A5", 14, 3, 5),
    new Vertex("A6", 14, 4, 6),
    new Vertex("A7", 8, 4, 7),
    new Vertex("A8", 8, 7, 8),
    new Vertex("A9", 10, 7, 9),
    //B
    new Vertex("B0", 30, 0, 10),
    new Vertex("B1", 30, 3, 11),
    new Vertex("B2", 22, 3, 12),
    new Vertex("B3", 22, 11, 13),
    new Vertex("B4", 19, 11, 14),
    new Vertex("B5", 16, 11, 15),
    new Vertex("B6", 14, 11, 16),
    new Vertex("B7", 5, 11, 17),
    new Vertex("B8", 4, 11, 18),
    new Vertex("B9", 0, 11, 19),
    //C
    new Vertex("C0", 0, 14, 20),
    new Vertex("C1", 5, 14, 21),
    new Vertex("C2", 16, 14, 22),
    new Vertex("C3", 19, 14, 23),
    new Vertex("C4", 30, 14, 24),
    new Vertex("C5", 30, 12, 25),
    new Vertex("C6", 30, 11, 26),
    new Vertex("C7", 33, 12, 27),
    new Vertex("C8", 33, 14, 28),
    new Vertex("C9", 36, 14, 29),
    //D
    new Vertex("D0", 36, 12, 30),
    new Vertex("D1", 39, 12, 31),
    new Vertex("D2", 39, 11, 32),
    new Vertex("D3", 39, 14, 33),
    new Vertex("D4", 49, 14, 34),
    new Vertex("D5", 55, 14, 35),
    new Vertex("D6", 55, 11, 36),
    new Vertex("D7", 51, 11, 37),
    new Vertex("D8", 49, 11, 38),
    new Vertex("D9", 43, 11, 39),
    //E
    new Vertex("E0", 43, 3, 40),
    new Vertex("E1", 43, 0, 41),
    new Vertex("E2", 49, 0, 42),
    new Vertex("E3", 55, 0, 43),
    new Vertex("E4", 55, 3, 44),
    new Vertex("E5", 51, 3, 45),
    new Vertex("E6", 49, 3, 46),
    new Vertex("E7", 51, 8, 47),
    new Vertex("E8", 47, 8, 48),
    new Vertex("E9", 39, 0, 49),
    //F
    new Vertex("F0", 39, 3, 50),
    new Vertex("F1", 39, 9, 51),
    new Vertex("F2", 30, 9, 52),
]

function addEdge(adj, a, b) {
    adj[a.getID()].push(b)
    adj[b.getID()].push(a)
}

function fillADJ() {
    for (let i = 0; i < vertexes.length; i++) {
        adj.push([])
    }
    addEdge(adj, vertexes[0], vertexes[1])
    addEdge(adj, vertexes[0], vertexes[3])
    addEdge(adj, vertexes[1], vertexes[2])
    addEdge(adj, vertexes[3], vertexes[4])
    addEdge(adj, vertexes[3], vertexes[2])
    addEdge(adj, vertexes[4], vertexes[5])
    addEdge(adj, vertexes[4], vertexes[10])
    addEdge(adj, vertexes[2], vertexes[18])
    addEdge(adj, vertexes[18], vertexes[17])
    addEdge(adj, vertexes[18], vertexes[19])
    addEdge(adj, vertexes[19], vertexes[20])
    addEdge(adj, vertexes[20], vertexes[21])
    addEdge(adj, vertexes[21], vertexes[17])
    addEdge(adj, vertexes[17], vertexes[16])
    addEdge(adj, vertexes[16], vertexes[15])
    addEdge(adj, vertexes[16], vertexes[6])
    addEdge(adj, vertexes[5], vertexes[6])
    addEdge(adj, vertexes[6], vertexes[7])
    addEdge(adj, vertexes[7], vertexes[8])
    addEdge(adj, vertexes[8], vertexes[9])
    addEdge(adj, vertexes[15], vertexes[14])
    addEdge(adj, vertexes[14], vertexes[23])
    addEdge(adj, vertexes[14], vertexes[13])
    addEdge(adj, vertexes[21], vertexes[22])
    addEdge(adj, vertexes[22], vertexes[15])
    addEdge(adj, vertexes[10], vertexes[49])
    addEdge(adj, vertexes[10], vertexes[11])
    addEdge(adj, vertexes[11], vertexes[12])
    addEdge(adj, vertexes[12], vertexes[5])
    addEdge(adj, vertexes[12], vertexes[13])
    addEdge(adj, vertexes[13], vertexes[26])
    addEdge(adj, vertexes[23], vertexes[24])
    addEdge(adj, vertexes[24], vertexes[25])
    addEdge(adj, vertexes[25], vertexes[26])
    addEdge(adj, vertexes[25], vertexes[27])
    addEdge(adj, vertexes[27], vertexes[28])
    addEdge(adj, vertexes[28], vertexes[29])
    addEdge(adj, vertexes[29], vertexes[30])
    addEdge(adj, vertexes[30], vertexes[31])
    addEdge(adj, vertexes[32], vertexes[31])
    addEdge(adj, vertexes[31], vertexes[33])
    addEdge(adj, vertexes[33], vertexes[34])
    addEdge(adj, vertexes[34], vertexes[35])
    addEdge(adj, vertexes[34], vertexes[38])
    addEdge(adj, vertexes[35], vertexes[36])
    addEdge(adj, vertexes[36], vertexes[37])
    addEdge(adj, vertexes[37], vertexes[38])
    addEdge(adj, vertexes[37], vertexes[47])
    addEdge(adj, vertexes[47], vertexes[48])
    addEdge(adj, vertexes[47], vertexes[45])
    addEdge(adj, vertexes[45], vertexes[44])
    addEdge(adj, vertexes[45], vertexes[46])
    addEdge(adj, vertexes[44], vertexes[43])
    addEdge(adj, vertexes[43], vertexes[42])
    addEdge(adj, vertexes[42], vertexes[46])
    addEdge(adj, vertexes[41], vertexes[42])
    addEdge(adj, vertexes[49], vertexes[41])
    addEdge(adj, vertexes[41], vertexes[40])
    addEdge(adj, vertexes[40], vertexes[46])
    addEdge(adj, vertexes[40], vertexes[39])
    addEdge(adj, vertexes[39], vertexes[38])
    addEdge(adj, vertexes[39], vertexes[32])
    addEdge(adj, vertexes[11], vertexes[50])
    addEdge(adj, vertexes[50], vertexes[49])
    addEdge(adj, vertexes[11], vertexes[52])
    addEdge(adj, vertexes[52], vertexes[26])
    addEdge(adj, vertexes[52], vertexes[51])
    addEdge(adj, vertexes[51], vertexes[32])
    addEdge(adj, vertexes[50], vertexes[51])
}

fillADJ()


const WIDTH = 58
const HEIGHT = 17
const BEAN = 1

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
    let neighbors = []
    while (!isBean && ceil !== WIDTH) {
        generation++
        ceil += 2
        neighbors = findNeighbor(generation, ceil, pacmanX, packmanY)
        while (neighbors.length > 0) {
            if (map[neighbors[neighbors.length - 1]] === BEAN) {
                isBean = true
                break
            }
            neighbors.pop()
        }
    }
    return neighbors[neighbors.length - 1]
}

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
        return (posX - generation) <= WIDTH
    }

    function hasTopNeighbors() {
        return (posY - generation) >= 0
    }

    function hasBottomNeighbors() {
        return (posY - generation) <= HEIGHT
    }

    function getLeftNeighbors() {
        let neighbors = []

        if (hasLeftNeighbors()) {
            let x = posX - generation
            for (let y = posY - (ceil - 1) / 2, c = 0; c++ < ceil; y++) {
                if (y < 0) continue

                let currentCeilNumber = y * WIDTH + x
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

                let currentCeilNumber = y * WIDTH + x
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

                let currentCeilNumber = y * WIDTH + x
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

                let currentCeilNumber = y * WIDTH + x
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


console.log(stayBetweenVertexes(1, 4, vertexes[0], vertexes[3]));

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









