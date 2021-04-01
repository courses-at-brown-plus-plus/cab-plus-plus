import React, {useRef, useEffect, useState} from 'react';
import { CourseNode, Edge } from './Graph'

const NODE_WIDTH = 80;
const NODE_HEIGHT = 50;

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
      visit(nodeGraph.get(edge.end));
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
        node.edges[i] = new Edge(edge.start, dNode.id, 0);
        dNode.edges.push(new Edge(dNode.id, edge.end));
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

// Position each node between its neighbors
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
  layer2.sort((a, b) => medians.get(a.id) - medians.get(b.id));

  return layer2;
}

// Permute layer to minimize crossings
function permuteGraph(layerGraph, nodeGraph) {
  
  for (let n = 1; n < layerGraph.length; n++) {
    let layer1 = [...layerGraph[n - 1]];
    let layer2 = [...layerGraph[n]];
    layerGraph[n] =  medianHeuristic(layer1, layer2);
  }


  let minCross = countCrossingsGraph(layerGraph, nodeGraph);;
  for (let i = 0; i < 10000; i++) {
    let depth = 1 + Math.floor(Math.random() * (layerGraph.length - 1))
    let left = Math.floor(Math.random() * (layerGraph[depth].length - 1))
    let right = left + 1;
    [layerGraph[depth][left], layerGraph[depth][right]] = [layerGraph[depth][right], layerGraph[depth][left]];
    let c2 = countCrossingsGraph(layerGraph, nodeGraph);
    if (c2 > minCross) {
      [layerGraph[depth][left], layerGraph[depth][right]] = [layerGraph[depth][right], layerGraph[depth][left]];
    } else {
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
              node.edges[k] = new Edge(node.id, edge2.end);
              nodeGraph.delete(dNode.id);
              layeredGraph[i].splice(j, 1);
            }
          }
        }
      }
    }
  }
}

function addInvisibleNodes(layeredGraph) {
  
}

function prepareGraph(nodeGraph) {
  let result = layerGraph(nodeGraph);
  addDummyVertices(nodeGraph, result);
  result = permuteGraph(result, nodeGraph);
  removeDummyVertices(result, nodeGraph);
  return result;
}

function GraphView(props) {
  const canvasRef = useRef(null);
  
  let nodeGraphRef = useRef(props.graph);
  let nodeGraph = nodeGraphRef.current;
  let layersRef = useRef(null);
  let layers = layersRef.current;

  const [activeNodes, setActiveNodes] = useState([]);

  // Screen coordinates of center of each node
  const nodeCoords = useRef(new Map());

  useEffect(() => {
    layersRef.current = prepareGraph(nodeGraph)
    layers = layersRef.current;
  }, [])

  function drawNode(ctx, node, x, y) {
    let expand = 0;

    ctx.fillStyle = 'white';
    if (activeNodes.includes(node.id)) {
      ctx.fillRect(x - NODE_WIDTH / 2 - expand, y - NODE_HEIGHT / 2 - expand, NODE_WIDTH + 2 * expand, NODE_HEIGHT + 2 * expand);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(x - NODE_WIDTH / 2 - expand, y - NODE_HEIGHT / 2 - expand, NODE_WIDTH + 2 * expand, NODE_HEIGHT + 2 * expand);
    } else {
      ctx.fillRect(x - NODE_WIDTH / 2, y - NODE_HEIGHT / 2, NODE_WIDTH, NODE_HEIGHT);
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(x - NODE_WIDTH / 2, y - NODE_HEIGHT / 2, NODE_WIDTH, NODE_HEIGHT);
    }
    ctx.fillStyle = 'black';
    ctx.font = "14px Helvetica";
    ctx.textAlign = "center";
    ctx.fillText(node.id, x - NODE_WIDTH / 2 + NODE_WIDTH / 2, y - NODE_HEIGHT / 2 + 20);
  }

  function makeActive(node, activeList) {
    if (!nodeGraph.has(node)) {
      return;
    }
    activeList.push(node);
    for (let edge of nodeGraph.get(node).edges) {
      makeActive(edge.end, activeList);
    }
  }

  function handleMouseMove(event) {
    let canvas = canvasRef.current;
    let mouseX = event.clientX - canvas.offsetLeft;
    let mouseY = event.clientY - canvas.offsetTop;
    for (let [node, coords] of nodeCoords.current) {
      if (nodeGraph.has(node)
        && Math.abs(mouseX - coords[0]) < NODE_WIDTH / 2 
        && Math.abs(mouseY - coords[1]) < NODE_HEIGHT / 2) {
        nodeGraph.get(node).active = true;
        let l = [];
        makeActive(node, l);
        setActiveNodes(l);
        canvas.style.cursor = 'pointer';
        return;
      }
    }
    setActiveNodes([]);
    canvas.style.cursor = 'default';
  }

  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');
    ctx.translate(0.5, 0.5);


    // Fix canvas blur
    // https://dev.to/pahund/how-to-fix-blurry-text-on-html-canvases-on-mobile-phones-3iep
    const ratio = Math.ceil(window.devicePixelRatio);
    canvas.width = props.width * ratio;
    canvas.height = props.height * ratio;
    canvas.style.width = `${props.width}px`;
    canvas.style.height = `${props.height}px`;
    canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);




    ctx.clearRect(0, 0, props.width, props.height);
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, props.width, props.height);

    let y = 40;
    for (let i = 0; i < layers.length; i++) {
      for (let j = 0; j < layers[i].length; j++) {
        // center nodes horizontally
        let x = props.width / 2 + ((layers[i].length - 1) / 2 - j) * 100
        nodeCoords.current.set(layers[i][j].id, [x, y]);
        x += 100;
      }
      y += 100;
    }

    for (let [node, coords] of nodeCoords.current.entries()) {
      ctx.beginPath();
      if (nodeGraph.has(node)) {
        drawNode(ctx, nodeGraph.get(node), coords[0], coords[1]);
        for (let i = 0; i < nodeGraph.get(node).edges.length; i++) {
          let edge = nodeGraph.get(node).edges[i];
          let start = nodeCoords.current.get(edge.start);
          ctx.moveTo(start[0], start[1] + NODE_HEIGHT / 2);
          let end = nodeCoords.current.get(edge.end);
          ctx.lineTo(end[0], end[1] - NODE_HEIGHT / 2);
          ctx.strokeStyle = '#ccc';
          if (activeNodes.includes(edge.start)) {
            ctx.strokeStyle = '#777';
          }
          ctx.stroke();
        }
      }
      ctx.closePath();
    }
    ctx.translate(-0.5, -0.5);
  });

  return (
    <div>
      <canvas ref={canvasRef} width={props.width} height={props.height} onMouseMove={handleMouseMove}/>
    </div>
  );
}

export default GraphView;