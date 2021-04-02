
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setPathwayData, setAllCourseCodes } from '../store/slices/appDataSlice';
import { PATHWAY_DATA, COURSE_CODES } from '../constants';

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

export const GetPathwayData = createAsyncThunk(
  'appData/getPathWayDataThunk', 
  async (userData, { dispatch, rejectWithValue }) => {

    getRequest("pathwayData/").then((res) => {
      res = {data: PATHWAY_DATA};
      dispatch(setPathwayData(res.data));
      return;
    }, (err) => {
      console.log("error in Network.GetPathwayData: " + JSON.stringify(err));
      // dispatch(setStatus(err.response.status));
      return rejectWithValue(err.message);
    });
  }
);

export const GetAllCourseCodes = createAsyncThunk(
  'appData/getAllCourseCodesThunk', 
  async (userData, { dispatch, rejectWithValue }) => {

    getRequest("courseCodes/").then((res) => {
      res = {data: COURSE_CODES};
      dispatch(setAllCourseCodes(res.data));
      return;
    }, (err) => {
      console.log("error in Network.GetAllCourseCodes: " + JSON.stringify(err));
      // dispatch(setStatus(err.response.status));
      return rejectWithValue(err.message);
    });

  }
);

