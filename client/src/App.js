import './App.css';
import { Route, Switch } from 'react-router-dom';
import HomePage from './views/HomePage';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

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
      <AppHeader />
      <Switch>
        { renderRoutes() }
      </Switch>
      <AppFooter />
    </div>
  );
}

export default App;
