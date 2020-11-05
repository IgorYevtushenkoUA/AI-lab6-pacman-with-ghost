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
 * @param {[]} vertexes
 * @param {Vertex} startV
 */
function dijkstra_algorithm(adj, vertexes, startV, dest) {
    let solutions = []
    solutions[startV.getID()] = []
    solutions[startV.getID()].dist = 0
    while (true) {
        let parent = null
        let nearest = null
        let dist = Infinity

        for (let n in solutions) {
            if (!solutions[n])
                continue
            let vDist = solutions[n].dist
            let neighbors = adj[n]
            for (let a of neighbors) {
                if (solutions[a.getID()])
                    continue

                let d = _heuristic(vertexes[n], a) + vDist
                if (d < dist) {
                    parent = solutions[n]
                    nearest = a.getID()
                    dist = d
                }
            }
        }
        if (dist === Infinity) {
            console.log("break")
            break;
        }
        solutions[nearest] = parent.concat(nearest)
        solutions[nearest].dist = dist
    }
    let path = [startV]
    for (let i of solutions[dest.getID()]) {
        path.push(vertexes[i])
    }
    return path
}

