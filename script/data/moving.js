import {MAP_HEIGHT, MAP_WIDTH} from "./constants.js";
import {MAP} from "./data_map.js";
import {adj, vertexes} from "./data_graphs.js";
import {findShortestDist_BFS} from "../algorithms/bfs.js";

/**
 * зробити один крок
 * @param side
 * @param x
 * @param y
 */
export function doOneStep(side, x, y) {

    let newX, newY

    switch (side) {
        case "TOP" :
            newX = x
            newY = y - 1
            break
        case "RIGHT" :
            newX = x + 1
            newY = y
            break
        case "BOTTOM" :
            newX = x
            newY = y + 1
            break
        case "LEFT" :
            newX = x - 1
            newY = y
            break
    }
    return [newX, newY]
}

export function isSamePaths(p1, p2) {
    if (p1.length !== p2.length) return false
    for (let i = 0; i < p1.length; i++)
        if (!isEqualVertexes(p1[i], p2[i])) return false
    return true
}

export function isEqualVertexes(v1, v2) {
    return v1.getY() === v2.getY() && v1.getX() === v2.getX()
}

/**
 *
 * @param {nubmer} x
 * @param {nubmer} y
 * @param {Vertex} v2
 * @returns {string}
 */
export function getDirFromVertex1ToVertex2(x, y, v2) {
    let dir = ""
    if (x < v2.getX())
        dir = "RIGHT"
    else if (x > v2.getX())
        dir = "LEFT"
    else if (y > v2.getY())
        dir = "TOP"
    else if (y < v2.getY())
        dir = "BOTTOM"
    return dir
}

/**
 * відстань від координат до Вершини
 * @param {number} x
 * @param {number} y
 * @param {Vertex} vertex
 */
export function getDistanceToVertex(x, y, vertex) {
    if (isOneLineX(y, vertex.getY()))
        return Math.abs(x - vertex.getX())
    return Math.abs(y - vertex.getY())
}

/**
 * чи є бар'єри між позицією пакмена та БІНА (КРЕКЕРА)
 * @param pacX
 * @param pacY
 * @param beanX
 * @param beanY
 * @returns {[boolean]}
 */
export function hasNotWallBetweenPacmanAndBean(pacX, pacY, beanX, beanY) {
    let res = [false]
    if (isOneLineX(pacY, beanY)) {
        let x1 = Math.min(pacX, beanX)
        let x2 = Math.max(pacX, beanX)

        res = [true, true, false]

        for (let i = x1; i < x2; i++) {
            let index = pacY * MAP_WIDTH + i
            if (MAP[index] === 0)
                res = [false]
        }
    } else if (isOneLineY(pacX, beanX)) {
        let y1 = Math.min(pacY, beanY)
        let y2 = Math.max(pacY, beanY)

        res = [true, false, true]

        for (let i = y1; i < y2; i++) {
            let index = i * MAP_WIDTH + pacX
            if (MAP[index] === 0)
                res = [false]
        }
    }
    return res
}

export function isOneLineY(pacX, beanX) {
    return pacX === beanX
}

export function isOneLineX(pacY, beanY) {
    return pacY === beanY
}

//1) Знайти найближчий крекер
/**
 * шукає найближчий доступний КРЕКЕР навколо себе
 *      ***
 *      *0*
 *      ***
 * @param pacmanX
 * @param pacmanY
 * @param map
 * @returns {*}
 */
export function findNearestBean(pacmanX, pacmanY, map) {
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

    let bean_weight = countBeanWeight(pacmanX, pacmanY, neighbors)
    let best_bean_position = Array.from(sortMap(bean_weight))

    return best_bean_position[0][0]
}

/**
 * рахує відстань від А до Б
 * @param x
 * @param y
 * @param x2
 * @param y2
 * @returns {number}
 */
export function heuristic(x, y, x2, y2) {
    return Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2))
}

/**
 * рахує вагу ккожного БІНА (КРЕКЕРА)
 * @param pacmanX
 * @param pacmanY
 * @param neighbors
 * @returns {Map<any, any>}
 */
export function countBeanWeight(pacmanX, pacmanY, neighbors) {
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

/**
 * сортує МАП
 * @param map
 * @returns {*}
 */
export function sortMap(map) {
    map[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    }
    return map
}

/**
 * отримати із індекса координати
 * @param index
 * @returns {(number)[]}
 */
export function getBEANCoordinationByMapPositions(index) {
    let y = Math.floor(index / MAP_WIDTH)
    let x = index - (y * MAP_WIDTH)
    return [x, y]
}

/**
 * повертає всіх сусидів залежно від покоління пошуку
 * @param generation
 * @param ceil
 * @param posX
 * @param posY
 * @returns {unknown[]}
 */
export function findNeighbor(generation, ceil, posX, posY) {
    function hasLeftNeighbors() {
        return (posX - generation) > 0
    }

    function hasRightNeighbors() {
        return (posX + generation) < MAP_WIDTH
    }

    function hasTopNeighbors() {
        return (posY - generation) > 0
    }

    function hasBottomNeighbors() {
        return (posY + generation) < MAP_HEIGHT
    }

    function getLeftNeighbors() {
        let neighbors = []

        if (hasLeftNeighbors()) {
            let x = posX - generation
            for (let y = posY - (ceil - 1) / 2, c = 0; c++ < ceil; y++) {
                if (y < 0 || y >= MAP_HEIGHT) continue

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
                if (y < 0 || y >= MAP_HEIGHT) continue

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
                if (x < 0 || x >= MAP_WIDTH) continue

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
                if (x < 0 || x >= MAP_WIDTH) continue

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

export function getVertexesByPosition(posX, posY) {
    // перевірити спочатку всі вершини
    for (let i = 0; i < vertexes.length; i++) {
        let currV = vertexes[i]
        if (isStayInVertexTop(posX, posY, currV)) {
            return [currV]
        }
    }
    // перевірити всершини - вершин (тобто всі ті вершини, що належать вершині А)
    for (let i = 0; i < adj.length; i++) {
        let currV = vertexes[i]
        // todo del this if
        if (isStayInVertexTop(posX, posY, currV)) {
            return [currV]
        }

        for (let j = 0; j < adj[i].length; j++) {
            let tempV = adj[i][j]
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
export function isStayInVertexTop(posX, posY, vertex) {
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
export function stayBetweenVertexes(posX, posY, vertex1, vertex2) {
        let x1 = vertex1.getX(),
            y1 = vertex1.getY(),
            x2 = vertex2.getX(),
            y2 = vertex2.getY(),
            maxX = Math.max(x1, x2),
            minX = Math.min(x1, x2),
            maxY = Math.max(y1, y2),
            minY = Math.min(y1, y2)

        return (posX <= maxX && posX >= minX) && (posY <= maxY && posY >= minY) && ((posX === x1 || posX === x2) || (posY === y1 || posY === y2))
}

/**
 *
 * @param {Vertex} vertex
 */
export function getIndexByVertexName(vertex) {

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

export function findAllPathFromSourceToDestination(s, dest, isVisited, allPath, prefix) {
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
