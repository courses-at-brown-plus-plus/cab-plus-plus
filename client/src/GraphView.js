import React, {useState, useRef, useEffect} from 'react';
import { Node, Edge } from './Graph';


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
    ctx.fillRect(x, y, 70, 40);
    ctx.fillStyle = 'black';
    ctx.fillText(node.id, x + 10, y + 10);
  }

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

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, props.width, props.height);

    let layers = layerGraph(props.graph);

    let y = 0;
    for (let i = 0; i < layers.length; i++) {
      let x = 0;
      for (let j = 0; j < layers[i].length; j++) {
        drawNode(ctx, layers[i][j], x, y);
        x += 100;
      }
      y += 100;
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={props.width} height={props.height}/>
    </div>
  );
}

export default GraphView;