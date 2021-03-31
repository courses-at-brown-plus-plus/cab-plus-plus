import './App.css';
import { Route, Switch } from 'react-router-dom';
import HomePage from './views/HomePage';

const routes = [
  { path: '/', name: 'Home', Component: HomePage }
];

function App() {

  function renderRoutes() {
    return (routes.map(({ path, Component }) => (
      <Route key={path} exact path={path}>
        <Component />
      </Route>
    )));
  }

  return (
    <div className="App">
      <Switch>
        { renderRoutes() }
      </Switch>
    </div>
  );
}

export default App;
