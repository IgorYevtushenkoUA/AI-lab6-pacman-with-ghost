import {
    countStepsToVertex,
    findMimimaxPath,
    findMostSafeVertex,
    getDirFromPosition1ToVertex2, getDirFromVertex1ToVertex2,
    pacmanRunAway, stayBetweenVertexes
} from "./data/moving";
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
        let pacmanSafePosition = isSafePosition(x, y, pacmanVertex, pacmanNearestVertex, g1x, g1y, ghost1V, ghost1NearestVertex),
            beanSafePosition = isSafePosition(beanX, beanY, beanVertex, beanNearestVertex, g1x, g1y, ghost1V, ghost1NearestVertex)

        if (pacmanSafePosition && beanSafePosition) {
            if (noObstaclesInTheWay[1]) {
                if (beanX < x) dir = "LEFT"
                else dir = "RIGHT"
            }
            // go by Y
            else if (noObstaclesInTheWay[2]) {
                if (beanY < y) dir = "TOP"
                else dir = "BOTTOM"
            }

        } else {

            let beanNearestV = beanSafePosition ? beanNearestVertex : farthestBeanNearestVertex,
                minMaxPath = findMimimaxPath(pacmanNearestVertex, beanNearestV, ghost1V)

            if (minMaxPath !== undefined) {
                let path = minMaxPath[0]
                /** якщо стою на вершині то іду до другої вершини
                 *  інакше стою між вершинами
                 *      якщо стою між А та Б то іду до Б
                 *      якщо не Стою між А та Б іду до А*/
                if (path.getX() === x && path.getY() === y) {
                    dir = getDirFromPosition1ToVertex2(x, y, path[1])
                } else {
                    if (stayBetweenVertexes(x, y, path[0], path[1])) {
                        dir = getDirFromPosition1ToVertex2(x, y, path[1])
                    } else {
                        dir = getDirFromPosition1ToVertex2(x, y, path[0])
                    }
                }
            } else {
                let mostSafeVertexForPacman = findMostSafeVertex(pacmanVertex, pacmanNearestVertex, g1x, g1y, ghost1V, ghost1NearestVertex)
                let safe_path = pacmanRunAway(mostSafeVertexForPacman, ghost1NearestVertex)
                /** якщо у мене немає безпечного шляху - іду до найдальної від привида вершини
                 *  інакше є шлях для відходу
                 *      якщо стою на вершині то іду до другої вершини
                 *      інакше стою між вершинами
                 *          якщо стою між А та Б то іду до Б
                 *          інакше не Стою між А та Б іду до А*/
                if (safe_path.length === 0) {
                    dir = getDirFromPosition1ToVertex2(x, y, mostSafeVertexForPacman)
                } else {
                    if (pacmanVertex.length === 1) {
                        dir = getDirFromVertex1ToVertex2(safe_path[0], safe_path[1])
                    } else {
                        if (stayBetweenVertexes(x, y, safe_path[0], safe_path[1])) {
                            dir = getDirFromPosition1ToVertex2(x, y, safe_path[1])
                        } else {
                            dir = getDirFromPosition1ToVertex2(x, y, safe_path[0])
                        }
                    }
                }
            }
        }
    }
    // якщо лежить у межах різних вершин
    else {
        let pacmanSafePosition = isSafePosition(x, y, pacmanVertex, pacmanNearestVertex, g1x, g1y, ghost1V, ghost1NearestVertex),
            beanSafePosition = isSafePosition(beanX, beanY, beanVertex, beanNearestVertex, g1x, g1y, ghost1V, ghost1NearestVertex)


        if (pacmanSafePosition && beanSafePosition) {

            let beanNearestV = beanSafePosition ? beanNearestVertex : farthestBeanNearestVertex,
                minMaxPath = findMimimaxPath(pacmanNearestVertex, beanNearestV, ghost1V)

            if (minMaxPath !== undefined) {
                let path = minMaxPath[0]
                /** якщо стою на вершині то іду до другої вершини
                 *  інакше стою між вершинами
                 *      якщо стою між А та Б то іду до Б
                 *      якщо не Стою між А та Б іду до А*/
                if (path.getX() === x && path.getY() === y) {
                    dir = getDirFromPosition1ToVertex2(x, y, path[1])
                } else {
                    if (stayBetweenVertexes(x, y, path[0], path[1])) {
                        dir = getDirFromPosition1ToVertex2(x, y, path[1])
                    } else {
                        dir = getDirFromPosition1ToVertex2(x, y, path[0])
                    }
                }
            } else {
                let mostSafeVertexForPacman = findMostSafeVertex(pacmanVertex, pacmanNearestVertex, g1x, g1y, ghost1V, ghost1NearestVertex)
                let safe_path = pacmanRunAway(mostSafeVertexForPacman, ghost1NearestVertex)
                /** якщо у мене немає безпечного шляху - іду до найдальної від привида вершини
                 *  інакше є шлях для відходу
                 *      якщо стою на вершині то іду до другої вершини
                 *      інакше стою між вершинами
                 *          якщо стою між А та Б то іду до Б
                 *          інакше не Стою між А та Б іду до А*/
                if (safe_path.length === 0) {
                    dir = getDirFromPosition1ToVertex2(x, y, mostSafeVertexForPacman)
                } else {
                    if (pacmanVertex.length === 1) {
                        dir = getDirFromVertex1ToVertex2(safe_path[0], safe_path[1])
                    } else {
                        if (stayBetweenVertexes(x, y, safe_path[0], safe_path[1])) {
                            dir = getDirFromPosition1ToVertex2(x, y, safe_path[1])
                        } else {
                            dir = getDirFromPosition1ToVertex2(x, y, safe_path[0])
                        }
                    }
                }
            }
        }


    }


    let step = doOneStep(dir, x, y)
    this._posX = step[0]
    this._posY = step[1]
}
