import { Edge, CourseNode } from './Graph';

/*Sugiyama's algorithm overview
  1) Give each vertex a vertical position based on the longest path from the vertex to the 
     top level.
  2) Add dummy vertices so that edges which span multiple lines are broken into smaller edges
     which connect at dummy vertices
  3) Horizontally order vertices to minimize edge crossings - done by positioning each vertex at
     the median of its parent coordinates, then randomly swapping vertices as long as that
     decreases the total number of crossings
  4) Remove dummy vertices
  5) Add invisible nodes to properly space vertices below their parents
*/

// Convert from node representation to edge representation
function nodeToEdgeGraph(nodeGraph) {
  let result = new Set();
  for (let [id, node] of nodeGraph.entries()) {
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

//Replace edges that span multiple lines with smaller edges that meet at dummy vertices
function addDummyVertices(nodeGraph, layeredGraph) {
  let depths = longestPath(nodeGraph);
  for (let j = 0; j < layeredGraph.length - 1; j++) {
    for (let k = 0; k < layeredGraph[j].length; k++) {
      let node = layeredGraph[j][k]; 
      for (let i = 0; i < node.edges.length; i++) {
        let edge = node.edges[i];
        let startDepth = j;
        let endDepth = depths.get(nodeGraph.get(edge.end));
        if (endDepth - startDepth === 1) {
          continue;
        }
        let dNode = new CourseNode('' + i + ',' + j + ',' + k, [], [], true)
        layeredGraph[j + 1].push(dNode)
        nodeGraph.set('' + i + ',' + j + ',' + k, dNode)
        node.edges[i] = new Edge(edge.start, dNode.id, edge.port);
        dNode.edges.push(new Edge(dNode.id, edge.end, edge.port));
      }
    }
  }
}

// Detect crossings between two layers
function countCrossings(layer1, layer2, nodeGraph) {
  let crossings = 0;
  for (let node1 of layer1) {
    for (let edge1 of node1.edges) {
      for (let node2 of layer1) {
        for (let edge2 of node2.edges) {
          let start1 = layer1.indexOf(nodeGraph.get(edge1.start));
          let start2 = layer1.indexOf(nodeGraph.get(edge2.start));
          let end1 = layer2.indexOf(nodeGraph.get(edge1.end));
          let end2 = layer2.indexOf(nodeGraph.get(edge2.end));
          if (start1 !== start2 && end1 !== end2 &&
            Math.sign(start1 - start2) !== Math.sign(end1 - end2)) {
            crossings++;
          }
        }
      }
    }
  }
  return crossings / 2;
}

// Count all crossings throughout a graph
function countCrossingsGraph(layeredGraph, nodeGraph) {
  let count = 0;
  for (let i = 0; i < layeredGraph.length - 1; i++) {
    count += countCrossings(layeredGraph[i], layeredGraph[i + 1], nodeGraph);
  }
  return count;
}

// Return a map from each node to the average x coordinate of its parent nodes
function medianHeuristic(layer1, layer2) {
  let medians = new Map();
  for (let node2 of layer2) {
    let l = [];
    for (let i = 0; i < layer1.length; i++) {
      let node1 = layer1[i];
      for (let edge of node1.edges) {
        if (edge.end === node2.id) {
          l.push(i)
        }
      }
    }
    l.sort();
    if (l.length % 2 === 0) {
      medians.set(node2.id, (l[l.length / 2 - 1] + l[l.length / 2]) / 2)
    } else {
      medians.set(node2.id, l[(l.length - 1) / 2])
    }
  }
  return medians;
}

// Position each node between its neighbors
function sortByMedian(layer1, layer2) {
  let medians = medianHeuristic(layer1, layer2)
  layer2.sort((a, b) => medians.get(a.id) - medians.get(b.id));
  return layer2;
}

// Permute layer to minimize crossings
function permuteGraph(layerGraph, nodeGraph) {
  
  for (let n = 1; n < layerGraph.length; n++) {
    let layer1 = [...layerGraph[n - 1]];
    let layer2 = [...layerGraph[n]];
    layerGraph[n] =  sortByMedian(layer1, layer2);
  }


  let minCross = countCrossingsGraph(layerGraph, nodeGraph);



  for (let i = 0; i < 100; i++) {
    let depth = Math.floor(Math.random() * (layerGraph.length - 1))
    let left = Math.floor(Math.random() * (layerGraph[depth].length - 1))
    let right = left + 1;
    [layerGraph[depth][left], layerGraph[depth][right]] = [layerGraph[depth][right], layerGraph[depth][left]];
    let c2 = countCrossingsGraph(layerGraph, nodeGraph);
    if (c2 > minCross) {
      [layerGraph[depth][left], layerGraph[depth][right]] = [layerGraph[depth][right], layerGraph[depth][left]];
    } else if (c2 == minCross) {
      if (layerGraph[depth][left].id > layerGraph[depth][right].id) {
        [layerGraph[depth][left], layerGraph[depth][right]] = [layerGraph[depth][right], layerGraph[depth][left]];
      }
    }
    else {
      minCross = c2;
    }
  }
  return layerGraph
}

// For each dummy vertex, find both connected edges and replace with a single edge
function removeDummyVertices(layeredGraph, nodeGraph) {
  for (let i = 1; i < layeredGraph.length; i++) {
    for (let j = layeredGraph[i].length - 1; j >= 0; j--) {
      let dNode = layeredGraph[i][j];
      if (dNode.isDummy) {
        //Each dummy node has exactly one edge in both directions
        let edge2 = dNode.edges[0];
        for (let node of layeredGraph[i - 1]) {
          for (let k = 0; k < node.edges.length; k++) {
            if (node.edges[k].end === dNode.id) {
              node.edges[k] = new Edge(node.id, edge2.end, edge2.port);
              nodeGraph.delete(dNode.id);
              layeredGraph[i].splice(j, 1);
            }
          }
        }
      }
    }
  }
}

// Add invisible nodes to space and position nodes below their parents
function addInvisibleNodes(layeredGraph) {
  for (let i = 1; i < layeredGraph.length; i++) {
    let numInvis = layeredGraph[i - 1].length - layeredGraph[i].length;
    let medians = medianHeuristic(layeredGraph[i - 1], layeredGraph[i]);
    let currLayer = [...layeredGraph[i]];
    let newLayer = [];

    for (let j = 0; j < layeredGraph[i - 1].length; j++) {
      if (currLayer.length === 0) {
        break;
      }
      if (medians.get(currLayer[0].id) - j < 1) {
        newLayer.push(currLayer.shift())
      } else {
        newLayer.push(new CourseNode('' + i + ',' + j, [], [], false, true));
      }
    }
    newLayer = newLayer.concat(currLayer);
    let targetLength = layeredGraph[i - 1].length - newLayer.length;
    for (let j = 0; j < targetLength; j++) {
      newLayer.push(new CourseNode('' + i + ',' + j * 100, [], [], false, true));
    }
    layeredGraph[i] = newLayer;

  }
}

// Combines the above functions into a single method
function prepareGraph(nodeGraph) {
  let result = layerGraph(nodeGraph);
  addDummyVertices(nodeGraph, result);
  result = permuteGraph(result, nodeGraph);
  removeDummyVertices(result, nodeGraph);
  addInvisibleNodes(result);
  return result;
}

export default prepareGraph;