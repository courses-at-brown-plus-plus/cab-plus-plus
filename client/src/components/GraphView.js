import React, {useRef, useEffect, useState} from 'react';
import { CourseNode, Edge } from './Graph';
import prepareGraph from './LayerGraph';

const NODE_WIDTH = 80;
const NODE_HEIGHT = 50;

function GraphView(props) {
  const canvasRef = useRef(null);
  
  // let nodeGraphRef = useRef(props.graph);
  // let nodeGraph = nodeGraphRef.current;
  let nodeGraph = props.graph;
  let layersRef = useRef(null);
  let layers = layersRef.current;

  const [xOffset, setXOffset] = useState(100.5);
  const [yOffset, setYOffset] = useState(0.5);

  const [activeNodes, setActiveNodes] = useState([]);

  // Screen coordinates of center of each node
  const nodeCoords = useRef(new Map());

  const [focus, setFocus] = useState(false);


  // Current mouse coordinates
  let [mouseX, setMouseX] = useState(0);
  let [mouseY, setMouseY] = useState(0);

  // Whether mouse is held down
  let [mouseDown, setMouseDown] = useState(false);

  // Coordinates of location of last mouse down
  let [mouseDownX, setMouseDownX] = useState(0);
  let [mouseDownY, setMouseDownY] = useState(0);

  // Canvas zoom level
  let [scaleFactor, setScaleFactor] = useState(1);

  // ??? dont delete tho u will break everything
  let [origYOffset, setOrigYOffset] = useState(100.5);
  let [origXOffset, setOrigXOffset] = useState(0.5);



  useEffect(() => {
    layersRef.current = prepareGraph(nodeGraph)
    layers = layersRef.current;
  }, [])

  useEffect(() => {
    layersRef.current = prepareGraph(nodeGraph)
    layers = layersRef.current;
  }, [props.graph])

  function drawNode(ctx, node, x, y) {
    if (focus && !activeNodes.includes(node.id)) {
      ctx.globalAlpha = 0.5;
    }
    ctx.fillStyle = 'white';
    ctx.fillRect(x - NODE_WIDTH / 2, y - NODE_HEIGHT / 2, NODE_WIDTH, NODE_HEIGHT);
    if (activeNodes.includes(node.id)) {
      ctx.strokeStyle = 'black';
    } else {
      ctx.strokeStyle = '#ccc';
    }
    ctx.strokeRect(x - NODE_WIDTH / 2, y - NODE_HEIGHT / 2, NODE_WIDTH, NODE_HEIGHT);
    ctx.fillStyle = 'black';
    ctx.font = "14px Helvetica";
    ctx.textAlign = "center";
    ctx.fillText(node.id, x - NODE_WIDTH / 2 + NODE_WIDTH / 2, y - NODE_HEIGHT / 2 + 20);
    ctx.globalAlpha = 1;
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
    setMouseX(event.pageX - canvas.offsetLeft);
    setMouseY(event.pageY - canvas.offsetTop);


    if (mouseDown) {
      setXOffset(origXOffset + (event.clientX - mouseDownX) / scaleFactor);
      setYOffset(origYOffset + (event.clientY - mouseDownY) / scaleFactor);
    }


    for (let [node, coords] of nodeCoords.current) {
      if (nodeGraph.has(node)
        && Math.abs(mouseX - coords[0]) < NODE_WIDTH / 2 
        && Math.abs(mouseY - coords[1]) < NODE_HEIGHT / 2) {
        if (!focus) {
          nodeGraph.get(node).active = true;
          let l = [];
          makeActive(node, l);
          setActiveNodes(l);
        }
        canvas.style.cursor = 'pointer';
        return;
      }
    }
    if (!focus) {
      setActiveNodes([]);
    }
    canvas.style.cursor = 'default';
  }

  function handleMouseUp(event) {
    let canvas = canvasRef.current;
    setMouseDown(false);
    setMouseX(event.pageX - canvas.offsetLeft);
    setMouseY(event.pageY - canvas.offsetTop);
    for (let [node, coords] of nodeCoords.current) {
      if (nodeGraph.has(node)
        && Math.abs(mouseX - coords[0]) < NODE_WIDTH / 2 
        && Math.abs(mouseY - coords[1]) < NODE_HEIGHT / 2) {
        setFocus(true);
        nodeGraph.get(node).active = true;
        let l = [];
        makeActive(node, l);
        setActiveNodes(l);
        return;
      }
    }
    setFocus(false);
  }

  function handleMouseDown(e) {
    setMouseDown(true);
    setMouseDownX(e.clientX);
    setMouseDownY(e.clientY);
    setOrigXOffset(xOffset);
    setOrigYOffset(yOffset);
  }

  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');


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
        nodeCoords.current.set(layers[i][j].id, [x + xOffset, y + yOffset]);
        x += 100;
      }
      y += 100;
    }

    let activeEdges = [];
    for (let [node, coords] of nodeCoords.current.entries()) {
      ctx.beginPath();
      if (nodeGraph.has(node)) {
        drawNode(ctx, nodeGraph.get(node), coords[0], coords[1]);

        for (let i = 0; i < nodeGraph.get(node).edges.length; i++) {
          let edge = nodeGraph.get(node).edges[i];
          if (activeNodes.includes(edge.start)) {
            activeEdges.push(edge)
            continue;
          }
          let xOffset = edge.port * 10

          let start = nodeCoords.current.get(edge.start);
          let end = nodeCoords.current.get(edge.end);
          if (start === undefined || end === undefined) {
            continue;
          }
          ctx.moveTo(start[0], start[1] + NODE_HEIGHT / 2);
          ctx.lineTo(end[0] + xOffset, end[1] - NODE_HEIGHT / 2);
          ctx.strokeStyle = '#ccc';
          ctx.stroke();
        }
      }
      ctx.closePath();
    }
    for (let edge of activeEdges) {
      let xOffset = edge.port * 10
      let start = nodeCoords.current.get(edge.start);
      let end = nodeCoords.current.get(edge.end);
      ctx.moveTo(start[0], start[1] + NODE_HEIGHT / 2);
      if (start === undefined || end === undefined) {
        continue;
      }
      ctx.lineTo(end[0] + xOffset, end[1] - NODE_HEIGHT / 2);
      ctx.strokeStyle = '#666';
      ctx.stroke();
    }
  });

  return (
    <div>
      <canvas ref={canvasRef} width={props.width} height={props.height} onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp} onMouseDown = {handleMouseDown}/>
    </div>
  );
}

export default GraphView;
