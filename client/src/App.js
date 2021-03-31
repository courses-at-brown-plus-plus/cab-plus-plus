import './App.css';
import GraphView from './GraphView';
import { CourseNode, Edge } from './Graph';

function App() {

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
    <div className="App">
      <br/>
      <GraphView width={1000} height={600} graph={csGraph}/>
    </div>
  );
}

export default App;
