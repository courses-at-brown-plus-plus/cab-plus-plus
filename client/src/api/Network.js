
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setPathwayData } from '../store/slices/appDataSlice';

import { CourseNode, Edge } from '../components/Graph';

export const getRequest = async (resource) => {
  // const res = await axios.get(url + resource, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     'Access-Control-Allow-Origin': '*'
  //   }
  // });

  // dummy get request to wait for 2 seconds
  const res = await setTimeout(() => {
    return "get request dummy data";
  }, 2);
  return res;
}

function generateDummyGraphs() {

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

  let visaGraph = new Map();
  visaGraph.set('VISA 0100', new CourseNode('VISA 0100', [new Edge('VISA 0100', 'VISA 0160', 0)], []));
  visaGraph.set('VISA 0160', new CourseNode('VISA 0160', [], []));

  let ret = {
    data: {
      "Computer Science": csGraph, 
      "Visual Art": visaGraph 
    }
  };
  return ret;
}

export const GetPathwayData = createAsyncThunk(
  'appData/getPathWayDataThunk', 
  async (userData, { dispatch, rejectWithValue }) => {

    getRequest("pathwayData/").then((res) => {
      res = { 
        data: {
          concentration: "Computer Science",
          graph: "hello it works!!!" 
        }
      };
      console.log(JSON.stringify(res));
      dispatch(setPathwayData(res.data));
      return;
    }, (err) => {
      console.log("error in Network.GetPathwayData: " + JSON.stringify(err));
      // dispatch(setStatus(err.response.status));
      return rejectWithValue(err.message);
    });
  }
);

