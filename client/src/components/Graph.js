class Node {
  constructor(id, edges, ports) {
    this.id = id;
    this.edges = edges;
    this.ports = ports;
  }
}

class Edge {
  constructor(start, end, port) {
    this.start = start;
    this.end = end;
    this.port = port;
  }
}

//A node graph should be a Map of id : Node
//An edge graph should be any collection of edges

export { Node, Edge };