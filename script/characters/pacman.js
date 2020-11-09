import {BEAN_CODE, MAP_HEIGHT, MAP_WIDTH} from "../data/constants.js";
import {HEIGHT, WIDTH, score_const} from "../data/constants.js";
import {findShortestDist_BFS} from "../algorithms/bfs.js";
import {adj, vertexes} from "../data/data_graphs.js";
import {Vertex} from "../graph/vertex.js";
import {MAP} from "../data/data_map.js";
import {ctx} from "../game.js";

export class Pacman {
    'use strict'
    _posX = 0
    _posY = 0
    _life = 0
    _eatenBeans = 0
    _score = 0
    _speed = 0
    _radius = 0
    _vertex = undefined // i`m not sure that i need this

    oldPath = []

    constructor(x, y, life = 3, beans = 0, score = 0, speed = 5, radius = 8, vertex = 0) {
        this._posX = x
        this._posY = y
        this._life = life
        this._eatenBeans = beans
        this._score = 0
        this._speed = speed
        this._radius = radius
        this._vertex = vertex
    }

    getX() {
        return this._posX
    }

    getY() {
        return this._posY
    }

    getLife() {
        return this._life
    }

    getSpeed() {
        return this._speed
    }

    getVertex() {
        return this._vertex
    }

    getEatenBean() {
        return this._eatenBeans
    }

    getScore() {
        return this._score
    }

    setX(x) {
        this._posX = x
    }

    setY(y) {
        this._posY = y
    }

    setLife(life) {
        this._life = life
    }

    setSpeed(s) {
        this._speed = s
    }

    setVertex(v) {
        this._vertex = v
    }

    setEatenBean(b) {
        this._eatenBeans = b
    }

    setScore(s) {
        this._score = s
    }

    getPacmanMapPositionX(blockWidth) {
        return this._posX * blockWidth
    }

    getPacmanMapPositionY(blockHeight) {
        return this._posY * blockHeight
    }

    winPacman() {
        return this._score === 310
    }

    pacmanLose() {
        return this._life === 0
    }

    draw() {
        let pacman_color = "yellow"
        ctx.fillStyle = pacman_color
        ctx.beginPath()
        ctx.arc(this._posX * WIDTH + 11, this._posY * HEIGHT + 10, this._radius, 0, Math.PI * 2, true);
        // xz
        ctx.lineTo(this._posX * WIDTH + 11, this._posY * HEIGHT + 10)
        ctx.fill()
    }

