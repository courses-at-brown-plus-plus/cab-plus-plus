import React, {useRef, useEffect, useState} from 'react';
import { CourseNode, Edge } from './Graph';
import prepareGraph from './LayerGraph';
import CourseView from './CourseView';

import { Button, Box, Flex, useDisclosure } from "@chakra-ui/react"
import { useSelector } from 'react-redux';
import { selectCoursesTaken } from '../store/slices/appDataSlice';
import AnnotationSave from './AnnotationSave';
// import SearchBar from './SearchBar'
import CourseAutocomplete from '../components/CourseAutocomplete';

const NODE_WIDTH = 80;
const NODE_HEIGHT = 50;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;

function GraphView(props) {
  const canvasRef = useRef(null);

  // access redux var for courses taken input on the sidebar
  const coursesTaken = useSelector(selectCoursesTaken);
  const popup = useDisclosure();

  const [nextCourses, setNextCourses] = useState([]);

  // dummy data equivalent
  // const coursesTaken = ["CSCI 0190"];
  
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

  const [annotations, setAnnotations] = useState([]);

  let alone = useRef(new Map());

  let minX = useRef(null);

  useEffect(() => {
    if (props.graph.size === 0) {
      return;
    }
    let p = prepareGraph(nodeGraph);
    layersRef.current = p[1];
    layers = layersRef.current;

    let max = 0;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].length === 0) {
        continue;
      }
      if (layers[i].map((x) => {return x.coord;}).reduce((a,b) => Math.max(a, b)) > max) {
        max = layers[i].map((x) => {return x.coord;}).reduce((a,b) => Math.max(a, b));
      }

      for (let j = layers[i].length - 1; j >= 0; j--) {
        if (isNaN(layers[i][j].coord)) {
          layers[i].splice(j, 1)
        }
      }
    }
    minX.current = max;

    alone.current = p[0];

    if (layers[0].length > 0) {
      setXOffset(-layers[0].reduce((a, b) => a + b.coord, 0) / layers[0].length * 100);
      setOrigXOffset(-layers[0].reduce((a, b) => a + b.coord, 0) / layers[0].length * 100);
    }

    setScaleFactor(0.4)

  }, [props.graph]);

  useEffect(() => {
    if (props.displayedAnnotation) {
      setAnnotations([...props.displayedAnnotation]);
    }
  }, [props.displayedAnnotation]);

  useEffect(() => {
    let newNextCourses = [];

    let startCourses = coursesTaken.concat(annotations);

    if (nodeGraph) {
      for (let i = 0; i < startCourses.length; i++) {
        if (nodeGraph.has(startCourses[i])) {
          for (let j = 0; j < nodeGraph.get(startCourses[i]).edges.length; j++) {
            newNextCourses.push(nodeGraph.get(startCourses[i]).edges[j].end);
          }
        }
      }
    }
    setNextCourses(newNextCourses);
  }, [coursesTaken, annotations]);


  function handleMouseMove(event) {
    let canvas = canvasRef.current;
    setMouseX(event.clientX - event.target.getBoundingClientRect().left);
    setMouseY(event.clientY - event.target.getBoundingClientRect().top);

    if (mouseDown) {
      setXOffset(origXOffset + (mouseX - mouseDownX) / scaleFactor);
      setYOffset(origYOffset + (mouseY - mouseDownY) / scaleFactor);
    }

    for (let [node, coords] of nodeCoords.current) {
      if (props.graph.has(node)
        && Math.abs(mouseX - coords[0]) < NODE_WIDTH / 2 * scaleFactor
        && Math.abs(mouseY - coords[1]) < NODE_HEIGHT / 2 * scaleFactor) {
        if (!focus) {
          props.graph.get(node).active = true;
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
      if (props.graph.has(node)
        && Math.abs(mouseX - coords[0]) < NODE_WIDTH / 2 * scaleFactor
        && Math.abs(mouseY - coords[1]) < NODE_HEIGHT / 2 * scaleFactor) {

        if (focus && activeNodes.includes(node)) {
          setShowCourseView(true);
          setCourseView(props.graph.get(node));
        }

        setFocus(true);
        props.graph.get(node).active = true;
        let l = [];
        makeActive(node, l);
        setActiveNodes(l);
        return;
      }
    }
    
    if (Math.abs(mouseX - mouseDownX) < 1 && Math.abs(mouseY - mouseDownY) < 1) {
      setFocus(false);
    }
  }

  function handleMouseDown(e) {
    setMouseDown(true);
    setMouseDownX(e.clientX - e.target.getBoundingClientRect().left);
    setMouseDownY(e.clientY - e.target.getBoundingClientRect().top);
    setOrigXOffset(xOffset);
    setOrigYOffset(yOffset);
  }

  function handleScroll(e) {
    document.body.style.overflow = 'hidden';
    handleMouseMove(e)
    let newScaleFactor = scaleFactor - e.deltaY * scaleFactor * 0.005;
    if (newScaleFactor > MAX_ZOOM) {
      setScaleFactor(MAX_ZOOM);
    } else if (newScaleFactor < MIN_ZOOM) {
      setScaleFactor(MIN_ZOOM);
    } else {
      setScaleFactor(newScaleFactor);
    }
  }

  // Stop page from scrolling when mouse is over canvas
  // Credit to https://stackoverflow.com/questions/55508836/prevent-page-scrolling-when-mouse-is-over-one-particular-div
  function enterScroll() { 
    let style = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!focus) {
      setActiveNodes([])
    }
  } 

  function leaveScroll() { 
    let style = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    if (!focus) {
      setActiveNodes([])
    }
  } 

  function addAnnotation(id) {
    setAnnotations(annotations.concat([id]))
  }

  function removeAnnotation(id) {
    console.log(id)
    annotations.splice(annotations.indexOf(id), 1);
    setAnnotations(annotations);
  }

  function drawNode(ctx, node, x, y) {

    if (focus && !activeNodes.includes(node.id)) {
      ctx.globalAlpha = 0.5;
    }
    ctx.fillStyle = 'white';
    if (coursesTaken.includes(node.id)) {
      ctx.fillStyle = '#6c6';
    } else if (nextCourses.includes(node.id)) {
      ctx.fillStyle = '#cfc';
    }


    ctx.fillRect(x - scaleFactor * NODE_WIDTH / 2, y - scaleFactor * NODE_HEIGHT / 2, scaleFactor * NODE_WIDTH, scaleFactor * NODE_HEIGHT);
    if (activeNodes.includes(node.id)) {
      ctx.strokeStyle = 'black';
    } else if (annotations.includes(node.id)) {
      ctx.lineWidth = 3 * scaleFactor;
      ctx.strokeStyle = '#6c6';
    } else {
      ctx.strokeStyle = '#ccc';
    }


    ctx.strokeRect(x - scaleFactor * NODE_WIDTH / 2, y - scaleFactor * NODE_HEIGHT / 2, scaleFactor * NODE_WIDTH, scaleFactor * NODE_HEIGHT);
    ctx.lineWidth = 1 * scaleFactor;
    ctx.save()
    ctx.scale(scaleFactor, scaleFactor);
    ctx.fillStyle = 'black';
    ctx.font = "14px Helvetica";
    ctx.textAlign = "center";
    ctx.fillText(node.id, (x - scaleFactor * NODE_WIDTH / 2 + NODE_WIDTH / 2 * scaleFactor) / scaleFactor, ( y - scaleFactor * NODE_HEIGHT / 2 + 20 * scaleFactor) / scaleFactor);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function makeActive(node, activeList) {
    if (!props.graph.has(node)) {
      return;
    }
    activeList.push(node);
    for (let edge of props.graph.get(node).edges) {

      if (!props.graph.has(edge.end)) {
        continue;
      }

      //Avoid crashing on a cyclic graph
      if (!activeList.includes(edge.end)) {
        makeActive(edge.end, activeList);
      }
    }
  }

  function clearAnnotations(e) {
    setAnnotations([]);
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

    if (props.graph.size === 0) {
      ctx.fillStyle = '#bbb';
      ctx.font = "28pt Helvetica";
      ctx.textAlign = "center";
      ctx.fillText('No concentration selected', props.width / 2, props.height / 2)
      return;
    }

    nodeCoords.current = new Map();

    for (let [id, coords] of alone.current) {
      
      let x = minX.current * 100 + (coords[0] + 5) * 100;

      nodeCoords.current.set(id, 
        [scaleFactor * (x + xOffset) + props.width / 2,
         scaleFactor * (coords[1] * 100 + yOffset + 40) + props.height / 2]);
    }

    let y = 40;
    for (let i = 0; i < layers.length; i++) {
      for (let j = 0; j < layers[i].length; j++) {

        let x = props.width / 2 + (layers[i][j].coord) * 100;

        nodeCoords.current.set(layers[i][j].id, 
          [scaleFactor * (x + xOffset) + props.width / 2, 
          scaleFactor * (y + yOffset) + props.height / 2]);
        x += 100;
      }
      y += 100;
    }
    

    ctx.lineWidth = scaleFactor;

    let activeEdges = [];
    for (let [node, coords] of nodeCoords.current.entries()) {
      ctx.beginPath();
      if (nodeGraph.has(node)) {

        for (let i = 0; i < nodeGraph.get(node).edges.length; i++) {
          let edge = props.graph.get(node).edges[i];
          if (activeNodes.includes(edge.start)) {
            activeEdges.push(edge);
            continue;
          }
          let xOffset1 = 0;//edge.port * 10

          let start = nodeCoords.current.get(edge.start);
          let end = nodeCoords.current.get(edge.end);
          if (start === undefined || end === undefined || !props.graph.has(edge.end)) {
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
      let xOffset1 = 0;//edge.port * 10
      let start = nodeCoords.current.get(edge.start);
      let end = nodeCoords.current.get(edge.end);
      if (start === undefined || end === undefined || !props.graph.has(edge.end)) {
        continue;
      }
      ctx.moveTo(start[0], start[1] + scaleFactor * NODE_HEIGHT / 2);
      ctx.lineTo(end[0] + xOffset1, end[1] - scaleFactor * NODE_HEIGHT / 2);
      ctx.strokeStyle = '#999';
      ctx.stroke();
    }

    for (let [node, coords] of nodeCoords.current.entries()) {
      ctx.beginPath();
      if (nodeGraph.has(node)) {
        if (!node.active) {
          drawNode(ctx, nodeGraph.get(node), coords[0], coords[1]);
        }
      }
    }

  });

  return (
    <React.Fragment>
      <div style={{position: "relative", width: props.width, height: props.height}} className="canvasContainer">
        { showCourseView && 
          <CourseView node={courseView} 
          annotation={nextCourses.includes(courseView.id) && !annotations.includes(courseView.id)} 
          add={addAnnotation} rann={annotations.includes(courseView.id)} remove={removeAnnotation}/>
        }
        <canvas ref={canvasRef} onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} onWheel={handleScroll} onMouseEnter={enterScroll}
          onMouseLeave={leaveScroll} className = "graphView"/>
      </div>

      <Flex width={800} justify="space-between" padding={3}>
        <Box> 
          <AnnotationSave 
            concentration={props.concentration} 
            popup={popup}
            annotations={annotations}
          />
          <Button colorScheme="cyan" style={{marginLeft: "10px"}} onClick={clearAnnotations}>Clear Annotations</Button>
        </Box>
        {
          // <SearchBar update={(s) => {let l = []; makeActive(s, l); setActiveNodes(l); setFocus(true);}}/>
        }
      <Box width={200} float="right" marginRight="10px"> { props.children } </Box>
      </Flex>
      <Flex justifyContent="flex-end">
        <CourseAutocomplete 
          title="Search for course ID"
          handleAddCourse={(newCourseCode) => { 
            let l = [];
            makeActive(newCourseCode, l); 
            setActiveNodes(l); 
            setFocus(true);
          }}
        />
      </Flex>
    </React.Fragment>
  );
}

export default GraphView;
