import React, { useState, useEffect } from 'react';
import { Select, Box, Stack } from "@chakra-ui/react"
import GraphView from '../components/GraphView';
import { CourseNode, Edge } from '../components/Graph';
import PastCourses from '../components/PastCourses';
import AnnotationButton from '../components/AnnotationButton';

import { useSelector } from 'react-redux';
import { selectPathwayData, selectAnnotations } from '../store/slices/appDataSlice';
import { AVAILABLE_CONCENTRATIONS } from '../constants';

import Legend from '../components/Legend'
// import SearchBar from '../components/SearchBar'

// import axios from 'axios';

export default function HomePage() {

  const pathwayData = useSelector(selectPathwayData);
  const savedAnnotations = useSelector(selectAnnotations);
  const [displayedAnnotation, setDisplayedAnnotation] = useState(null);
  const [selectedConcentration, setSelectedConcentration] = useState("");

  const [currentGraph, setCurrentGraph] = useState(null);
  const [graphX, setGraphX] = useState(0);
  const [graphY, setGraphY] = useState(0);

  useEffect(() => {
    if (!selectedConcentration) {
      return;
    }
    let aGraph = new Map();
    let ports = new Map();

    for (let course in pathwayData) {
      let include = false;
      for (let edge of pathwayData[course]['preReqs']) {
        if (edge[0].startsWith(selectedConcentration)) {
          include = true;
          break;
        }
      }
      if (!include && !course.startsWith(selectedConcentration)) {
        continue;
      }
      if (aGraph.has(course)) {
        continue;
      }

      let node = new CourseNode(pathwayData[course]['courseCode'], [], 0, false, false, 
        pathwayData[course]['courseName'], pathwayData[course]['courseDesc'], [pathwayData[course]['FYS'], 
          pathwayData[course]['SOPH'], pathwayData[course]['DIAP'], pathwayData[course]['WRIT'],
          pathwayData[course]['CBLR'], pathwayData[course]['COEX']])
      for (let edge of pathwayData[course]['preReqs']) {
        node.edges.push(new Edge(pathwayData[course]['courseCode'], edge[0], edge[1]))
        if (!ports.has(edge[0])) {
          ports.set(edge[0], 0);
        }
        if (ports.get(edge[0]) < edge[1]) {
          ports.set(edge[0], edge[1]);
        }
      }
      aGraph.set(course, node);
    }
    for (let [id, p] of ports) {
      if (aGraph.has(id)) {
        aGraph.get(id).ports = p;
      }
    }
    setCurrentGraph(aGraph);
  }, [selectedConcentration, pathwayData]);

  // no concentration selected
  let emptyGraph = new Map();
  // emptyGraph.set('No graph selected', new CourseNode('No graph selected', [], []));

  // let csGraph = new Map();
  // csGraph.set('CS111', new CourseNode('CS111', [new Edge('CS111', 'CS112', 0)], []));
  // csGraph.set('CS112', new CourseNode('CS112', [new Edge('CS112', 'CS32', 0), new Edge('CS112', 'CS30', 0), 
  //   new Edge('CS112', 'CS22', 0), new Edge('CS112', 'CS171', 0), new Edge('CS112', 'CS1420', 0)], []));
  // csGraph.set('CS15', new CourseNode('CS15', [new Edge('CS15', 'CS16', 0)], []));
  // csGraph.set('CS16', new CourseNode('CS16', [new Edge('CS16', 'CS32', 0), new Edge('CS16', 'CS30', 0), 
  //   new Edge('CS16', 'CS22', 0), new Edge('CS16', 'CS171', 0), new Edge('CS16', 'CS1420', 0)], []));
  // csGraph.set('CS17', new CourseNode('CS17', [new Edge('CS17', 'CS18', 0)], []));
  // csGraph.set('CS18', new CourseNode('CS18', [new Edge('CS18', 'CS32', 0), new Edge('CS18', 'CS30', 0), 
  //   new Edge('CS18', 'CS22', 0), new Edge('CS18', 'CS171', 0), new Edge('CS18', 'CS1420', 0),
  //   new Edge('CS18', 'CS33', 0)], []));
  // csGraph.set('CS19', new CourseNode('CS19', [new Edge('CS19', 'CS32', 0), 
  //   new Edge('CS19', 'CS30', 0), 
  //   new Edge('CS19', 'CS22', 0),
  //   new Edge('CS19', 'CS171', 0),
  //   new Edge('CS19', 'CS1420', 0),
  //   new Edge('CS19', 'CS33', 0)], []));
  // csGraph.set('MATH0520', new CourseNode('MATH0520', [new Edge('MATH0520', 'CS1420', 1)], []));
  // csGraph.set('MATH0540', new CourseNode('MATH0540', [new Edge('MATH0540', 'CS1420', 1)], []));
  // csGraph.set('CS30', new CourseNode('CS30', [], []));
  // csGraph.set('CS32', new CourseNode('CS32', [new Edge('CS32', 'CS1951A', 0)], []));
  // csGraph.set('CS22', new CourseNode('CS22', [new Edge('CS22', 'CS1010', 0)], []));
  // csGraph.set('CS1951A', new CourseNode('CS1951A', [], []));
  // csGraph.set('CS1010', new CourseNode('CS1010', [], []));
  // csGraph.set('CS171', new CourseNode('CS171', [], []));
  // csGraph.set('CS1420', new CourseNode('CS1420', [], []));
  // csGraph.set('CS33', new CourseNode('CS33', [], []));

  //csGraph = Object.fromEntries(csGraph);

  // function infoToGraph(concentrationInfo) {
  //   let aGraph = new Map();
  //   for (const [baseCourse, unlockedCourses] of Object.entries(concentrationInfo)) {
  //     let courseEdges = unlockedCourses.map((nextCourse) => {
  //       return new Edge(baseCourse, nextCourse, 0);
  //     });
  //     aGraph.set(baseCourse, new CourseNode(baseCourse, courseEdges, []));
  //   }
  //   return aGraph;
  // }

  // function renderGraph() {
  //   console.log("rendering new graph for concentrationName: " + selectedConcentration);
    // let aGraph;
    // if (pathwayData && pathwayData[selectedConcentration]) {
      // aGraph = infoToGraph(pathwayData[selectedConcentration]);
      // return <GraphView width={800} height={600} graph={aGraph}/>;

  //   if (pathwayData && selectedConcentration && currentGraph) {
  //     return <GraphView width={800} height={600} graph={currentGraph}/>;
  //   }
  //   else {
  //     return <GraphView width={800} height={600} graph={emptyGraph}/>;
  //   }
  // }

  // async function getWebScrapedGraph() {
  //   let config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //       'Access-Control-Allow-Origin': '*'
  //     }
  //   }
  //   axios.get(
  //     'http://localhost:5000/allPathwayData',
  //     config
  //   )
  //     .then(response => {
  //       let json = response.data.pathwayData;
  //       let graph = new Map();
  //       for (let course in json) {
  //         if (!course.startsWith('CSCI')) {
  //           continue;
  //         }
  //         let node = new CourseNode(json[course]['courseCode'], [], [], false, false, 
  //           json[course]['courseName'], json[course]['courseDesc'], [json[course]['FYS'], 
  //           json[course]['SOPH'],json[course]['DIAP'],json[course]['WRIT'],json[course]['CBLR'],json[course]['COEX']])
  //         for (let edge of json[course]['preReqs']) {
  //           node.edges.push(new Edge(json[course]['courseCode'], edge[0], edge[1]))
  //         }
  //         graph.set(course, node);
  //       }

  //       setWebScrapedGraph(graph);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  // const [webScrapedGraph, setWebScrapedGraph] = useState(null);

  // useEffect(() => {
  //   async function f() {
  //     await getWebScrapedGraph();
  //   }
  //   f();
  // }, webScrapedGraph);

  return (
    <React.Fragment>
      <PastCourses />

      <center>
        {/*<GraphView width={800} height={600} graph={csGraph}/>
        ^data from dummy csGraph variable
        <br/> { "-".repeat(100) }
         */
          // webScrapedGraph !== null && webScrapedGraph !== undefined &&
          //   <GraphView width={800} height={600} graph={webScrapedGraph}/>
        // ^webscraped data (gareth's code)
        }

        <GraphView 
          width={800} 
          height={600} 
          concentration={selectedConcentration}
          displayedAnnotation={displayedAnnotation}
          graph={(pathwayData && selectedConcentration && currentGraph) ? currentGraph : emptyGraph}
          x={graphX}
          y={graphY}
          updateX={setGraphX}
          updateY={setGraphY}
        >

          <Select 
            bg="gray.600" 
            color="white"
            placeholder="Select concentration" 
            value={selectedConcentration}
            onChange={(e) => setSelectedConcentration(e.target.value)}
          >
            { renderDropdownItems() }
          </Select>

        </GraphView>

        { 
          // ^data from redux  (kevin and gareth's combined)
          // <br/> { "-".repeat(100) }
        }
        {
          // Selected Concentration: { selectedConcentration }
        }

      </center>
      <Stack>
        <Box ml={10}>
          <Box p={5} style={styles.boxContainer}>
            <h1><b>Saved Annotations</b></h1>
            { 
              Object.keys(savedAnnotations).map((key) => 
                <AnnotationButton 
                  name={key} 
                  content={savedAnnotations[key]}
                  setSelectedConcentration={setSelectedConcentration}
                  setDisplayedAnnotation={setDisplayedAnnotation}
                />)
            }
          </Box>
          { 
            // JSON.stringify(savedAnnotations) 
          }
        </Box>

        <Box m="0 auto">
          <Legend />
        </Box>
      </Stack>

    </React.Fragment>
  );

  function renderDropdownItems() {
    return AVAILABLE_CONCENTRATIONS.map((concentrationName) => (
      <option key={concentrationName} value={concentrationName}>{concentrationName}</option>
    ));
    // return Object.keys(pathwayData).map((concentrationName) => (
    //   <option key={concentrationName} value={concentrationName}>{concentrationName}</option>
    // ));
  }
}

const styles = {
  boxContainer: {
    width: "14vw", 
    height: "40vh",
    border: "2px solid black",
    borderRadius: "0.3rem",
    overflowY: "scroll"
  }
}
