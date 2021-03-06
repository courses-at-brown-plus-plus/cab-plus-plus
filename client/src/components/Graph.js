class CourseNode {
  constructor(id, edges, ports, isDummy = false, invisible = false, name="", desc="", categories=[]) {
    this.id = id;
    this.edges = edges;
    this.ports = ports;
    this.isDummy = isDummy;
    this.invisible = false;
    this.active = false;
    this.name = name;
    this.desc = desc;
    this.categories = categories;
  }
}

class Edge {
  constructor(start, end, port) {
    this.start = start;
    this.end = end;
    this.port = port;
  }
}

//A node graph should be an Map of id : Node
//An edge graph should be any collection of edges

export { CourseNode, Edge };