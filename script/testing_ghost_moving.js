import {fillADJ, vertexes, adj} from "./data/data_graphs.js";
import {Vertex} from "./graph/vertex.js";
import {findShortestDist_BFS} from "./algorithms/bfs.js";

fillADJ()

function findAllPathFromSourceToDestination(s, dest, isVisited, allPath, prefix) {
    let bfs_path = findShortestDist_BFS(adj, s, dest, vertexes.length)
    allPath.push(prefix.concat(bfs_path))
    isVisited[s.getID()] = true
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

    // роблю це бо  останній елемент просто вертекс а не масив і через це помилки вилітають
    return allPath
}

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

function findMinimaxPath(s, dest, ghost1V) {

    let allPath = [...getAllPath(s, dest)]
    debugger
    let path_map = buildPathMap(s)
    debugger
    path_map = countAllPathWeight(path_map, allPath, ghost1V)
    debugger
    let minPath = findMinPath(path_map)
    debugger
    let minMAXPath = findMaxOfMinPath(minPath)
    debugger
    return minMAXPath

}

/**
 * знаходить всі можливі шляхи із точки А в точку Б (інколи там є повтори типу А-Б-В-Б-Д)todo виправити це
 * @param s
 * @param dest
 * @returns {[]}
 */
function getAllPath(s, dest) {
    debugger
    let isVisited = []
    let allPath = []

    let allNeighbor = []
    debugger
    for (let i = 0; i < adj[s.getID()].length; i++) {
        allNeighbor.push(adj[s.getID()][i])
    }
    debugger
    let index = adj[s.getID()].length
    for (let i = 0; i < index; i++) {
        let path = [s]

        for (let j = 0; j < vertexes.length; j++) isVisited[j] = false
        isVisited[s.getID()] = true
        isVisited[dest.getID()] = true
        isVisited[adj[s.getID()][i]]

        findAllPathFromSourceToDestination(adj[s.getID()][i], dest, isVisited, path, [s])
        path.shift()
        debugger
        console.log(path)
        Array.prototype.push.apply(allPath, path)
    }
    debugger
    return allPath
}

/**
 * будує "ДЕРЕВО(MAP)-ШЛЯХІВ" із з'єднаннь головного графу
 * Приклад : є вершина А, яка з'єднана із Б,В,Г,Д
 * це значить що наше "дерево" містить три листки
 * дерево* - це абстрактне поняття - не те дерево що поістинні вважається деревом в програмування
 * @param source
 * @returns {Map<any, any>}
 */
function buildPathMap(source) {
    let path_map = new Map()
    let index = getIndexByVertexName(source)
    for (let i = 0; i < adj[index].length; i++) {
        path_map.set(adj[index][i].getName(), [])
    }
    return path_map
}

/**
 * рахує вагу шляху
 * # кількість розгалужень(звёяхкыв) кожноъ вершини
 * # чи не пересікається вершина із привидом (якщо ні то нічого, якщо так то шлях стає від'ємним)
 * ---- МІНУСИ ----
 * не враховується у пересіканні із привидом через скільки кроків пересічеться,
 * та якщо пакмен буде на тій(небезпечній вершині) чи буде там сам привид
 * @param path_map
 * @param allPath
 * @param ghost1V
 * @returns {*}
 */
function countAllPathWeight(path_map, allPath, ghost1V) {
    try {
        allPath = allPath.filter(item => item.length > 1)
        for (let i = 0; i < allPath.length; i++) {
            let v2 = allPath[i][1]
            let path_weight = countPathWeight(allPath[i], ghost1V)
            let oldVal = path_map.get(v2.getName())
            oldVal.push([allPath[i], path_weight])
            oldVal.push([allPath[i], path_weight])
            path_map.set(v2.getName(), oldVal)
        }
        return path_map
    } catch (e) {
        console.log("error :: countAllPathWeight")
        console.log(e)
        debugger
    }
    debugger
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
    for (let i = 0; i < ghost1Path.length; i++) {
        if (path.includes(ghost1Path[i]))
            weight *= -1
    }

    // todo зробити перевірку хто швидше дійде до вершини пакмени чи привид (якщо однаково то видалити шлях якщо по різному то шлях норм напевно)

    return weight
}

/**
 *
 * @param path_map
 * @returns {[]}
 */
function findMinPath(path_map) {
    try {
        let minPaths = []
        let keys = Array.from(path_map.keys())
        // find min from positive agruments
        for (let k = 0; k < keys.length; k++) {
            let min = Number.MAX_SAFE_INTEGER
            let index = -1

            for (let i = 0; i < path_map.get(keys[k]).length; i++) {
                let obj = path_map.get(keys[k])[i]
                let w = obj[1]
                if (w > 0 && w < min) {
                    min = w
                    index = i
                }
            }
            if (index !== -1) minPaths.push(path_map.get(keys[k])[index])
        }
        // find min from negative arguments
        if (minPaths.length === 0) {
            for (let k = 0; k < keys.length; k++) {
                let min = 0
                let index = 0

                for (let i = 0; i < path_map.get(keys[k]).length; i++) {
                    let obj = path_map.get(keys[k])[i]
                    let w = obj[1]
                    if (w < min) {
                        min = w
                        index = i
                    }
                }
                minPaths.push(path_map.get(keys[k])[index])
            }
        }
        return minPaths
    } catch (e) {
        console.log("error :: findMinPath")
        debugger
    }
    debugger
}

/**
 *
 * @param minPaths
 * @returns {*}
 */
function findMaxOfMinPath(minPaths) {
    try {
        let max = minPaths[0]
        for (let i = 1; i < minPaths; i++) {
            if (minPaths[i][1] > max[1])
                max = minPaths[i]
        }
        return max
    } catch (e) {
        console.log("error :: findMaxOfMinPath(minPaths)")
        debugger
    }
    debugger
}


console.log([["s","dist"],1][0])

// let s = vertexes[18],
//     dest = vertexes[17],
//     ghost1V = [vertexes[2], vertexes[3]]
// console.log(findMinimaxPath(s, dest, ghost1V))
