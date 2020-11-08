import {Vertex} from "../graph/vertex.js";

export let adj = [],
    vertexes = [
    //A
    new Vertex("A0", 1, 1, 0),
    new Vertex("A1", 1, 4, 1),
    new Vertex("A2", 5, 4, 2),
    new Vertex("A3", 5, 1, 3),
    new Vertex("A4", 15, 1, 4),
    new Vertex("A5", 15, 4, 5),
    new Vertex("A6", 15, 5, 6),
    new Vertex("A7", 9, 5, 7),
    new Vertex("A8", 9, 8, 8),
    new Vertex("A9", 11, 8, 9),
    //B
    new Vertex("B0", 31, 1, 10),
    new Vertex("B1", 31, 4, 11),
    new Vertex("B2", 23, 4, 12),
    new Vertex("B3", 23, 12, 13),
    new Vertex("B4", 20, 12, 14),
    new Vertex("B5", 17, 12, 15),
    new Vertex("B6", 15, 12, 16),
    new Vertex("B7", 6, 12, 17),
    new Vertex("B8", 5, 12, 18),
    new Vertex("B9", 1, 12, 19),
    //C
    new Vertex("C0", 1, 15, 20),
    new Vertex("C1", 6, 15, 21),
    new Vertex("C2", 17, 15, 22),
    new Vertex("C3", 20, 15, 23),
    new Vertex("C4", 31, 15, 24),
    new Vertex("C5", 31, 13, 25),
    new Vertex("C6", 31, 12, 26),
    new Vertex("C7", 34, 13, 27),
    new Vertex("C8", 34, 15, 28),
    new Vertex("C9", 37, 15, 29),
    //D
    new Vertex("D0", 37, 13, 30),
    new Vertex("D1", 40, 13, 31),
    new Vertex("D2", 40, 12, 32),
    new Vertex("D3", 40, 15, 33),
    new Vertex("D4", 50, 15, 34),
    new Vertex("D5", 56, 15, 35),
    new Vertex("D6", 56, 12, 36),
    new Vertex("D7", 52, 12, 37),
    new Vertex("D8", 50, 12, 38),
    new Vertex("D9", 44, 12, 39),
    //E
    new Vertex("E0", 44, 4, 40),
    new Vertex("E1", 44, 1, 41),
    new Vertex("E2", 50, 1, 42),
    new Vertex("E3", 56, 1, 43),
    new Vertex("E4", 56, 4, 44),
    new Vertex("E5", 52, 4, 45),
    new Vertex("E6", 50, 4, 46),
    new Vertex("E7", 52, 9, 47),
    new Vertex("E8", 48, 9, 48),
    new Vertex("E9", 40, 1, 49),
    //F
    new Vertex("F0", 40, 4, 50),
    new Vertex("F1", 40, 10, 51),
    new Vertex("F2", 31, 10, 52),
]

function addEdge(adj, a, b) {
    adj[a.getID()].push(b)
    adj[b.getID()].push(a)
}

export function fillADJ() {
    for (let i = 0; i < vertexes.length; i++) {
        adj.push([])
    }
    addEdge(adj, vertexes[0], vertexes[1])
    addEdge(adj, vertexes[0], vertexes[3])
    addEdge(adj, vertexes[1], vertexes[2])
    addEdge(adj, vertexes[3], vertexes[4])
    addEdge(adj, vertexes[3], vertexes[2])
    addEdge(adj, vertexes[4], vertexes[5])
    addEdge(adj, vertexes[4], vertexes[10])
    addEdge(adj, vertexes[2], vertexes[18])
    addEdge(adj, vertexes[18], vertexes[17])
    addEdge(adj, vertexes[18], vertexes[19])
    addEdge(adj, vertexes[19], vertexes[20])
    addEdge(adj, vertexes[20], vertexes[21])
    addEdge(adj, vertexes[21], vertexes[17])
    addEdge(adj, vertexes[17], vertexes[16])
    addEdge(adj, vertexes[16], vertexes[15])
    addEdge(adj, vertexes[16], vertexes[6])
    addEdge(adj, vertexes[5], vertexes[6])
    addEdge(adj, vertexes[6], vertexes[7])
    addEdge(adj, vertexes[7], vertexes[8])
    addEdge(adj, vertexes[8], vertexes[9])
    addEdge(adj, vertexes[15], vertexes[14])
    addEdge(adj, vertexes[14], vertexes[23])
    addEdge(adj, vertexes[14], vertexes[13])
    addEdge(adj, vertexes[21], vertexes[22])
    addEdge(adj, vertexes[22], vertexes[15])
    addEdge(adj, vertexes[10], vertexes[49])
    addEdge(adj, vertexes[10], vertexes[11])
    addEdge(adj, vertexes[11], vertexes[12])
    addEdge(adj, vertexes[12], vertexes[5])
    addEdge(adj, vertexes[12], vertexes[13])
    addEdge(adj, vertexes[13], vertexes[26])
    addEdge(adj, vertexes[23], vertexes[24])
    addEdge(adj, vertexes[24], vertexes[25])
    addEdge(adj, vertexes[25], vertexes[26])
    addEdge(adj, vertexes[25], vertexes[27])
    addEdge(adj, vertexes[27], vertexes[28])
    addEdge(adj, vertexes[28], vertexes[29])
    addEdge(adj, vertexes[29], vertexes[30])
    addEdge(adj, vertexes[30], vertexes[31])
    addEdge(adj, vertexes[32], vertexes[31])
    addEdge(adj, vertexes[31], vertexes[33])
    addEdge(adj, vertexes[33], vertexes[34])
    addEdge(adj, vertexes[34], vertexes[35])
    addEdge(adj, vertexes[34], vertexes[38])
    addEdge(adj, vertexes[35], vertexes[36])
    addEdge(adj, vertexes[36], vertexes[37])
    addEdge(adj, vertexes[37], vertexes[38])
    addEdge(adj, vertexes[37], vertexes[47])
    addEdge(adj, vertexes[47], vertexes[48])
    addEdge(adj, vertexes[47], vertexes[45])
    addEdge(adj, vertexes[45], vertexes[44])
    addEdge(adj, vertexes[45], vertexes[46])
    addEdge(adj, vertexes[44], vertexes[43])
    addEdge(adj, vertexes[43], vertexes[42])
    addEdge(adj, vertexes[42], vertexes[46])
    addEdge(adj, vertexes[41], vertexes[42])
    addEdge(adj, vertexes[49], vertexes[41])
    addEdge(adj, vertexes[41], vertexes[40])
    addEdge(adj, vertexes[40], vertexes[46])
    addEdge(adj, vertexes[40], vertexes[39])
    addEdge(adj, vertexes[39], vertexes[38])
    addEdge(adj, vertexes[39], vertexes[32])
    addEdge(adj, vertexes[11], vertexes[50])
    addEdge(adj, vertexes[50], vertexes[49])
    addEdge(adj, vertexes[11], vertexes[52])
    addEdge(adj, vertexes[52], vertexes[26])
    addEdge(adj, vertexes[52], vertexes[51])
    addEdge(adj, vertexes[51], vertexes[32])
    addEdge(adj, vertexes[50], vertexes[51])
}
