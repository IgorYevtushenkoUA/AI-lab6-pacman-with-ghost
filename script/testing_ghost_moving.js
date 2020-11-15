import {fillADJ, vertexes, adj} from "./data/data_graphs.js";
import {findShortestDist_BFS} from "./algorithms/bfs.js";
import {isEqualVertexes} from "./data/moving.js";
import {Vertex} from "./graph/vertex.js";
import {heuristic} from "./data/moving";

fillADJ()


function getIndexByVertexName(vertex) {

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

function findAllPathFromSourceToDestination(s, dest, isVisited, allPath, prefix) {
    let bfs_path = findShortestDist_BFS(adj, s, dest, vertexes.length)
    allPath.push(prefix.concat(bfs_path))
    isVisited[getIndexByVertexName(s)] = true
    isVisited[getIndexByVertexName(dest)] = true
    prefix.push(s)

    for (let i = 0; i < bfs_path.length; i++) {
        let vertexIndex = getIndexByVertexName(bfs_path[i])

        for (let j = 0; j < adj[vertexIndex].length; j++) {
            let tempVertex = getIndexByVertexName(adj[vertexIndex][j])

            if (isVisited[tempVertex] === false) {
                let newSource = adj[vertexIndex][j]
                findAllPathFromSourceToDestination(newSource, dest, isVisited, allPath, prefix)
                prefix.pop()
            }
        }
    }
    return allPath
}


let isVisited = [], allPath = []
for (let i = 0; i < vertexes.length; i++) isVisited[i] = false

    findAllPathFromSourceToDestination(vertexes[0], vertexes[8], isVisited, allPath, [])



let path_hash = new Map()
let index = getIndexByVertexName(vertexes[0])
for (let i = 0; i < adj[index].length; i++) {
    path_hash.set(adj[index][i].getName(), [])
}
for (let i = 0; i < allPath.length; i++) {
    let v2 = allPath[i][1]
    let path_weight = countPathWeight(allPath[i], [vertexes[4]])
    let nameV = v2.getName()
    let oldVal = path_hash.get(nameV)
    if (oldVal === undefined) oldVal = []
    oldVal.push([allPath[i], path_weight])
    path_hash.set(v2.getName(), oldVal)
}

let minPaths = []
let keys = Array.from(path_hash.keys())
// find min from positive agruments
for (let k = 0; k < keys.length; k++) {
    let min = Number.MAX_SAFE_INTEGER
    index = -1

    for (let i = 0; i < path_hash.get(keys[k]).length; i++) {
        let obj = path_hash.get(keys[k])[i]
        let w = obj[1]
        if (w > 0 && w < min) {
            min = w
            index = i
        }
    }
    if (index !== -1) minPaths.push(path_hash.get(keys[k])[index])
}

// find min from negative arguments
if (minPaths.length === 0) {
    for (let k = 0; k < keys.length; k++) {
        let min = 0
        index = 0

        for (let i = 0; i < path_hash.get(keys[k]).length; i++) {
            let obj = path_hash.get(keys[k])[i]
            let w = obj[1]
            if (w < min) {
                min = w
                index = i
            }
        }
        minPaths.push(path_hash.get(keys[k])[index])
    }
}

let max = minPaths[0]
for (let i = 1; i < minPaths; i++) {
    if (minPaths[i][1] > max[1])
        max = minPaths[i]
}




/**
 *
 * @param {Vertex[]} path
 * @param {Vertex[]} ghost1Path
 * по кількості можливих розгалуджень
 по шляху привида
 */
function countPathWeight(path, ghost1Path) {
    let weight = 0
    // кількість розгалуджень
    for (let i = 0; i < path.length; i++) {
        let index = getIndexByVertexName(path[i])
        weight += adj[index].length
    }
    // чи є спільний шлях із привидом, якщо так то цей варіант стає мінусовим - тобто непідходящим
    for (let i = 0; i < ghost1Path.length; i++)
        if (path.includes(ghost1Path[i]))
            weight *= -1

    return weight
}