    doSmartStep(x, y) {

        let nearestBean = this.findNearestBean(x, y, MAP)
        let beanCoordinates = this.getBEANCoordinationByMapPositions(nearestBean)

        debugger
        let beanX = beanCoordinates[0], beanY = beanCoordinates[1]
        let obstaclesInTheWay = this.hasNotWallBetweenPacmanAndBean(x, y, beanX, beanY)
        let dir = ""


        // якщо лежить в одному напрямку без перешкод
        // todo додати перевырку на привида
        if (obstaclesInTheWay[0]) {

            // go by X
            if (obstaclesInTheWay[1]) {
                if (beanX < x) {
                    // x--
                    dir = "LEFT"
                } else {
                    dir = "RIGHT"
                    // x++
                }
            }
            // go by Y
            else if (obstaclesInTheWay[2]) {
                if (beanY < y) {
                    dir = "TOP"
                    // y--
                } else {
                    dir = "BOTTOM"
                    // y++
                }
            }
            debugger
        }
        // якщо лежить у межах різних вершин
        else {
            localStorage.setItem('map', MAP)

            let pacmanVertex = this.getVertexesByPosition(x, y)
            let beanVertex = this.getVertexesByPosition(beanX, beanY)
            let beanNearestVertex, pacmanNearestVertex

            console.log("pacX :: " + x + "\tpacY :: " + y)
            console.log("pacmanVertex ::::    (length)   " + pacmanVertex)
            console.log(pacmanVertex)
            console.log("beanX :: " + beanX + "\tbeanY :: " + beanY)
            console.log("beanVertex")
            console.log(beanVertex)

            // знахолимо найближчий кут для монетки БІНА
            if (beanVertex.length === 1) {
                beanNearestVertex = beanVertex[0]
            } else {
                beanNearestVertex = this.getDistanceToVertex(beanX, beanY, beanVertex[0]) <= this.getDistanceToVertex(beanX, beanY, beanVertex[1])
                    ? beanVertex[0]
                    : beanVertex[1]
            }
            // знаходимо найближчу вершину для пакмена
            try {
                if (pacmanVertex.length === 1) {
                    pacmanNearestVertex = pacmanVertex[0]
                } else {
                    pacmanNearestVertex = this.getDistanceToVertex(x, y, pacmanVertex[0]) <= this.getDistanceToVertex(x, y, pacmanVertex[1])
                        ? pacmanVertex[0]
                        : pacmanVertex[1]
                }
            } catch (e) {
                console.log("this.oldPath")
                console.log(this.oldPath)
            }
            /**
             * тут помилка неправильна фінальна вершина вказується а потім якась діч відбувається
             */

            if (pacmanNearestVertex.getName() === beanNearestVertex.getName()) {

                dir = this.getDirFromOneVertex1ToVertex2(x, y, beanNearestVertex)
            } else {

                let bfs_path = findShortestDist_BFS(adj, pacmanNearestVertex, beanNearestVertex, vertexes.length)

                if (this.oldPath.length === 0) this.oldPath = bfs_path
                else if (!this.isSamePaths(this.oldPath, bfs_path)) {
                    this.oldPath = bfs_path
                }
                console.log("bfs_path")
                console.log(bfs_path)
                console.log("\n")


                // todo можливо там не bfs_path[0] or bfs_path[1]
                if (x === bfs_path[0].getX() && y === bfs_path[0].getY()) {
                    // alert("stay in vertex")
                    // todo тут воно обирає невірну вершину

                    dir = this.getDirFromOneVertex1ToVertex2(x, y, bfs_path[1])
                }
                // if stay between vertexes
                else {
                    // todo important! тут іде зацикленість

                    if (!this.isSamePaths(this.oldPath, bfs_path)) {
                        dir = this.getDirFromOneVertex1ToVertex2(x, y, bfs_path[0])
                    } else {
                        dir = this.getDirFromOneVertex1ToVertex2(x, y, bfs_path[1])
                    }
                }
            }
            debugger
        }


        this.doOneStep(dir, x, y)
    }

    isSamePaths(p1, p2) {
        if (p1.length !== p2.length) return false
        for (let i = 0; i < p1.length; i++) {
            if (!this.isEqualVertexes(p1[i], p2[i])) return false
        }
        return true
    }

    isEqualVertexes(v1, v2) {
        return v1.getY() === v2.getY() && v1.getX() === v2.getX()
    }


    /**
     * зробити один крок
     * @param side
     * @param x
     * @param y
     */
    doOneStep(side, x, y) {

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
        this._posX = newX
        this._posY = newY

    }

