import './App.css';
import GraphView from './GraphView';
import { Node, Edge } from './Graph';

function App() {

  let dummyGraph = new Map();
  dummyGraph.set('a', new Node('a', [new Edge('a', 'b', 0), new Edge('a', 'c', 0)], []));
  dummyGraph.set('b', new Node('b', [new Edge('b', 'c', 0)], []));
  dummyGraph.set('c', new Node('c', [new Edge('c', 'd', 0)], []));
  dummyGraph.set('d', new Node('d', [], []));

  return (
    <div className="App">
      <br/>
      <GraphView width={800} height={600} graph={dummyGraph}/>
    </div>
  );
}

export default App;
