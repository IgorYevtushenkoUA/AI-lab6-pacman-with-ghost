import {BEAN_CODE, MAP_HEIGHT, MAP_WIDTH} from "../data/constants.js";
import {HEIGHT, WIDTH} from "../data/constants.js";
import {findShortestDist_BFS} from "../algorithms/bfs.js";
import {adj, vertexes} from "../data/data_graphs.js";
import {Vertex} from "../graph/vertex.js";
import {MAP} from "../data/data_map.js";
import {ctx} from "../game.js";
import {
    doOneStep, findNearestBean, getBEANCoordinationByMapPositions,
    getDirFromVertex1ToVertex2,
    getDistanceToVertex, getVertexesByPosition, hasNotWallBetweenPacmanAndBean,
    isSamePaths,
    stayBetweenVertexes
} from "../data/moving.js";

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
        this._vertex = getVertexesByPosition(x,y)
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

        let nearestBean = findNearestBean(x, y, MAP)
        let beanCoordinates = getBEANCoordinationByMapPositions(nearestBean)

        debugger
        let beanX = beanCoordinates[0], beanY = beanCoordinates[1]
        let obstaclesInTheWay = hasNotWallBetweenPacmanAndBean(x, y, beanX, beanY)
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

            let pacmanVertex = getVertexesByPosition(x, y)
            let beanVertex = getVertexesByPosition(beanX, beanY)
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
                beanNearestVertex = getDistanceToVertex(beanX, beanY, beanVertex[0]) <= getDistanceToVertex(beanX, beanY, beanVertex[1])
                    ? beanVertex[0]
                    : beanVertex[1]
            }
            // знаходимо найближчу вершину для пакмена
            try {
                if (pacmanVertex.length === 1) {
                    pacmanNearestVertex = pacmanVertex[0]
                } else {
                    pacmanNearestVertex = getDistanceToVertex(x, y, pacmanVertex[0]) <= getDistanceToVertex(x, y, pacmanVertex[1])
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

                dir = getDirFromVertex1ToVertex2(x, y, beanNearestVertex)
            } else {

                let bfs_path = findShortestDist_BFS(adj, pacmanNearestVertex, beanNearestVertex, vertexes.length)

                if (this.oldPath.length === 0) this.oldPath = bfs_path
                else if (!isSamePaths(this.oldPath, bfs_path)) {
                    this.oldPath = bfs_path
                }
                console.log("bfs_path")
                console.log(bfs_path)
                console.log("\n")


                // todo можливо там не bfs_path[0] or bfs_path[1]

                /**
                 * якщо стою на вершині то іду до другої вершини
                 * якщо стою між вершинами
                 *      якщо стою між А та Б то іду до Б
                 *      якщо не Стою між А та Б іду до А
                 */

                if (x === bfs_path[0].getX() && y === bfs_path[0].getY()) {
                    // alert("stay in vertex")
                    // todo тут воно обирає невірну вершину

                    dir = getDirFromVertex1ToVertex2(x, y, bfs_path[1])
                }
                // if stay between vertexes
                else {
                    // todo important! тут іде зацикленість
                    if (stayBetweenVertexes(x, y, bfs_path[0], bfs_path[1])) {
                        dir = getDirFromVertex1ToVertex2(x, y, bfs_path[1])
                    } else {
                        dir = getDirFromVertex1ToVertex2(x, y, bfs_path[0])
                    }
                }
            }
            debugger
        }


        let step = doOneStep(dir, x, y)
        this._posX = step[0]
        this._posY = step[1]
    }


}
