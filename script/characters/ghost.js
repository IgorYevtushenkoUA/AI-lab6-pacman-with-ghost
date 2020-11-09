import {findShortestDist_BFS} from "../algorithms/bfs.js";
import {adj, vertexes} from "../data/data_graphs.js";
import {HEIGHT, WIDTH} from "../data/constants.js";
import {ctx} from "../game.js";
import {
    doOneStep,
    getDirFromVertex1ToVertex2,
    getIndexByVertexName,
    getNearestVertex, getVertexesByPosition, isStayInOneLine, getDirFromPosition1ToPosition2,
    getDirFromPosition1ToVertex2, isEqualVertexes
} from "../data/moving.js";


export class Ghost {
    'use strict'

    _x = 0;
    _y = 0;
    _color = 0;
    _vertex = 0
    _radius = 0;
    _stepCounter = 0;
    _old_path = []

    constructor(xCord, yCord, gColor, radius = 8) {
        this._x = xCord;
        this._y = yCord;
        this._color = gColor;
        this._radius = radius;
        this._stepCounter = 0;
    }

    getX() {
        return this._x
    }

    getY() {
        return this._y
    }

    gerColor() {
        return this._color
    }

    getVertex() {
        return this._vertex
    }

    getStepCounter() {
        return this._stepCounter
    }

    setX(x) {
        this._x = x
    }

    setY(y) {
        this._y = y
    }

    setColor(color) {
        this._color = c
    }

    setRadius(r) {
        this._radius = r
    }

    setStepCounter(counter) {
        this._stepCounter = counter
    }


    draw() {
        ctx.fillStyle = this._color;
        ctx.beginPath()
        ctx.arc(this._x * WIDTH + 11, this._y * HEIGHT + 10, this._radius, 0, Math.PI * 2, true);
        // xz
        ctx.lineTo(this._x * WIDTH + 11, this._y * HEIGHT + 10)
        ctx.fill()
    }

    /**
     1) знайти шлях до пакмена
     2) коден четвертий вибір робити рандомним із тих що є
     3)
     */
    doSmartStep(x, y, pacmanX, pacmanY) {
        /**
         * знайти вершину твою
         * знайти вершину пакмена
         * знайти шлях
         */
        let ghostV = getVertexesByPosition(x, y)
        let pacmanV = getVertexesByPosition(pacmanX, pacmanY)
        debugger
        let nearestGhostVertex = getNearestVertex(x, y, ghostV)
        let nearestPacmanVertex = getNearestVertex(x, y, pacmanV)
        let dir

        if (x === pacmanX && y === pacmanY) {
            alert("ghost catch pacman")
            return
        } else if (isEqualVertexes(nearestGhostVertex, nearestPacmanVertex)) {
            dir = getDirFromPosition1ToPosition2(x, y, pacmanX, pacmanY)
        } else if (isStayInOneLine(nearestGhostVertex, nearestPacmanVertex)) {
            dir = getDirFromPosition1ToVertex2(x, y, nearestPacmanVertex)
        } else {
            /*
             якщо стою на вершині
                якщо крок ділиться націло на 4 то роблю рандомний крок
                інакше перебудовую шлях

             якщо спочатку стоїть між вершинами
                якщо немає початкового шляху (загалом при створенні світу) шукаю найближчу вершину та йду до неї
                якщо є шлях то йду до вершини за шляхом що вже складений нічого не вираховуючи
             */

            if (ghostV.length === 1) {
                if (this._stepCounter % 4 === 0) {
                    let indexV = getIndexByVertexName(ghostV[0])
                    let randomV = Math.floor(Math.random() * adj[indexV].length)
                    this._old_path = [ghostV[0], adj[indexV][randomV]]
                    this._stepCounter++
                    dir = getDirFromVertex1ToVertex2(x, y, this._old_path[1])
                } else {


                    let bfs_path = findShortestDist_BFS(adj, nearestGhostVertex, nearestPacmanVertex, vertexes.length)
                    this._old_path = bfs_path.slice(0)
                    this._stepCounter++
                    dir = getDirFromVertex1ToVertex2(x, y, this._old_path[1])
                }
            } else {
                if (this._old_path.length === 0) {
                    dir = getDirFromVertex1ToVertex2(x, y, nearestGhostVertex)
                } else {
                    dir = getDirFromVertex1ToVertex2(x, y, this._old_path[1])
                }
            }
        }
        let step = doOneStep(dir, x, y)
        this._x = step[0]
        this._y = step[1]
        debugger
    }
}
