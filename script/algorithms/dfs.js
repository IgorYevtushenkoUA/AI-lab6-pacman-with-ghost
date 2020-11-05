function findDist_DFS  (adj, source, final) {
    let visited = []
    let prior = []
    for (let i = 0; i < 53; i++) {
        visited[i] = false
        prior[i] = -1
    }
    _DFS_Algorithm(adj, source, final, source, prior, visited)
    return _getPath(source, final, prior);
}

function _DFS_Algorithm(adj, source, dist, from, prior, visited) {
    if (visited[source.getID()] === true) {

        return
    }
    visited[source.getID()] = true
    prior[source.getID()] = from

    if (source === dist) {
        return
    }
    for (let i = 0; i < adj[source.getID()].length; i++) {
        _DFS_Algorithm(adj, adj[source.getID()][i], dist, source, prior, visited)
    }
}

function _getPath(start, finish, prior) {
    let ans = []

    for (let v = finish; v != start; v = prior[v.getID()]) {
        ans.push(v)
    }
    ans.push(start)
    ans = ans.reverse()
    return ans
}
