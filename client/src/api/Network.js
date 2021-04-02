
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
  // console.log("res: ");
  // console.log(JSON.stringify(res));
  // return res;
  return generateDummyGraphs();
}

function generateDummyGraphs() {
  let tempPathwayData = {
    "Computer Science": {
      'CS15': ['CS16'], 
      'CS16': ['CS32', 'CS30', 'CS22', 'CS171', 'CS1420'], 
      'CS17': ['CS18'], 
      'CS18': ['CS32', 'CS30', 'CS22', 'CS171', 'CS1420'], 
      'CS19': ['CS32', 'CS30', 'CS22', 'CS171', 'CS1420', 'CS18'], 
      'MATH0520': ['CS1420'], 
      'MATH0540': ['CS1420'], 
      'CS30': ['CS1951A'],
      'CS32': ['CS1951A'], 
      'CS22': ['CS1010'], 
      'CS171': [], 
      'CS1010': [], 
      'CS1420': [],
      'CS1951A': []
    },
    "Visual Art": {
      // 'VISA 0100': ['VISA 1110', 'VISA 1160', 'VISA 1310'], 
      // 'VISA 0120': ['VISA 1310'], 
      // 'VISA 0160': ['VISA 1310'], 
      'VISA 0130': [], 
      'VISA 0140': [], 
      'VISA 0150': [], 
      'VISA 1110': [], 
      'VISA 1160': [], 
      'VISA 1310': ['VISA 1320'], 
      'VISA 1320': [],

      'CS32': ['CS1951A'], 
      'CS22': ['CS1010'], 
      'CS1010': [], 
      'CS1951A': []
    },
    "Visual Art (complete)": {
      'VISA 0100': ['VISA 1110', 'VISA 1160', 'VISA 1310'], 
      'VISA 0120': ['VISA 1310'], 
      'VISA 0130': [], 
      'VISA 0140': [], 
      'VISA 0150': [], 
      'VISA 0160': ['VISA 1310'], 
      'VISA 1110': [], 
      'VISA 1160': [], 
      'VISA 1310': ['VISA 1320'], 
      'VISA 1320': []
    }
  }

  let ret = {
    data: {
      ...tempPathwayData
    }
  };
  console.log(JSON.stringify(ret));
  return ret;
}

export const GetPathwayData = createAsyncThunk(
  'appData/getPathWayDataThunk', 
  async (userData, { dispatch, rejectWithValue }) => {

    getRequest("pathwayData/").then((res) => {
      dispatch(setPathwayData(res.data));
      return;
    }, (err) => {
      console.log("error in Network.GetPathwayData: " + JSON.stringify(err));
      // dispatch(setStatus(err.response.status));
      return rejectWithValue(err.message);
    });
  }
);

