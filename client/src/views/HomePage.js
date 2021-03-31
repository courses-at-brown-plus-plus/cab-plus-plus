import React from 'react';
import GraphView from '../components/GraphView';
import { Node, Edge } from '../components/Graph';

export default function HomePage() {

  let csGraph = new Map();
  csGraph.set('CS19', new Node('CS19', [new Edge('CS19', 'CS32', 0), 
    new Edge('CS19', 'CS30', 0), 
    new Edge('CS19', 'CS22', 0),
    new Edge('CS19', 'CS171', 0)], []));
  csGraph.set('CS30', new Node('CS30', [], []));
  csGraph.set('CS32', new Node('CS32', [new Edge('CS32', 'CS1951A', 0)], []));
  csGraph.set('CS22', new Node('CS22', [new Edge('CS22', 'CS1010', 0)], []));
  csGraph.set('CS1951A', new Node('CS1951A', [], []));
  csGraph.set('CS1010', new Node('CS1010', [], []));
  csGraph.set('MATH0520', new Node('MATH0520', [], []));
  csGraph.set('MATH0540', new Node('MATH0540', [], []));
  csGraph.set('CS171', new Node('CS171', [], []));
  csGraph.set('CS15', new Node('CS15', [new Edge('CS15', 'CS16', 0)], []));
  csGraph.set('CS16', new Node('CS16', [new Edge('CS16', 'CS32', 0), new Edge('CS16', 'CS30', 0), new Edge('CS16', 'CS22', 0), new Edge('CS16', 'CS171', 0),], []));

  return (
    <div>
      <h1>Welcome to C@B++!</h1>

      <br/>
      <GraphView width={800} height={600} graph={csGraph}/>
    </div>
  );
}

