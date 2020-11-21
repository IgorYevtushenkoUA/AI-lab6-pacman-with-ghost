import {MAP_HEIGHT, MAP_WIDTH, SAFE_NUM_OF_STEPS, BEAN_CODE} from "./constants.js";
import {MAP} from "./data_map.js";
import {adj, vertexes, fillADJ} from "./data_graphs.js";
import {findShortestDist_BFS} from "../algorithms/bfs.js";

/*
todo можливо дописати позицыю СТОП до варыантыв повороту (вправо вліво)
todo зробити універсальний поворот (бо в мене є свіча із поворотами (вершина вершина та інші) просто один метод яки залежно від того які там дані буде брати координати та все змінювати)
todo
 */

fillADJ() // дублює дані - потрібно лише для тесту

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
        case "STOP" :
            newX = x
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
 * @param {Vertex} v1
 * @param {Vertex} v2
 * @returns {string}
 */
export function getDirFromVertex1ToVertex2(v1, v2) {
    // try {
    let dir = ""
    if (v1.getX() < v2.getX())
        dir = "RIGHT"
    else if (v1.getX() > v2.getX())
        dir = "LEFT"
    else if (v1.getY() > v2.getY())
        dir = "TOP"
    else if (v1.getY() < v2.getY())
        dir = "BOTTOM"
    else {
        dir = "STOP"
    }
    return dir
}

export function getDirFromPosition1ToPosition2(x1, y1, x2, y2) {
    let dir = ""
    if (x1 < x2)
        dir = "RIGHT"
    else if (x1 > x2)
        dir = "LEFT"
    else if (y1 > y2)
        dir = "TOP"
    else if (y1 < y2)
        dir = "BOTTOM"
    else {
        dir = "STOP"
    }
    return dir
}

export function getDirFromPosition1ToVertex2(x, y, v) {
    try {
        let dir = ""
        if (x < v.getX()) dir = "RIGHT"
        else if (x > v.getX()) dir = "LEFT"
        else if (y > v.getY()) dir = "TOP"
        else if (y < v.getY()) dir = "BOTTOM"
        else {
            dir = "STOP"
        }
        return dir
    } catch (e) {
        alert("getDirFromPosition1ToVertex2")

    }

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

/**
 * цей метод для перевірки чи вершини не однакові та чи вони не з'єднані
 * @param {Vertex} v1
 * @param {Vertex} v2
 */
export function isStayInOneLine(v1, v2) {
    let indexV = getIndexByVertexName(v1)
    return adj[indexV].includes(v2)
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
        neighbors = [...new Set(allNeighbors.filter(item => MAP[item] === BEAN_CODE))]
        isBean = neighbors.length > 0
    }

    let bean_weight = countBeanWeight(pacmanX, pacmanY, neighbors)
    let best_bean_position = Array.from(sortMap(bean_weight))

    return best_bean_position[0][0]
}

/**
 * метод шукаає найдільший біпер від позиції пакмена
 * цей метод потібен коли пікмен тікає ---
 * пакмен будує шлях до найдільшого біпера, лише коли тікає
 * @param {number} x - position by x
 * @param {number} y - position by y
 * @param {[number]} map - game map
 * @returns {number} - position of bean in the MAP
 */
export function findFarthestBean(x, y, map) {
    let generation = 0,
        isBean = false,
        allNeighbors = [],
        neighbors

    while (!isBean) {
        generation++
        allNeighbors = findNeighborsByGenerationLine(generation, map)
        neighbors = [...new Set(allNeighbors.filter(item => MAP[item] === BEAN_CODE))]
        isBean = neighbors.length > 0
    }
    return neighbors[0]
}

/**
 * цей метод шукає найближчі біпери за боковими лініями
 * @param generation
 * @param map
 * @returns {*[]}
 */
