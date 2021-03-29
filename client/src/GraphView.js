import React, {useState, useRef, useEffect} from 'react';
import { Node, Edge } from './Graph';


const NODE_WIDTH = 80;
const NODE_HEIGHT = 50;

function GraphView(props) {
  const canvasRef = useRef(null);

  const graph = useRef(null);

  function nodeToEdgeGraph(nodeGraph) {
    let result = new Set();
    for (let node of nodeGraph.values()) {
      for (let edge of node.edges) {
        result.add(edge);
      }
    }
    return Array.from(result);
  }

  //Given a graph, returns all nodes that are not the endpoint of an edge
  function getStartNodes(nodeGraph) {
    let result = new Map(nodeGraph);
    let edges = nodeToEdgeGraph(nodeGraph);
    for (let i = 0; i < edges.length; i++) {
      result.delete(edges[i].end);
    }
    return Array.from(result.values());
  }

  function drawNode(ctx, node, x, y) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x - NODE_WIDTH / 2, y - NODE_HEIGHT / 2, NODE_WIDTH, NODE_HEIGHT);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x - NODE_WIDTH / 2, y - NODE_HEIGHT / 2, NODE_WIDTH, NODE_HEIGHT);
    ctx.fillStyle = 'black';
    ctx.font = "14px Helvetica";
    ctx.textAlign = "center";
    ctx.fillText(node.id, x - NODE_WIDTH / 2 + NODE_WIDTH / 2, y - NODE_HEIGHT / 2 + 20);
  }

  // Separate nodes into layers
  function layerGraph(nodeGraph) {
    let nodesRemaining = Array.from(nodeGraph.values());
    let layers = [getStartNodes(nodeGraph)];
    nodesRemaining = nodesRemaining.filter(x => !layers[layers.length - 1].includes(x));

    while (nodesRemaining.length > 0) {
      let lastLayer = layers[layers.length - 1];
      let newLayer = new Set();
      for (let i = 0; i < lastLayer.length; i++) {
        for (let j = 0; j < lastLayer[i].edges.length; j++) {
          let node = nodeGraph.get(lastLayer[i].edges[j].end);
          if (node !== undefined && nodesRemaining.includes(node)) {
            newLayer.add(node);
          }
        }
      }
      nodesRemaining = nodesRemaining.filter(x => !newLayer.has(x));
      layers.push(Array.from(newLayer));
    }
    return layers;
  }

  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, props.width, props.height);

    let layers = layerGraph(props.graph);


    let nodeCoords = new Map();
    let y = 40;
    for (let i = 0; i < layers.length; i++) {
      for (let j = 0; j < layers[i].length; j++) {
        // center nodes horizontally
        let x = props.width / 2 + ((layers[i].length - 1) / 2 - j) * 100
        nodeCoords.set(layers[i][j], [x, y]);
        x += 100;
      }
      y += 100;
    }

    for (let [node, coords] of nodeCoords.entries()) {
      console.log([node, coords])
      drawNode(ctx, node, coords[0], coords[1]);
      ctx.beginPath();
      for (let i = 0; i < node.edges.length; i++) {
        let edge = node.edges[i];
        let start = nodeCoords.get(props.graph.get(edge.start));
        ctx.moveTo(start[0], start[1] + NODE_HEIGHT / 2);
        let end = nodeCoords.get(props.graph.get(edge.end));
        ctx.lineTo(end[0], end[1] - NODE_HEIGHT / 2);
      }
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.closePath();
    }

  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={props.width} height={props.height}/>
    </div>
  );
}

export default GraphView;