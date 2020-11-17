import {
    countStepsToVertex, doOneStep,
    findFarthestBean,
    findMimimaxPath,
    findNearestBean,
    findNearestSafeVertex,
    getBEANCoordinationByMapPositions,
    getDirFromPosition1ToVertex2,
    getDirFromVertex1ToVertex2,
    getNearestVertex,
    getVertexesByPosition,
    hasNotWallBetweenPacmanAndBean,
    isEqualVertexes,
    isSafePosition,
    isSamePaths,
    pacmanRunAway,
    stayBetweenVertexes
} from "./data/moving";
import {MAP} from "./data/data_map";
import {findShortestDist_BFS} from "./algorithms/bfs";
import {adj, vertexes} from "./data/data_graphs";

function doSmartStep(x, y, g1x, g1y) {

    let nearestBean = findNearestBean(x, y, MAP),
        beanCoordinates = getBEANCoordinationByMapPositions(nearestBean),
        beanX = beanCoordinates[0],
        beanY = beanCoordinates[1],
        beanVertex = getVertexesByPosition(beanX, beanY),
        beanNearestVertex = getNearestVertex(beanX, beanY, beanVertex),
        // todo del farthest bean
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
                let safeV = findNearestSafeVertex(pacmanNearestVertex, pacmanVertex, ghost1NearestVertex)
                debugger
                if (safeV.length === 0) {
                    debugger
                    // you have problems todo !!!!!!!!!!!
                    alert("you have no variant ; ghost catch you 1")
                    dir = "STOP"
                    debugger
                } else {
                    dir = getDirFromPosition1ToVertex2(x, y, safeV[0])
                    debugger
                }
            } else { // here we should run away because we in dangerous zone
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
                let safe_path = pacmanRunAway(mostSafeVertexForPacman, ghost1NearestVertex)


                debugger
                if (safe_path.length === 0) {
                    let safeV = findNearestSafeVertex(pacmanNearestVertex, pacmanVertex, ghost1NearestVertex)
                    alert("you have no variant ; ghost catch you 2")
                    debugger
                    dir = getDirFromPosition1ToVertex2(x, y, safeV[0])
                    debugger
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
        let pacmanSafePosition = isSafePosition(x, y, pacmanVertex, pacmanNearestVertex, g1x, g1y, ghost1V, ghost1NearestVertex)
        if (pacmanSafePosition) {
            if (pacmanNearestVertex.getName() === beanNearestVertex.getName()) {
                // todo ось тут вся погибель - тут він і тікає і йде бо біпера назад (туди - назад) саме тут
                dir = getDirFromPosition1ToVertex2(x, y, beanNearestVertex)

                // зробити перевірку на безпечність позиції - якщо небезпечна то тікати інакше те що робив до цього

                debugger
            } else {
                let minMaxPath = findMimimaxPath(pacmanNearestVertex, beanNearestVertex, ghost1V)
                let farthestBean = findMimimaxPath(pacmanNearestVertex, farthestBeanNearestVertex, ghost1V)

                let bfs_path = minMaxPath !== undefined
                    ? minMaxPath[0]
                    : farthestBean !== undefined
                        ? farthestBean[0]
                        : []
                debugger

                if (this.oldPath.length === 0) this.oldPath = bfs_path
                else if (!isSamePaths(this.oldPath, bfs_path)) {
                    this.oldPath = bfs_path
                }

                // значить є шлях який не пересікається із шляхом привида
                if (bfs_path.length > 0) {
                    /**
                     * якщо стою на вершині то іду до другої вершини
                     * якщо стою між вершинами
                     *      якщо стою між А та Б то іду до Б
                     *      якщо не Стою між А та Б іду до А
                     */
                    if (x === bfs_path[0].getX() && y === bfs_path[0].getY()) {
                        dir = getDirFromPosition1ToVertex2(x, y, bfs_path[1])
                        debugger
                    }
                    // if stay between vertexes
                    else {
                        if (stayBetweenVertexes(x, y, this.oldPath[0], this.oldPath[1])) {
                            dir = getDirFromPosition1ToVertex2(x, y, this.oldPath[1])
                            debugger
                        } else {
                            dir = getDirFromPosition1ToVertex2(x, y, this.oldPath[0])
                            debugger
                        }
                    }
                } else {
                    let safeV = findNearestSafeVertex(pacmanNearestVertex, pacmanVertex, ghost1NearestVertex)
                    debugger
                    if (safeV.length === 0) {
                        debugger
                        // you have problems todo !!!!!!!!!!!
                        alert("you have no variant ; ghost catch you 1")
                        dir = "STOP"
                        debugger
                    } else {
                        dir = getDirFromPosition1ToVertex2(x, y, safeV[0])
                        debugger
                    }
                    // alert("here bfs have not found way free !!!!!!!!!!!")

                }
                debugger
            }
        } else {
            if (isEqualVertexes(pacmanNearestVertex, ghost1NearestVertex)) {
                // let safeV = findNearestSafeVertex(pacmanNearestVertex, ghost1NearestVertex)
                let safeV = findNearestSafeVertex(pacmanNearestVertex, pacmanVertex, ghost1NearestVertex)
                debugger
                if (safeV.length === 0) {
                    debugger
                    // you have problems todo !!!!!!!!!!!
                    alert("you have no variant ; ghost catch you 3")
                    dir = "STOP"
                    debugger
                } else {
                    dir = getDirFromPosition1ToVertex2(x, y, safeV[0])
                    debugger
                }
            } else { // here we should run away because we in dangerous zone
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
                let safe_path = pacmanRunAway(mostSafeVertexForPacman, ghost1NearestVertex)

                let path_to_farthest_bean = [] // todo


                debugger
                if (safe_path.length === 0) {
                    // todo тут він зупиняється але міг би і зробити крок уперед до вершини бо бфс не дає результату але він стоїть по центру а не на вершині, короче треба робити крок

                    dir = getDirFromPosition1ToVertex2(x, y, mostSafeVertexForPacman)
                    // dir = "STOP"
                    debugger
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
    let step = doOneStep(dir, x, y)
    this._posX = step[0]
    this._posY = step[1]
}