function findNeighborsByGenerationLine(generation, map) {
    function getElementsLEFT() {
        let elements = []
        for (let i = generation; i < map.length; i += MAP_WIDTH) {
            elements.push(i)
        }
        return elements
    }

    function getElementsRIGHT() {
        let elements = []
        for (let i = MAP_WIDTH - generation - 1; i < map.length; i += MAP_WIDTH) {
            elements.push(i)
        }
        return elements
    }

    function getElementsTOP() {
        let elements = []
        for (let i = generation * MAP_WIDTH; i < MAP_WIDTH * (generation + 1); i += 1) {
            elements.push(i)
        }
        return elements
    }

    function getElementsBOTTOM() {
        let elements = []
        for (let i = (MAP_HEIGHT - generation) * MAP_WIDTH; i < MAP_WIDTH * ((MAP_HEIGHT - generation) + 1); i += 1) {
            elements.push(i)
        }
        return elements
    }


    return getElementsTOP().concat(
        getElementsRIGHT().concat(
            getElementsBOTTOM().concat(
                getElementsLEFT())))
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

function heuristicVertex(vertexA, vertexB) {
    return Math.sqrt(Math.pow(vertexA.getX() - vertexB.getX(), 2) + Math.pow(vertexA.getY() - vertexB.getY(), 2))
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
        if (isPositionOnVertex(posX, posY, currV)) {
            return [currV]
        }
    }
    // перевірити всершини - вершин (тобто всі ті вершини, що належать вершині А)
    for (let i = 0; i < adj.length; i++) {
        let currV = vertexes[i]
        // todo del this if
        if (isPositionOnVertex(posX, posY, currV)) {
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
 *
 * @param x
 * @param y
 * @param vertex
 * @returns {Vertex}
 */
export function getNearestVertex(x, y, vertex) {
    try {
        if (vertex.length === 1) return vertex[0]

        return getDistanceToVertex(x, y, vertex[0]) <= getDistanceToVertex(x, y, vertex[1])
            ? vertex[0]
            : vertex[1]

    } catch (e) {

    }
}

/**
 * перевіряємо чи ОБ'ЄКТ стоїть на вершині (на перехресті доріг)
 * @param {number} posX
 * @param {number} posY
 * @param {Vertex} vertex
 */
function isPositionOnVertex(posX, posY, vertex) {
    let x = vertex.getX(),
        y = vertex.getY()
    return x === posX && y === posY
}

/**
 *
 * @param x
 * @param y
 * @returns {(boolean|Vertex)[]|boolean[]}
 */
function isStayOnVertexTop(x, y) {
    for (let i = 0; i < vertexes.length; i++) {
        let currV = vertexes[i]
        if (isPositionOnVertex(x, y, currV)) {
            return [true, currV]
        }
    }
    return [false]
}


/**
 * повертає вершину на якій ви знаходитеся
 * @param {number} x
 * @param {number} y
 * @returns {undefined|Vertex}
 */
export function getVertexByPosition(x, y) {
    for (let i = 0; i < vertexes.length; i++)
        if (vertexes[i].getX() === x && vertexes[i].getY() === y)
            return vertexes[i]
    return undefined
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

    // роблю це бо  останній елемент просто вертекс а не масив і через це помилки вилітають
    return allPath
}

/**
 * знаходидь мінімаксний шлях
 * @param s
 * @param dest
 * @param ghost1V
 * @returns {*[]|*}
 */
export function findMimimaxPath(s, dest, ghost1V) {
    if (adj[s.getID()].includes(dest)) {
        return [[s, dest], 1]
    } else {
        let allPath = [...getAllPath(s, dest)]
        allPath = allPath.filter(path => path.length > 1)
        allPath = delRepeatedVertex(allPath)
        allPath = delDangerPath(allPath, ghost1V)
        let path_map = buildPathMap(s)
        path_map = countAllPathWeight(path_map, allPath, ghost1V)
        let minPath = findMinPath(path_map)
        let minMAXPath = findMaxOfMinPath(minPath)
        return minMAXPath
    }
}

function delRepeatedVertex(path) {
    let cleanPath = []
    for (let i = 0; i < path.length; i++) {
        if (path[i].length === (new Set(path[i])).size) {
            cleanPath.push(path[i])
        }
    }
    return cleanPath
}

function delDangerPath(path, ghostV) {
    let newPath = []
    for (let i = 0; i < path.length; i++) {
        let safePath = true
        for (let j = 0; j < ghostV.length; j++) {
            if (path[i].includes(ghostV[0])) {
                safePath = false
            }
        }
        if (safePath)
            newPath.push(path[i])
    }
    return newPath
}


/**
 * знаходить всі можливі шляхи із точки А в точку Б (інколи там є повтори типу А-Б-В-Б-Д)todo виправити це
 * @param s
 * @param dest
 * @returns {[]}
 */
function getAllPath(s, dest) {

    let isVisited = []
    let allPath = []

    let allNeighbor = []

    for (let i = 0; i < adj[s.getID()].length; i++) {
        allNeighbor.push(adj[s.getID()][i])
    }

    let index = adj[s.getID()].length
    for (let i = 0; i < index; i++) {
        let path = [s]

        for (let j = 0; j < vertexes.length; j++) isVisited[j] = false
        isVisited[s.getID()] = true

        findAllPathFromSourceToDestination(adj[s.getID()][i], dest, isVisited, path, [s])
        path.shift()

        Array.prototype.push.apply(allPath, path)
    }

    return allPath
}

/**
 * будує "ДЕРЕВО(MAP)-ШЛЯХІВ" із з'єднаннь головного графу
 * Приклад : є вершина А, яка з'єднана із Б,В,Г,Д
 * це значить що наше "дерево" містить три листки
 * дерево* - це абстрактне поняття - не те дерево що поістинні вважається деревом в програмування
 * @param source
 * @returns {Map<any, any>}
 */
function buildPathMap(source) {
    let path_map = new Map()
    let index = getIndexByVertexName(source)
    for (let i = 0; i < adj[index].length; i++) {
        path_map.set(adj[index][i].getName(), [])
    }
    return path_map
}

/**
 * рахує вагу шляху
 * # кількість розгалужень(звёяхкыв) кожноъ вершини
 * # чи не пересікається вершина із привидом (якщо ні то нічого, якщо так то шлях стає від'ємним)
 * ---- МІНУСИ ----
 * не враховується у пересіканні із привидом через скільки кроків пересічеться,
 * та якщо пакмен буде на тій(небезпечній вершині) чи буде там сам привид
 * @param path_map
 * @param allPath
 * @param ghost1V
 * @returns {*}
 */
function countAllPathWeight(path_map, allPath, ghost1V) {
    try {
        allPath = allPath.filter(item => item.length > 1)
        for (let i = 0; i < allPath.length; i++) {
            let v2 = allPath[i][1]
            let path_weight = countPathWeight(allPath[i], ghost1V)
            let oldVal = path_map.get(v2.getName())
            oldVal.push([allPath[i], path_weight])
            oldVal.push([allPath[i], path_weight])
            path_map.set(v2.getName(), oldVal)
        }
        return path_map
    } catch (e) {
        alert("Uncaught TypeError: Cannot read property 'getName' of undefined")

    }

}

/**
 *
 * @param {Vertex[]} path
 * @param {Vertex[]} ghost1Path
 * по кількості можливих розгалуджень
 по шляху привида
 */
function countPathWeight(path, ghost1Path) {
    let weight = 0
    // кількість розгалуджень
    for (let i = 0; i < path.length; i++) {
        let index = getIndexByVertexName(path[i])
        weight += adj[index].length
    }
    // чи є спільний шлях із привидом, якщо так то цей варіант стає мінусовим - тобто непідходящим
    for (let i = 0; i < ghost1Path.length; i++) {
        if (path.includes(ghost1Path[i]))
            weight *= -1
    }

    // todo зробити перевірку хто швидше дійде до вершини пакмени чи привид (якщо однаково то видалити шлях якщо по різному то шлях норм напевно)

    return weight
}

/**
 *
 * @param path_map
 * @returns {[]}
 */
function findMinPath(path_map) {
    try {
        let minPaths = []
        let keys = Array.from(path_map.keys())
        // find min from positive agruments
        for (let k = 0; k < keys.length; k++) {
            let min = Number.MAX_SAFE_INTEGER
            let index = -1

            for (let i = 0; i < path_map.get(keys[k]).length; i++) {
                let obj = path_map.get(keys[k])[i]
                let w = obj[1]
                if (w > 0 && w < min) {
                    min = w
                    index = i
                }
            }
            if (index !== -1) minPaths.push(path_map.get(keys[k])[index])
        }
        // find min from negative arguments
        if (minPaths.length === 0) {
            for (let k = 0; k < keys.length; k++) {
                let min = 0
                let index = 0

                for (let i = 0; i < path_map.get(keys[k]).length; i++) {
                    let obj = path_map.get(keys[k])[i]
                    let w = obj[1]
                    if (w < min) {
                        min = w
                        index = i
                    }
                }
                minPaths.push(path_map.get(keys[k])[index])
            }
        }
        return minPaths
    } catch (e) {
        alert("findMinPath")

    }

}

/**
 *
 * @param minPaths
 * @returns {*}
 */
function findMaxOfMinPath(minPaths) {
    try {
        let max = minPaths[0]
        for (let i = 1; i < minPaths; i++) {
            if (minPaths[i][1] > max[1])
                max = minPaths[i]
        }
        return max
    } catch (e) {
        alert("error: findMaxOfMinPath(minPaths)")

    }

}

/** todo (bfsPathFromGhost2Pacman.length >= 3 && isSafeStep) - можливо і не потрібна бо по ідеї лише 7 кроків норм
 * перевіряє чи позиція ОБ'ЄКТА А - є безпечною
 * @param {number} characterX
 * @param {number} characterY
 * @param {[Vertex]}characterV
 * @param {Vertex} characterNearestV
 * @param {number} ghostX
 * @param {number} ghostY
 * @param {[Vertex]} ghostV
 * @param {Vertex} nearestGhostV
 * @returns {boolean}
 */
export function isSafePosition(characterX, characterY, characterV, characterNearestV, ghostX, ghostY, ghostV, nearestGhostV) {
    if (isEqualVertexes(characterNearestV, nearestGhostV))
        return false
    let bfsPathFromGhost2Pacman = findShortestDist_BFS(adj, nearestGhostV, characterNearestV, vertexes.length)

    let isSafeStep = isSafeStepsDistances(characterX, characterY, characterV, characterNearestV, ghostX, ghostY, ghostV, nearestGhostV, bfsPathFromGhost2Pacman)
    
    return (bfsPathFromGhost2Pacman.length >= 3 && isSafeStep) || isSafeStep
}

/**
 * перевіряє чи достатня кількість безпечних кроків між А та Б
 * @param {number} x
 * @param {number} y
 * @param {[Vertex]} v
 * @param {Vertex} nearestV
 * @param {number} x1
 * @param {number} y1
 * @param {[Vertex]} v2
 * @param {Vertex} nearestV2
 * @param {[Vertex]} path
 * @returns {boolean}
 */
function isSafeStepsDistances(x, y, v, nearestV, x1, y1, v2, nearestV2, path) {
    let stepDist = 0
    for (let i = 0; i < path.length - 1; i++) {
        stepDist += heuristicVertex(path[i], path[i + 1])
    }

    stepDist += characterDistanceToVertex(x, y, v, nearestV, path, path.length - 1, path.length - 2)
    stepDist += characterDistanceToVertex(x1, y1, v2, nearestV2, path, 0, 1)
    
    return stepDist >= SAFE_NUM_OF_STEPS
}

/**
 * рахує відстань у кроках до вершини
 * @param {number} x
 * @param {number}y
 * @param {[Vertex]} vertexes
 * @param {Vertex} nearestVertex
 * @param {[Vertex]} path
 * @param {number} i1
 * @param {number} i2
 * @returns {number}
 */
function characterDistanceToVertex(x, y, vertexes, nearestVertex, path, i1, i2) {
    if (vertexes.length === 1) return 0
    if (isEqualVertexes(vertexes[0], path[i1]) && isEqualVertexes(vertexes[1], path[i2])
        || isEqualVertexes(vertexes[0], path[i2]) && isEqualVertexes(vertexes[1], path[i1]))
        return -1 * heuristic(x, y, nearestVertex.getX(), nearestVertex.getY())
    return heuristic(x, y, nearestVertex.getX(), nearestVertex.getY())
}


/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} g1x
 * @param {number} g1y
 * @returns {number}
 */
function sumOfSteps(path, x, y, g1x, g1y) {

    let sum = 0
    for (let i = 0; i < path.length - 1; i++) {
        sum += heuristicVertex(path[i], path[i + 1])
    }

    sum -= heuristic(g1x, g1y, path[0].getX(), path[0].getY())
    sum -= heuristic(x, y, path[path.length - 1].getX(), path[path.length - 1].getY())

    alert("  | sum = " + sum)
    return sum
}

/** метод що формує шлях для утікання від привида
 * !!!!ВАЖЛИВО!!!! пакмен та привид ніколи не мають бути на одній вершині --- тоді алгоритм BFS - ламається
 * @param {Vertex} pacmanV
 * @param {Vertex} ghostV
 * @returns {[*]}
 */
export function pacmanRunAway(pacmanV, ghostV) {
    let path = [pacmanV], isVisited = []

    const DEEP_CONST = 3

    for (let i = 0; i < vertexes.length; i++)
        isVisited[i] = false

    isVisited[ghostV.getID()] = true
    isVisited[pacmanV.getID()] = true

    let deep = 1
    let mainVertex = pacmanV
    while (deep < DEEP_CONST && path.length > 0) {
        let wasAdded = false
        for (let i = 0; i < adj[mainVertex.getID()].length; i++) {
            let currentVertex = adj[mainVertex.getID()][i]
            if (currentVertex.getID() === ghostV.getID()) continue
            if (isVisited[currentVertex.getID()] === true) continue

            isVisited[currentVertex.getID()] = true
            path.push(currentVertex)
            deep++
            wasAdded = true
            i = 0
            mainVertex = currentVertex
            if (deep === DEEP_CONST) {
                return path
            }
        }
        if (!wasAdded) {
            // isVisited[mainVertex.getID()] = false
            path.pop()
            mainVertex = path[path.length - 1]
            deep--
        }
    }
    return path
}


// important!
export function countStepsToVertex(charX, charY, charV, charNearestV, distanceV, path) {
    if (path.length === 0) {

        return 0
    } else if (charV.length === 1) {

        return countStepsBetweenVertexes(charNearestV, distanceV, path)
    }
    // стою між двома вершинами шляху
    else if ((path[0].getName() === charV[0].getName() && path[1].getName() === charV[1].getName())
        || (path[0].getName() === charV[1].getName() && path[1].getName() === charV[0].getName())) {

        return countStepsBetweenVertexes(charNearestV, distanceV, path) - heuristic(charX, charY, charNearestV.getX(), charNearestV.getY())
    }
    // стою між своїми двома вершинами, одна з яких топова вершина

    return countStepsBetweenVertexes(charNearestV, distanceV, path) + heuristic(charX, charY, charNearestV.getX(), charNearestV.getY())
}

function countStepsBetweenVertexes(v1, v2, path) {
    let sum = 0

    for (let i = 0; i < path.length - 1; i++)
        sum += heuristicVertex(path[i], path[i + 1])

    return sum
}

/**
 * знаходимо найближчу безпечнуу вершину
 * @param {Vertex} pacmanV
 * @param {Vertex} ghost1V
 * @returns {[]}
 */
export function findNearestSafeVertex(pacmanV, pacmanVertexes, ghost1V) {
    let secondVertex
    if (pacmanVertexes.length > 1) {
        secondVertex = pacmanV.getID() === pacmanVertexes[0].getID()
            ? pacmanVertexes[1]
            : pacmanVertexes[0]
    }
    if (secondVertex !== undefined && secondVertex.getID() !== ghost1V.getID()) {
        return [secondVertex]
    }
    let nxtVertex = []
    for (let i = 0; i < adj[pacmanV.getID()].length; i++) {
        let currentV = adj[pacmanV.getID()][i]
        if (currentV.getID() === ghost1V.getID()) continue
        nxtVertex.push([currentV])
    }
    let randIndex = Math.floor(Math.random() * nxtVertex.length)
    return nxtVertex[randIndex]
}


export function findNearestSafeVertexPRO (pacmanV, pacmanVertexes, ghostVertexes){
    let secondVertex
    if (pacmanVertexes.length > 1) {
        secondVertex = pacmanV.getID() === pacmanVertexes[0].getID()
            ? pacmanVertexes[1]
            : pacmanVertexes[0]
    }

    if (secondVertex!== undefined){
        let isCorrect = true
        for(let i = 0 ; i < ghostVertexes.length; i++)
            if (ghostVertexes[i].getID() === secondVertex.getID())
                isCorrect = false

        if (isCorrect)
            return [secondVertex]
    }
    let nxtVertex = []
    for(let i = 0 ; i < adj[pacmanV.getID()].length; i++){
        let currentV = adj[pacmanV.getID()][i]
        let isCorrect = false
        for(let j = 0; j< ghostVertexes.length; j++){
            if(ghostVertexes[j].getID() === currentV.getID()) {
                isCorrect = true
            }
            // if (ghostComeFaster())
        }
        if (isCorrect) continue
        nxtVertex.push([currentV])
    }

    if (nxtVertex.length === 0 ) return nxtVertex

    let randIndex = Math.floor(Math.random() * nxtVertex.length)
    return nxtVertex[randIndex]


}

let pacmanV = vertexes[9],
    pacmanVertexes = [vertexes[9]],
    ghostVertexes=[vertexes[8],vertexes[7]]


console.log(findNearestSafeVertexPRO(pacmanV, pacmanVertexes, ghostVertexes));

/**
 *
 * @param {} pacmanVertex
 * @param {} pacmanNearestVertex
 * @param {} g1x
 * @param {} g1y
 * @param {} ghost1V
 * @param {} ghost1NearestVertex
 * @returns {Vertex}
 */
export function findMostSafeVertex(pacmanVertex, pacmanNearestVertex, g1x, g1y, ghost1V, ghost1NearestVertex) {
    if (pacmanVertex.length === 1) {
        return pacmanNearestVertex
    }

    let ghostPath1 = findShortestDist_BFS(adj, ghost1NearestVertex, pacmanVertex[0], vertexes.length),
        ghostPath2 = findShortestDist_BFS(adj, ghost1NearestVertex, pacmanVertex[1], vertexes.length),
        steps1 = countStepsToVertex(g1x, g1y, ghost1V, ghost1NearestVertex, pacmanVertex[0], ghostPath1),
        steps2 = countStepsToVertex(g1x, g1y, ghost1V, ghost1NearestVertex, pacmanVertex[1], ghostPath2)

    return (steps1 <= steps2) ? pacmanVertex[1] : pacmanVertex[0]
}



