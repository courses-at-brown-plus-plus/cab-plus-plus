import React, {useRef, useEffect, useState} from 'react';
import { CourseNode, Edge } from './Graph';
import prepareGraph from './LayerGraph';
import CourseView from './CourseView';

import { useSelector } from 'react-redux';
import { selectCoursesTaken } from '../store/slices/appDataSlice';

const NODE_WIDTH = 80;
const NODE_HEIGHT = 50;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;

function GraphView(props) {
  const canvasRef = useRef(null);

  // access redux var for courses taken input on the sidebar
  const coursesTaken = useSelector(selectCoursesTaken);
  // dummy data equivalent
  // const coursesTaken = ["CSCI 0190"];
  
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

  const [showCourseView, setShowCourseView] = useState(false);
  const [courseView, setCourseView] = useState(null);

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

  let [origYOffset, setOrigYOffset] = useState(100.5);
  let [origXOffset, setOrigXOffset] = useState(0.5);

  useEffect(() => {
    layersRef.current = prepareGraph(nodeGraph)
    layers = layersRef.current;
  }, [props.graph])


  function handleMouseMove(event) {
    let canvas = canvasRef.current;
    setMouseX(event.clientX - event.target.getBoundingClientRect().left);
    setMouseY(event.clientY - event.target.getBoundingClientRect().top);

    if (mouseDown) {
      setXOffset(origXOffset + (event.clientX - mouseDownX) / scaleFactor);
      setYOffset(origYOffset + (event.clientY - mouseDownY) / scaleFactor);
    }

    for (let [node, coords] of nodeCoords.current) {
      if (nodeGraph.has(node)
        && Math.abs(mouseX - coords[0]) < NODE_WIDTH / 2 * scaleFactor
        && Math.abs(mouseY - coords[1]) < NODE_HEIGHT / 2 * scaleFactor) {
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
    setShowCourseView(false)
    let canvas = canvasRef.current;
    setMouseDown(false);
    setMouseX(event.clientX - event.target.getBoundingClientRect().left);
    setMouseY(event.clientY - event.target.getBoundingClientRect().top);
    for (let [node, coords] of nodeCoords.current) {
      if (nodeGraph.has(node)
        && Math.abs(mouseX - coords[0]) < NODE_WIDTH / 2 * scaleFactor
        && Math.abs(mouseY - coords[1]) < NODE_HEIGHT / 2 * scaleFactor) {

        if (focus && activeNodes.includes(node)) {
          console.log(node)
          setShowCourseView(true);
          setCourseView(nodeGraph.get(node));
        }

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

  function handleScroll(e) {
    handleMouseMove(e)
    let newScaleFactor = scaleFactor - e.deltaY * scaleFactor * 0.005;
    if (newScaleFactor > MAX_ZOOM) {
      setScaleFactor(MAX_ZOOM);
    } else if (newScaleFactor < MIN_ZOOM) {
      setScaleFactor(MIN_ZOOM);
    } else {
      //let old = scaleFactor;
      setScaleFactor(newScaleFactor);
      //handleMouseMove(e);


      /*let new_map_width = (props.width) * newScaleFactor
      let new_map_height = (props.height) * newScaleFactor
      setXOffset(xOffset - (mouseX / props.width * (new_map_width - (props.width * old))))
      setYOffset(yOffset - (mouseY / props.height * (new_map_height - (props.height * old))))*/

      //setXOffset(-(xOffset + mouseX) * newScaleFactor + (xOffset + mouseX));
      //setYOffset(-(yOffset + mouseY) * newScaleFactor + (yOffset + mouseY));

      //setXOffset(yOffset + (mouseY) * (1 - (newScaleFactor - scaleFactor)) - mouseY);
      //dy = (currentMouseY - image.getTop()) * (factor - 1);
    }
  }

  // Stop page from scrolling when mouse is over canvas
  // Credit to https://stackoverflow.com/questions/55508836/prevent-page-scrolling-when-mouse-is-over-one-particular-div
  function changeScroll() { 
    let style = document.body.style.overflow;
    document.body.style.overflow = (style === 'hidden') ? 'auto':'hidden';
    setActiveNodes([])
  } 

  function drawNode(ctx, node, x, y) {
    if (focus && !activeNodes.includes(node.id)) {
      ctx.globalAlpha = 0.5;
    }
    ctx.fillStyle = 'white';
    ctx.fillRect(x - scaleFactor * NODE_WIDTH / 2, y - scaleFactor * NODE_HEIGHT / 2, scaleFactor * NODE_WIDTH, scaleFactor * NODE_HEIGHT);
    if (activeNodes.includes(node.id)) {
      ctx.strokeStyle = 'black';
    } else {
      ctx.strokeStyle = '#ccc';
    }
    ctx.strokeRect(x - scaleFactor * NODE_WIDTH / 2, y - scaleFactor * NODE_HEIGHT / 2, scaleFactor * NODE_WIDTH, scaleFactor * NODE_HEIGHT);
    ctx.save()
    ctx.scale(scaleFactor, scaleFactor);
    ctx.fillStyle = 'black';
    ctx.font = "14px Helvetica";
    ctx.textAlign = "center";
    ctx.fillText(node.id, x / scaleFactor, (y - NODE_HEIGHT / 2 + 20) / scaleFactor);
    ctx.restore();
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

  useEffect(() => {
    if (showCourseView) {
      return;
    }
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
        nodeCoords.current.set(layers[i][j].id, [scaleFactor * (x + xOffset) + props.width / 2, scaleFactor * (y + yOffset) + props.height / 2]);
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
          let xOffset1 = edge.port * 10

          let start = nodeCoords.current.get(edge.start);
          let end = nodeCoords.current.get(edge.end);
          if (start === undefined || end === undefined) {
            continue;
          }
          ctx.moveTo(start[0], start[1] + scaleFactor * NODE_HEIGHT / 2);
          ctx.lineTo(end[0] + xOffset1, end[1] - scaleFactor * NODE_HEIGHT / 2);
          ctx.strokeStyle = '#ccc';
          ctx.stroke();
        }
      }
      ctx.closePath();
    }
    for (let edge of activeEdges) {
      let xOffset1 = edge.port * 10
      let start = nodeCoords.current.get(edge.start);
      let end = nodeCoords.current.get(edge.end);
      ctx.moveTo(start[0], start[1] + scaleFactor * NODE_HEIGHT / 2);
      if (start === undefined || end === undefined) {
        continue;
      }
      ctx.lineTo(end[0] + xOffset1, end[1] - scaleFactor * NODE_HEIGHT / 2);
      ctx.strokeStyle = '#666';
      ctx.stroke();
    }
  });

  return (
    <div style={{position: "relative", width: props.width, height: props.height}} className="canvasContainer">
      {showCourseView && 
        <CourseView node={courseView}/>
      }
      <canvas ref={canvasRef} onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} onWheel={handleScroll} onMouseEnter={changeScroll}
       onMouseLeave={changeScroll} className = "graphView"/>
    </div>
  );
}

export default GraphView;
