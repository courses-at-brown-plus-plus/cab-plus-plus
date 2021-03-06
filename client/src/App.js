import React, { useEffect } from 'react';

import './App.css';
import { Route, Switch } from 'react-router-dom';
import HomePage from './views/HomePage';
import CourseSuggestions from './views/CourseSuggestions';
import AppHeader from './views/AppHeader';
import AppFooter from './views/AppFooter';
import { Flex } from "@chakra-ui/react"

import { useDispatch } from 'react-redux';
import { GetPathwayData, GetAllCourseCodes } from './api/Network';

const routes = [
  { path: '/', name: 'Home', Component: HomePage },
  { path: '/suggestions', name: 'Course Suggestions', Component: CourseSuggestions }
];

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // request all the graph node/edge data, store in redux
    dispatch(GetPathwayData());
    dispatch(GetAllCourseCodes());
    // pass json data into map object when concentration selected (cache the generated map objects)
  }, []);


  function renderRoutes() {
    return (routes.map(({ path, Component }) => (
      <Route key={path} exact path={path}>
        <Flex justify="center" mt="14">
          <Component />
        </Flex>
      </Route>
    )));
  }


  return (
    <div className="App">
      <AppHeader />
      <div className="page-view">
        <Switch>
          { renderRoutes() }
        </Switch>
      </div>
      <AppFooter />
    </div>
  );
}

export default App;
