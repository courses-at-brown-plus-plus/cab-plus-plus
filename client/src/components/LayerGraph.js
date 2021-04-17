// Convert from node representation to edge representation
function nodeToEdgeGraph(nodeGraph) {
  let result = new Set();
  for (let node of nodeGraph.values()) {
    for (let edge of node.edges) {
      result.add(edge);
    }
  }
  return Array.from(result);
}

// DFS implementation of topological sort
function topoSort(nodeGraph) {
  let perm = [];
  let temp = [];
  let result = [];


  function visit(node) {
    if (perm.includes(node)) {
      return true;
    } if (temp.includes(node)) {
      return false;
    }

    temp.push(node);

    for (let edge of node.edges) {
      let n = nodeGraph.get(edge.end);
      if (n !== undefined) {
        visit(nodeGraph.get(edge.end));
      }
    }

    temp = temp.filter(x => x.id !== node.id);
    perm.push(node);
    result.unshift(node);
  }

  while (perm.length !== nodeGraph.size) {
    let n;
    for (let node of nodeGraph.values()) {
      if (!perm.includes(node)) {
        n = node;
        break;
      }
    }
    visit(n);
  }

  return result;
}

// Finds the length of the longest path from the top level of a DAG to every node
function longestPath(nodeGraph) {
  let edges = nodeToEdgeGraph(nodeGraph);
  let sorted = topoSort(nodeGraph);
  let lengths = new Map();
  for (let node of sorted) {
    let maxDist = 0;
    for (let edge of edges) {
      if (edge.end === node.id) {
        if (lengths.get(nodeGraph.get(edge.start)) + 1 > maxDist) {
          maxDist = lengths.get(nodeGraph.get(edge.start)) + 1;
        }
      }
    }
    lengths.set(node, maxDist);
  }
  return lengths;
}

// Separate nodes of a DAG into layers based on length of longest path from top level
function layerGraph(nodeGraph) {
  let depths = longestPath(nodeGraph)
  let result = [];
  for (let [node, depth] of depths.entries()) {
    for (let j = 0; j <= depth - result.length; j++) {
      result.push([])
    }
    result[depth].push(node);
  }
  return result;
}

/*
Given the top layer of a graph, removes all nodes that have no children, and returns
those nodes in a separate list
*/
function separateGraph(topLayer) {
  let alone = new Map();
  for (let i = topLayer.length - 1; i >= 0; i--) {
    if (topLayer[i].edges.length === 0) {
      alone.set(topLayer[i].id, topLayer[i]);
      topLayer.splice(i, 1)
    }
  }
  return alone;
}

/*
Consumes a map of id : CourseNode, and returns a map of id : [x, y] such that
the [x, y] coordinates arrange the nodes into a square grid.
*/
function box(nodeMap) {
  let width = Math.floor(Math.sqrt(nodeMap.size));
  let i = 0;
  let result = new Map();

  for (let id of nodeMap.keys()) {
    result.set(id, [i % width, Math.floor(i / width)])
    i++;
  }
  return result;
}

/*
Returns a map from each node id of layer2 to the mean x coordinate of its parent nodes
in layer 1.
*/
function getMeanCoords(nodeGraph, layers, layer2) {
  let medians = new Map();
  for (let node2 of layer2) {
    let l = [];
    for (let k = 0; k < layers.length; k++) {
      let layer1 = layers[k];
      for (let i = 0; i < layer1.length; i++) {
        let node1 = nodeGraph.get(layer1[i].id);
        for (let edge of node1.edges) {
          if (edge.end === node2.id) {
            l.push(layer1[i].coord)
          }
        }
      }
      l.sort(function(a, b) {return a.coord - b.coord;});
      if (l.length > 0) {
        medians.set(node2.id, Math.round(l.reduce((a, b) => a + b) / l.length * 2) / 2);
      }
    }
  }
  return medians;
}

/*
Converts the map produced by getMeanCoords into a list of {key, value} pairs sorted in order
of increasing x coordinate.
*/
function orderedMapFromCoords(coordMap) {
  let result = [];
  for (let [item, coord] of coordMap.entries()) {
    result.push({id: item, coord: coord});
  }
  result.sort(function(a, b) {return a.coord - b.coord});
  return result;
}

/*
Arranges the nodes in a single layers such that each is as close to its average parent coordinate,
but no nodes overlap.
*/
function arrangeNodes(layer) {
    let medians = new Map();

    for (let i = 0; i < layer.length; i++) {
      medians.set(layer[i].id, layer[i].coord);
    }

    let dxMap = new Map();
    for (let i = 0; i < layer.length; i++) {
      dxMap.set(layer[i].id, 0);
    }

    let counter = 0;
    while (counter < 100000) {
        counter++;
        for (let id of dxMap.keys()) {
          dxMap.set(id, 0);
        }
        for (let i = 0; i < layer.length - 1; i++) {
            // Assign each node a dx value, which causes it to move left or right
            // in a manner that pulls it toward its parent nodes and pushes it
            // away from any overlapping nodes

            let dx = 0;

            if (!(i < layer.length - 1 && layer[i + 1].coord - layer[i].coord < 1) 
              && !(i > 0 && layer[i].coord - layer[i - 1].coord < 1)) {
              dx += 0.03 * Math.sign(medians.get(layer[i].id) - layer[i].coord);
            }

            if (i < layer.length - 1 && layer[i + 1].coord - layer[i].coord < 1) {
                dx -= 0.03;
                dxMap.set(layer[i + 1].id, dxMap.get(layer[i + 1].id) + 0.03)
            }

            if (i > 0 && layer[i].coord - layer[i - 1].coord < 1) {
                dx += 0.03;
                dxMap.set(layer[i - 1].id, dxMap.get(layer[i - 1].id) - 0.03)
            }

            dxMap.set(layer[i].id, dxMap.get(layer[i].id) + dx)
        }
        for (let i = 0; i < layer.length - 1; i++) {
          layer[i].coord += dxMap.get(layer[i].id);
        }
    }

    // Position nodes at the nearest multiple of 0.5, ensuring that none overlap.
    let minCoord = -Infinity;
    for (let i = 0; i < layer.length; i++) {
      if (false) {
        layer[i].coord = minCoord + 1;
      } else {
        layer[i].coord = Math.max(minCoord, Math.round(layer[i].coord * 2) / 2);
      }
      minCoord = layer[i].coord + 1;
    }

    return layer;
}

/*
Assigns coordinates to each node of layeredGraph such that nodes are placed as close to the
average location of their parents as possible.
*/
function assignCoords(nodeGraph, layeredGraph) {
  let result = [[]]
  for (let i = 0; i < layeredGraph[0].length; i++) {
    result[0].push({id: layeredGraph[0][i].id, coord: i});
  }

  for (let i = 1; i < layeredGraph.length; i++) {
    let medians = getMeanCoords(nodeGraph, result.slice(0, i), layeredGraph[i]);
    result.push(arrangeNodes(orderedMapFromCoords(medians)))
  }

  return result;
}

// Combines the above functions into a single method
function prepareGraph(nodeGraph) {
  let result = layerGraph(nodeGraph);
  let alone = separateGraph(result[0]);
  let temp = assignCoords(nodeGraph, result);
  return [box(alone), temp];
}

export default prepareGraph;