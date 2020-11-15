import {HEIGHT, WIDTH} from "../data/constants.js";
import {findShortestDist_BFS} from "../algorithms/bfs.js";
import {adj, vertexes} from "../data/data_graphs.js";
import {MAP} from "../data/data_map.js";
import {ctx} from "../game.js";
import {
    doOneStep, findNearestBean, getBEANCoordinationByMapPositions,
    getDirFromPosition1ToVertex2,
    getVertexesByPosition, hasNotWallBetweenPacmanAndBean,
    isSamePaths, isEqualVertexes,
    stayBetweenVertexes, getNearestVertex,
    findMimimaxPath, pacmanRunAway, findNearestSafeVertex, getDirFromVertex1ToVertex2,
    isSafePosition, findFarthestBean, countStepsToVertex
} from "../data/moving.js";

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

    doSmartStep(x, y, g1x, g1y) {

        let nearestBean = findNearestBean(x, y, MAP),
            beanCoordinates = getBEANCoordinationByMapPositions(nearestBean),
            beanX = beanCoordinates[0],
            beanY = beanCoordinates[1],
            beanVertex = getVertexesByPosition(beanX, beanY),
            beanNearestVertex = getNearestVertex(beanX, beanY, beanVertex),

            farthestBean = findFarthestBean(x, y, MAP),
            farthestBeanCoordinates = getBEANCoordinationByMapPositions(farthestBean),
            farthestBeanX = farthestBeanCoordinates[0],
            farthestBeanY = farthestBeanCoordinates[1],
            farthestBeanVertex = getVertexesByPosition(farthestBeanX, farthestBeanY),
            farthestBeanNearestVertex = getNearestVertex(farthestBeanX, farthestBeanY, farthestBeanVertex),

            pacmanVertex = getVertexesByPosition(x, y),
            pacmanNearestVertex = getNearestVertex(x, y, pacmanVertex),

            ghost1V = getVertexesByPosition(g1x, g1y),
            ghost1NearestVertex = getNearestVertex(g1x, g1y, ghost1V),

            noObstaclesInTheWay = hasNotWallBetweenPacmanAndBean(x, y, beanX, beanY),
            dir = ""

        debugger

        // якщо лежить в одному напрямку без перешкод
        if (noObstaclesInTheWay[0]) {
            let pacmanSafePosition = isSafePosition(x, y, pacmanVertex, pacmanNearestVertex, g1x, g1y, ghost1V, ghost1NearestVertex)
            let beanSafePosition = isSafePosition(beanX, beanY, beanVertex, beanNearestVertex, g1x, g1y, ghost1V, ghost1NearestVertex)

            if (pacmanSafePosition && beanSafePosition) {
                // go by X
                if (noObstaclesInTheWay[1]) {
                    if (beanX < x) dir = "LEFT"
                    else dir = "RIGHT"
                }
                // go by Y
                else if (noObstaclesInTheWay[2]) {
                    if (beanY < y) dir = "TOP"
                    else dir = "BOTTOM"
                }
                debugger
            } else {

                if (isEqualVertexes(pacmanNearestVertex, ghost1NearestVertex)) {
                    // let safeV = findNearestSafeVertex(pacmanNearestVertex, ghost1NearestVertex)
                    let safeV = findNearestSafeVertex(pacmanNearestVertex, ghost1NearestVertex)
                    debugger
                    if (safeV.length === 0) {
                        debugger
                        // you have problems todo !!!!!!!!!!!
                        alert("you have no variant ; ghost catch you 1")
                        dir = "STOP"
                    } else {
                        dir = getDirFromPosition1ToVertex2(x, y, safeV[0])
                        debugger
                    }
                } else { // here we should run away because we in dangerous zone
                    // проблема у цьому методі pacmanRunAway - він робить небезпечний шлях


                    /*
                    тут я передаю неправильну вершину бо вона є небезпечною ібо  найближча це погано інколи треба дільша

                    аби обрати правильну вершину потрібно обрати чи ближня чи дальня
                    треба порахувати до якої вершини привид швидше дійде і обрати ту до якої довше
                     */

                    let mostSafeVertexForPacman
                    if (pacmanVertex.length === 1) {
                        mostSafeVertexForPacman = pacmanNearestVertex
                    } else {
                        let ghostPath1 = findShortestDist_BFS(adj, ghost1NearestVertex, pacmanVertex[0], vertexes.length),
                            ghostPath2 = findShortestDist_BFS(adj, ghost1NearestVertex, pacmanVertex[1], vertexes.length)
                        debugger
                        let steps1 = countStepsToVertex(g1x, g1y, ghost1V, ghost1NearestVertex, pacmanVertex[0], ghostPath1),
                            steps2 = countStepsToVertex(g1x, g1y, ghost1V, ghost1NearestVertex, pacmanVertex[1], ghostPath2)

                        mostSafeVertexForPacman = (steps1 <= steps2) ? pacmanVertex[1] : pacmanVertex[0]
                        debugger
                    }
                    debugger
                    let safe_path = pacmanRunAway(mostSafeVertexForPacman, ghost1NearestVertex)


                    debugger
                    if (safe_path.length === 0) {
                        debugger
                        alert("you have no variant ; ghost catch you 2")
                        dir = "STOP"
                    } else {
                        let vertexes = getVertexesByPosition(x, y)
                        debugger
                        if (vertexes.length === 1) {
                            dir = getDirFromVertex1ToVertex2(safe_path[0], safe_path[1])
                            debugger
                        } else {
                            // dir = getDirFromPosition1ToVertex2(x, y, pacmanNearestVertex)
                            dir = getDirFromPosition1ToVertex2(x, y, safe_path[0])
                            debugger
                        }
                    }
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
                // todo тут тупі кроки їх треба зробити розумними (вони нічого не аналізують)
                dir = getDirFromPosition1ToVertex2(x, y, beanNearestVertex)
            } else {

                let bfs_path = findMimimaxPath(pacmanNearestVertex, beanNearestVertex, ghost1V)[0]
                // let bfs_path = findShortestDist_BFS(adj, pacmanNearestVertex, beanNearestVertex, vertexes.length)
                debugger

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
                    dir = getDirFromPosition1ToVertex2(x, y, bfs_path[1])
                }
                // if stay between vertexes
                else {
                    if (stayBetweenVertexes(x, y, bfs_path[0], bfs_path[1])) {
                        dir = getDirFromPosition1ToVertex2(x, y, bfs_path[1])
                    } else {
                        dir = getDirFromPosition1ToVertex2(x, y, bfs_path[0])
                    }
                }
            }
        }

        let step = doOneStep(dir, x, y)
        this._posX = step[0]
        this._posY = step[1]
        // }
    }
}
