import {HEIGHT, WIDTH} from "../data/constants.js";
import {findShortestDist_BFS} from "../algorithms/bfs.js";
import {adj, vertexes} from "../data/data_graphs.js";
import {MAP} from "../data/data_map.js";
import {ctx} from "../game.js";
import {
    doOneStep, findNearestBean, getBEANCoordinationByMapPositions,
    getDirFromVertex1ToVertex2,
    getVertexesByPosition, hasNotWallBetweenPacmanAndBean,
    isSamePaths,
    stayBetweenVertexes, getNearestVertex,
 isEqualVertexes,findMimimaxPath} from "../data/moving.js";

export class Pacman {
    'use strict'
    _posX = 0
    _posY = 0
    _life = 0
    _eatenBeans = 0
    _score = 0
    _radius = 0

    oldPath = []

    constructor(x, y, life = 3, beans = 0, score = 0, radius = 8) {
        this._posX = x
        this._posY = y
        this._life = life
        this._eatenBeans = beans
        this._score = 0
        this._radius = radius
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

    doSmartStep(x, y, ghost1V) {

        let nearestBean = findNearestBean(x, y, MAP),
            beanCoordinates = getBEANCoordinationByMapPositions(nearestBean),
            beanX = beanCoordinates[0],
            beanY = beanCoordinates[1],
            obstaclesInTheWay = hasNotWallBetweenPacmanAndBean(x, y, beanX, beanY),
            dir = "",
            pacmanVertex = getVertexesByPosition(x, y),
            beanVertex = getVertexesByPosition(beanX, beanY),
            beanNearestVertex = getNearestVertex(beanX, beanY, beanVertex),
            pacmanNearestVertex = getNearestVertex(x, y, pacmanVertex),
            isVisited = [],
            allPath = [],
            prefix = []

        for (let i = 0; i < vertexes.length; i++) isVisited[i] = false

        if (isEqualVertexes(pacmanNearestVertex, beanNearestVertex)) {
            // треба зробити перевірку на привида чи релевантно туди йти ?
            //     чи краще зробити обхід
            // if (stay pacman and bean in one line) {
            //     do step to
            // }else {}
        } else {
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
            }
            // якщо лежить у межах різних вершин
            else {
                localStorage.setItem('map', MAP)
                console.log("pacX :: " + x + "\tpacY :: " + y)
                console.log("pacmanVertex ::::    (length)   " + pacmanVertex)
                console.log(pacmanVertex)
                console.log("beanX :: " + beanX + "\tbeanY :: " + beanY)
                console.log("beanVertex")
                console.log(beanVertex)


                if (pacmanNearestVertex.getName() === beanNearestVertex.getName()) {
                    dir = getDirFromVertex1ToVertex2(x, y, beanNearestVertex)
                } else {

                    // let bfs_path = findMimimaxPath(pacmanNearestVertex, beanNearestVertex, ghost1V)
                    let bfs_path = findShortestDist_BFS(adj, pacmanNearestVertex, beanNearestVertex, vertexes.length)

                    if (this.oldPath.length === 0) this.oldPath = bfs_path
                    else if (!isSamePaths(this.oldPath, bfs_path)) {
                        this.oldPath = bfs_path
                    }
                    console.log("bfs_path")
                    console.log(bfs_path)
                    console.log("\n")
                    /**
                     * якщо стою на вершині то іду до другої вершини
                     * якщо стою між вершинами
                     *      якщо стою між А та Б то іду до Б
                     *      якщо не Стою між А та Б іду до А
                     */

                    if (x === bfs_path[0].getX() && y === bfs_path[0].getY()) {
                        dir = getDirFromVertex1ToVertex2(x, y, bfs_path[1])
                    }
                    // if stay between vertexes
                    else {
                        if (stayBetweenVertexes(x, y, bfs_path[0], bfs_path[1])) {
                            dir = getDirFromVertex1ToVertex2(x, y, bfs_path[1])
                        } else {
                            dir = getDirFromVertex1ToVertex2(x, y, bfs_path[0])
                        }
                    }
                }
            }

            let step = doOneStep(dir, x, y)
            this._posX = step[0]
            this._posY = step[1]
        }
    }


}