    /**
     *
     * @param {Vertex} v2
     * @returns {string}
     */
    getDirFromOneVertex1ToVertex2(x, y, v2) {
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
    getDistanceToVertex(x, y, vertex) {
        if (this.isOneLineX(y, vertex.getY()))
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

    hasNotWallBetweenPacmanAndBean(pacX, pacY, beanX, beanY) {
        let res = [false]
        if (this.isOneLineX(pacY, beanY)) {
            let x1 = Math.min(pacX, beanX)
            let x2 = Math.max(pacX, beanX)

            res = [true, true, false]

            for (let i = x1; i < x2; i++) {
                let index = pacY * MAP_WIDTH + pacX
                if (MAP[index] === 0)
                    res = [false]
            }
        } else if (this.isOneLineY(pacX, beanX)) {
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


    isOneLineY(pacX, beanX) {
        return pacX === beanX
    }

    isOneLineX(pacY, beanY) {
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
    findNearestBean(pacmanX, pacmanY, map) {
        let generation = 0,
            ceil = 1,
            isBean = false,
            allNeighbors = [],
            neighbors
        // todo del && ceil !== MAP_WIDTH (we have score to know when finish)
        while (!isBean && ceil !== MAP_WIDTH) {
            generation++
            ceil += 2
            allNeighbors = this.findNeighbor(generation, ceil, pacmanX, pacmanY)
            // знаходимо всі одиниці та видаляємо дублікати
            neighbors = [...new Set(allNeighbors.filter(item => MAP[item] === 1))]
            isBean = neighbors.length > 0
        }

         let bean_weight = this.countBeanWeight(pacmanX, pacmanY, neighbors)
         let best_bean_position = Array.from(this.sortMap(bean_weight))
         return best_bean_position[0][0]
        // debugger
        // return neighbors[0]
    }

    /**
     * рахує відстань від А до Б
     * @param x
     * @param y
     * @param x2
     * @param y2
     * @returns {number}
     */
    heuristic(x, y, x2, y2) {
        return Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2))
    }

    /**
     * рахує вагу ккожного БІНА (КРЕКЕРА)
     * @param pacmanX
     * @param pacmanY
     * @param neighbors
     * @returns {Map<any, any>}
     */

    countBeanWeight(pacmanX, pacmanY, neighbors) {
        let neighbor_weight = new Map()
        for (let i = 0; i < neighbors.length; i++) {
            let beanCoordination = this.getBEANCoordinationByMapPositions(neighbors[i]),
                beanX = beanCoordination[0],
                beanY = beanCoordination[1],
                val = -1 * this.heuristic(pacmanX, pacmanY, beanX, beanY)

            if (this.isOneLineY(pacmanX, beanX) || this.isOneLineX(pacmanY, beanY)) val++

            neighbor_weight.set(neighbors[i], val)
        }
        return neighbor_weight
    }

    /**
     * сортує МАП
     * @param map
     * @returns {*}
     */
    sortMap(map) {
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
    getBEANCoordinationByMapPositions(index) {
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
    findNeighbor(generation, ceil, posX, posY) {
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

    isStayInVertex(x, y) {
        for (let i = 0; i < vertexes.length; i++) {
            let v = vertexes[i]
            if (v.getX() === x && v.getY() === y) {
                return true
            }
        }
        return false
    }

    getVertexesByPosition(posX, posY) {
        // перевірити спочатку всі вершини
        for (let i = 0; i < vertexes.length; i++) {
            let currV = vertexes[i]
            if (this.stayInVertexTop(posX, posY, currV)) {
                return [currV]
            }
        }
        // перевірити всершини - вершин (тобто всі ті вершини, що належать вершині А)
        for (let i = 0; i < adj.length; i++) {
            let currV = vertexes[i]
            if (this._score > score_const)
                if (this.stayInVertexTop(posX, posY, currV)) {
                    return [currV]
                }

            for (let j = 0; j < adj[i].length; j++) {
                let tempV = adj[i][j]
                if (this.stayBetweenVertexes(posX, posY, currV, tempV)) {
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
    stayInVertexTop(posX, posY, vertex) {
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
    stayBetweenVertexes(posX, posY, vertex1, vertex2) {

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
    getIndexByVertexName(vertex) {

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

    findAllPathFromSourceToDestination(s, dest, isVisited, allPath, prefix) {
        let bfs_path = findShortestDist_BFS(adj, s, dest, vertexes.length)
        allPath.push(prefix.concat(bfs_path))
        isVisited[this.getIndexByVertexName(s)] = true
        isVisited[this.getIndexByVertexName(dest)] = true
        prefix.push(s)

        for (let i = 0; i < bfs_path.length; i++) {
            let vertexIndex = this.getIndexByVertexName(bfs_path[i])

            for (let j = 0; j < adj[vertexIndex].length; j++) {
                let tempVertex = this.getIndexByVertexName(adj[vertexIndex][j])

                if (isVisited[tempVertex] === false) {
                    let newSource = adj[vertexIndex][j]
                    this.findAllPathFromSourceToDestination(newSource, dest, isVisited, allPath, prefix)
                    prefix.pop()
                }
            }
        }
        return allPath
    }


}
