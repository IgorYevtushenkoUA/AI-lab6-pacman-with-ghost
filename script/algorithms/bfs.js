function findShortestDist_BFS(adj, s, dest, v) {
    let pred = []
    let dist = []
    if (_BFS_Algorithm(adj, s, dest, v, pred, dist) === false) {
        return "can not find the path"
    }
    let path = []
    let crawl = dest
    path.push(crawl)
    while (pred[crawl.getID()] !== -1) {
        path.push(pred[crawl.getID()])
        crawl = pred[crawl.getID()]
    }
    let bfs_path = []

    for (let i = path.length - 1; i >= 0; i--)
        bfs_path.push(path[i])
    return bfs_path
}

function _BFS_Algorithm(adj, edgeSource, edgeDestination, v, pred, dist) {
    let queue = []
    let visited = []

    for (let i = 0; i < v; i++) {
        visited[i] = false
        dist[i] = Number.MAX_SAFE_INTEGER
        pred[i] = -1
    }

    visited[edgeSource.getID()] = true
    dist[edgeSource.getID()] = 0
    queue.push(edgeSource)


    while (queue.length > 0) {
        let u = queue.shift()
        for (let i = 0; i < adj[u.getID()].length; i++) {
            if (visited[adj[u.getID()][i].getID()] === false) {
                visited[adj[u.getID()][i].getID()] = true
                dist[adj[u.getID()][i].getID()] = dist[u.getID()] + 1

                pred[adj[u.getID()][i].getID()] = u
                queue.push(adj[u.getID()][i])
                if (adj[u.getID()][i] == edgeDestination) {
                    return true
                }
            }
        }
    }
    return false
}
