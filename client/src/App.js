import './App.css';
import GraphView from './GraphView';
import { Node, Edge } from './Graph';

function App() {

  let dummyGraph = new Map();
  dummyGraph.set('CS19', new Node('CS19', [new Edge('CS19', 'CS32', 0), 
    new Edge('CS19', 'CS30', 0), 
    new Edge('CS19', 'CS22', 0),
    new Edge('CS19', 'CS171', 0)], []));
  dummyGraph.set('CS30', new Node('CS30', [], []));
  dummyGraph.set('CS32', new Node('CS32', [new Edge('CS32', 'CS1951A', 0)], []));
  dummyGraph.set('CS22', new Node('CS22', [new Edge('CS22', 'CS1010', 0)], []));
  dummyGraph.set('CS1951A', new Node('CS1951A', [], []));
  dummyGraph.set('CS1010', new Node('CS1010', [], []));
  dummyGraph.set('MATH0520', new Node('MATH0520', [], []));
  dummyGraph.set('MATH0540', new Node('MATH0540', [], []));
  dummyGraph.set('CS171', new Node('CS171', [], []));

  return (
    <div className="App">
      <br/>
      <GraphView width={800} height={600} graph={dummyGraph}/>
    </div>
  );
}

export default App;
