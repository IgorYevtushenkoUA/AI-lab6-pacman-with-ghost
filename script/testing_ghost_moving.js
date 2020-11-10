import {Vertex} from "./graph/vertex.js";
import {findShortestDist_BFS} from "./algorithms/bfs.js";
import {fillADJ} from "./data/data_graphs.js";
import {vertexes} from "./data/data_graphs.js";
import {adj} from "./data/data_graphs.js";


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
findAllPathFromSourceToDestination(vertexes[0], vertexes[3], isVisited, allPath, [])

let path_hash = new Map()
let index = getIndexByVertexName(vertexes[0])
for (let i = 0; i < adj[index].length; i++) {
    path_hash.set(adj[index][i].getName(), [])
}
for (let i = 0; i < allPath.length; i++) {
    let v2 = allPath[i][1]
    let path_weight = i
    let oldVal = path_hash.get(v2.getName())
    oldVal.push([allPath[i], path_weight])
    path_hash.set(v2.getName(), oldVal)
}

let minPaths = []
let keys = Array.from(path_hash.keys())
for (let k = 0; k < keys.length; k++) {
    let min = 0
    index = 0
    for (let i = 0; i < path_hash.get(keys[k]).length; i++) {
        let obj = path_hash.get(keys[k])[i]
        let w = obj[1]
        if (w < min)
            index = i
    }
    minPaths.push(path_hash.get(keys[k])[index])
}

let max = minPaths[0]
for (let i = 1 ; i < minPaths;i++){
    if (minPaths[i][1] > max[1])
        max = minPaths[i]
}
console.log(max)
// console.log(minPaths)
