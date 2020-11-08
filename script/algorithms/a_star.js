import {VertexInfo} from "../graph/vertex_info.js";



/**
 * h(n) = estimated cost from nn to goal. This is the heuristic part of the cost function, so it is like a guess.
 * sqrt( (x1-x2)^2 + (y1-y2)^2 )
 * @param {Vertex} vertexA
 * @param {Vertex} vertexB
 * @returns {number}
 */

function _heuristic(vertexA, vertexB) {
    return Math.sqrt(Math.pow(vertexA.getX() - vertexB.getX(), 2) + Math.pow(vertexA.getY() - vertexB.getY(), 2))
}

/**
 * @param {[]} adj
 * @param {[]} vertexesInfo
 * @param {Vertex} startV
 * @param {Vertex} endV
 */
function search_a_algorithm  (adj, startV, endV) {

    let openList = [],
        closedList = [],
        vertexesInfo = [] // todo change name to cameFrom

    for (let i = 0; i < adj.length; i++) {
        vertexesInfo[i] = new VertexInfo(null, null, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
    }

    vertexesInfo[startV.getID()].setF(0)
    vertexesInfo[startV.getID()].setG(0)
    vertexesInfo[startV.getID()].setH(0)
    vertexesInfo[startV.getID()].setParent(startV)
    vertexesInfo[startV.getID()].setCurrentV(startV)

    openList.push(startV)

    while (openList.length !== 0) {
        let lowest = 0
        for (let i = 0; i < openList.length; i++) {
            if (vertexesInfo[openList[i].getID()].getF() === vertexesInfo[lowest].getF()) {
                lowest = i
            }
        }
        let currentVertex = openList[lowest]
        if (currentVertex.getID() === endV.getID()) {
            let curr = vertexesInfo[currentVertex.getID()]
            let comeFrom = []
            while (vertexesInfo[currentVertex.getID()].getCurrentV().getID() !== startV.getID()) {
                comeFrom.push(vertexesInfo[currentVertex.getID()].getCurrentV())
                currentVertex = vertexesInfo[currentVertex.getID()].getParent()
            }
            comeFrom.push(startV)

            return comeFrom.reverse()
        }
        openList = openList.splice(0, lowest).concat(openList.splice(1, openList.length))
        closedList.push(currentVertex)
        let neighborsV = adj[currentVertex.getID()]

        for (let i = 0; i < neighborsV.length; i++) {
            let neighborV = neighborsV[i]
            if (closedList.includes(neighborV))
                continue

            let gScore = vertexesInfo[currentVertex.getID()].getG() + 1
            let gScoreIsBest = false

            if (!(openList.includes(neighborV))) {
                gScoreIsBest = true
                vertexesInfo[neighborV.getID()].setH(_heuristic(neighborV, endV))
                openList.push(neighborV)
            } else if (gScore < vertexesInfo[neighborV.getID()].getG()) {
                gScoreIsBest = true
            }

            if (gScoreIsBest) {

                vertexesInfo[neighborV.getID()].setParent(currentVertex)
                vertexesInfo[neighborV.getID()].setCurrentV(neighborV)
                vertexesInfo[neighborV.getID()].setG(gScore)
                vertexesInfo[neighborV.getID()].setF(vertexesInfo[neighborV.getID()].getG() + vertexesInfo[neighborV.getID()].getH())
            }
        }
    }
    return []
}

