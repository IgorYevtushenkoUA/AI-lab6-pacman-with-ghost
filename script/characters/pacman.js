import {HEIGHT, WIDTH} from "../data/constants.js";
import {findShortestDist_BFS} from "../algorithms/bfs.js";
import {adj, vertexes} from "../data/data_graphs.js";
import {MAP} from "../data/data_map.js";
import {ctx} from "../game.js";
import {
    doOneStep, findNearestBean, getBEANCoordinationByMapPositions,
    getDirFromVertex1ToVertex2,
    getVertexesByPosition, hasNotWallBetweenPacmanAndBean,
    isSamePaths,
    stayBetweenVertexes, getNearestVertex,
    findAllPathFromSourceToDestination
} from "../data/moving.js";
import {getIndexByVertexName, isEqualVertexes} from "../data/moving";

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

    doSmartStep(x, y) {

        let nearestBean = findNearestBean(x, y, MAP),
            beanCoordinates = getBEANCoordinationByMapPositions(nearestBean),
            beanX = beanCoordinates[0],
            beanY = beanCoordinates[1],
            obstaclesInTheWay = hasNotWallBetweenPacmanAndBean(x, y, beanX, beanY),
            dir = "",
            pacmanVertex = getVertexesByPosition(x, y),
            beanVertex = getVertexesByPosition(beanX, beanY),
            beanNearestVertex = getNearestVertex(beanX, beanY, beanVertex),
            pacmanNearestVertex = getNearestVertex(x, y, pacmanVertex),
            isVisited = [],
            allPath = [],
            prefix = []

        for (let i = 0; i < vertexes.length; i++) isVisited[i] = false

        if (isEqualVertexes(pacmanNearestVertex, beanNearestVertex)) {
            // треба зробити перевірку на привида чи релевантно туди йти ?
            //     чи краще зробити обхід
            // if (stay pacman and bean in one line) {
            //     do step to
            // }else {}
        } else {
            findAllPathFromSourceToDestination(pacmanNearestVertex, beanNearestVertex, isVisited, allPath, prefix)
            //  розбили весь шлях на напрямки розгалудження
            let path_hash = new Map()
            let index = getIndexByVertexName(vertexes[0])
            for (let i = 0; i < adj[index].length; i++) {
                path_hash.set(adj[index][i].getName(), [])
            }
            //  розбили всі 52 варіанти по різним хешам та порахували їх вагу
            for (let i = 0; i < allPath.length; i++) {
                let v2 = allPath[i][1]
                // let path_weight = countPathWeight(allPath[i])
                let path_weight = i
                let val = path_hash.get(v2.getName())
                val.push([allPath[i],path_weight])
                path_hash.set(v2.getName(), val)
            }
           // знаходимо мінімальні шляхи по вазі
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
            // maxPath ===  [[],number] ===  [path, weight] | path = [v1,v2,v3....], weight = {number}
            let maxPath = minPaths[0]
            for (let i = 1 ; i < minPaths;i++){
                if (minPaths[i][1] > maxPath[1])
                    maxPath = minPaths[i]
            }

            //  знаходимо із мінімальних шляхів - максимальний


            /* psevdocode

розбили весь шлях на напрямки розгалудження

            let path_hash = {}
            let index = getIndexByVertexName(pacmanNearestVertex)
            for(let i = 0 ; adj[index]; i++){
                path_hash[adj[index].getName()] = []
            }

розбили всі 52 варіанти по різним хешам

            for(let i = 0 ; i < allPath.length; i++){
                 let v2 = allPath[i][1]
                 let path_weight = countPathWeight(v2)
                 path_hash[v2.getName()].push([v2, path_weight])
            }
            КОМЕНТАР : тут доцільніше напевно не відразу рахувати вагу
            а рахувати вагу після того як все розподілив, тому що, я заповний перше розгалудження - відсортував його - обрав мінімальний
            та перейшов до наступного розгалудження - чи це краще тим, що якщо багато розгалуджень то воно по ідеї може рахувати вагу не кожного шляху
            а лише до того шляху, який меншим буде (типу якщо у 1 розгалудженні мінімалььний це 50, а у другому розгалудженні я знайшов 44, то я далі не рахуватиму, бо це вже менше ніж із першого)

            не впевнений що це гарний варіант
            робити таку структуру для сортування
            vName1 : [v1,weight], [v2,weight]
            vName2 : [v1,weight], [v2,weight], [v3,weight]
            vName3 : [v1,weight], [v2,weight]

            я просто хз як її сортувати поки
            АХАХА так її сортувати не потрібно - просто треба знайти мінімум (Складність N - це швидше всіх сортувань)
            просто фором пройтись ---- це буде простіше

*/

        }


        // якщо лежить в одному напрямку без перешкод
        // todo додати перевырку на привида
        if (obstaclesInTheWay[0]) {

            // go by X
            if (obstaclesInTheWay[1]) {
                if (beanX < x) {
                    // x--
                    dir = "LEFT"
                } else {
                    dir = "RIGHT"
                    // x++
                }
            }
            // go by Y
            else if (obstaclesInTheWay[2]) {
                if (beanY < y) {
                    dir = "TOP"
                    // y--
                } else {
                    dir = "BOTTOM"
                    // y++
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
                dir = getDirFromVertex1ToVertex2(x, y, beanNearestVertex)
            } else {

                let bfs_path = findShortestDist_BFS(adj, pacmanNearestVertex, beanNearestVertex, vertexes.length)

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
                    dir = getDirFromVertex1ToVertex2(x, y, bfs_path[1])
                }
                // if stay between vertexes
                else {
                    if (stayBetweenVertexes(x, y, bfs_path[0], bfs_path[1])) {
                        dir = getDirFromVertex1ToVertex2(x, y, bfs_path[1])
                    } else {
                        dir = getDirFromVertex1ToVertex2(x, y, bfs_path[0])
                    }
                }
            }
        }

        let step = doOneStep(dir, x, y)
        this._posX = step[0]
        this._posY = step[1]
    }


}
