import {findShortestDist_BFS} from "../algorithms/bfs.js";
import {adj, vertexes} from "../data/data_graphs.js";
import {HEIGHT, WIDTH, RANDOM_STEP} from "../data/constants.js";
import {ctx} from "../game.js";
import {
    doOneStep,
    getIndexByVertexName,
    getNearestVertex, getVertexesByPosition,
    getDirFromPosition1ToVertex2,getDirFromPosition1ToPosition2
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
    oldDir = "RIGHT"

    doSmartStep(x, y, pacmanX, pacmanY) {
        let ghostV = getVertexesByPosition(x, y)
        let pacmanV = getVertexesByPosition(pacmanX, pacmanY)

        let nearestGhostVertex = getNearestVertex(x, y, ghostV)
        let nearestPacmanVertex = getNearestVertex(pacmanX, pacmanY, pacmanV)
        let dir

        if (ghostV.length === 1) {
            if (this._stepCounter % RANDOM_STEP === 0) {
                let indexV = getIndexByVertexName(nearestGhostVertex) // nearestGhostVertex -> was ghost[0]
                let randomV = Math.floor(Math.random() * adj[indexV].length)
                this._old_path = [nearestGhostVertex, adj[indexV][randomV]] // nearestGhostVertex -> was ghost[0]
                this._stepCounter++
                dir = getDirFromPosition1ToVertex2(x, y, this._old_path[1])
                
            } else {
                let bfs_path = findShortestDist_BFS(adj, nearestGhostVertex, nearestPacmanVertex, vertexes.length)
                this._old_path = bfs_path.slice(0)
                this._stepCounter++
                if (bfs_path.length === 0) {
                    // привид у погоні за пакменом і на одній лінії todo дати напрямок
                    let nextVertex
                    if (pacmanV.length > 1){
                        nextVertex = nearestGhostVertex.getName() === pacmanV[0].getName() ? pacmanV[1] : pacmanV[0]
                    }else {
                        nextVertex = adj[ghostV[0].getID()][0]
                    }

                    dir = getDirFromPosition1ToVertex2(x, y, nextVertex) // nearestPacmanVertex -> was  nearestGhostVertex
                    
                } else {
                    dir = getDirFromPosition1ToVertex2(x, y, this._old_path[1])
                    
                }
            }
            this.oldDir = dir
        }else {
            if (dir === undefined) {
                dir = this.oldDir
            }
        }
        
        if (dir === undefined) return
        let step = doOneStep(dir, x, y)
        this._x = step[0]
        this._y = step[1]
    }
}
