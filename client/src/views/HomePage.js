import React from 'react';
import { Select, Button, Box, Flex } from "@chakra-ui/react"
import GraphView from '../components/GraphView';
import { CourseNode, Edge } from '../components/Graph';

export default function HomePage() {

  let csGraph = new Map();
  csGraph.set('CS15', new CourseNode('CS15', [new Edge('CS15', 'CS16', 0)], []));
  csGraph.set('CS16', new CourseNode('CS16', [new Edge('CS16', 'CS32', 0), new Edge('CS16', 'CS30', 0), 
    new Edge('CS16', 'CS22', 0), new Edge('CS16', 'CS171', 0), new Edge('CS16', 'CS1420')], []));
  csGraph.set('CS17', new CourseNode('CS17', [new Edge('CS17', 'CS18', 0)], []));
  csGraph.set('CS18', new CourseNode('CS18', [new Edge('CS18', 'CS32', 0), new Edge('CS18', 'CS30', 0), 
    new Edge('CS18', 'CS22', 0), new Edge('CS18', 'CS171', 0), new Edge('CS18', 'CS1420')], []));
  csGraph.set('CS19', new CourseNode('CS19', [new Edge('CS19', 'CS32', 0), 
    new Edge('CS19', 'CS30', 0), 
    new Edge('CS19', 'CS22', 0),
    new Edge('CS19', 'CS171', 0),
    new Edge('CS19', 'CS1420', 0),
    new Edge('CS19', 'CS18', 0)], []));
  csGraph.set('MATH0520', new CourseNode('MATH0520', [new Edge('MATH0520', 'CS1420', 0)], []));
  csGraph.set('MATH0540', new CourseNode('MATH0540', [new Edge('MATH0540', 'CS1420', 0)], []));
  csGraph.set('CS30', new CourseNode('CS30', [], []));
  csGraph.set('CS32', new CourseNode('CS32', [new Edge('CS32', 'CS1951A', 0)], []));
  csGraph.set('CS22', new CourseNode('CS22', [new Edge('CS22', 'CS1010', 0)], []));
  csGraph.set('CS1951A', new CourseNode('CS1951A', [], []));
  csGraph.set('CS1010', new CourseNode('CS1010', [], []));
  csGraph.set('CS171', new CourseNode('CS171', [], []));
  csGraph.set('CS1420', new CourseNode('CS1420', [], []));

  return (
    <div>
      <h1>Welcome to C@B++!</h1>

      <br/>

      <center>
        <GraphView width={800} height={600} graph={csGraph}/>

        <Flex 
          width={800} 
          justify="space-between"
          padding={3}
        >

          <Box>
            <Button colorScheme="cyan"> Save Loadout </Button>
          </Box>

          <Box>
            <Select 
              bg="gray.600" 
              color="white"
              placeholder="Select concentration" 
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </Box>

        </Flex>

      </center>
    </div>
  );
}

