
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setPathwayData, setAllCourseCodes, setRecommendedCourses, 
  addPrereq, removePrereq } from '../store/slices/appDataSlice';
import { URL, AXIOS_CONFIG, PATHWAY_DATA, COURSE_CODES, RECOMMENDED_COURSES } from '../constants';

export const getRequest = async (resource) => {
  const res = await axios.get(URL + resource, AXIOS_CONFIG);
  // alert(JSON.stringify(res, null, 2));

  // dummy get request to wait for 2 seconds
  // res = await setTimeout(() => {
  //   return "get request dummy data";
  // }, 2);
  return res;
}

export const postRequest = async (resource, data) => {
  const res = await axios.post(URL + resource, data, AXIOS_CONFIG);

  // dummy post request to wait for 2 seconds
  // const res = await setTimeout(() => {
  //   return "post request dummy data";
  // }, 2);
  return res;
}

export const GetPathwayData = createAsyncThunk(
  'appData/getPathWayDataThunk', 
  async (params, { dispatch, rejectWithValue }) => {

    getRequest("allPathwayData").then((res) => {
      const pathwayData = res.data.pathwayData;
      // const pathwayData = PATHWAY_DATA;
      dispatch(setPathwayData(pathwayData));
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
  async (params, { dispatch, rejectWithValue }) => {

    getRequest("allCourseCodes").then((res) => {
      const courseCodes = res.data.courseCodes;
      // const courseCodes = COURSE_CODES;
      dispatch(setAllCourseCodes(courseCodes));
      return;
    }, (err) => {
      console.log("error in Network.GetAllCourseCodes: " + JSON.stringify(err));
      // dispatch(setStatus(err.response.status));
      return rejectWithValue(err.message);
    });

  }
);

export const GetRecommendations = createAsyncThunk(
  'appData/getRecommendationsThunk', 
  async (data, { dispatch, rejectWithValue }) => {

    postRequest("generateRecommendations", data).then((res) => {
      const recommendedCourses = res.data.recommendedCourses;
      // const recommendedCourses = RECOMMENDED_COURSES;
      dispatch(setRecommendedCourses(recommendedCourses));
      return;
    }, (err) => {
      console.log("error in Network.GetRecommendations: " + JSON.stringify(err));
      // dispatch(setStatus(err.response.status));
      return rejectWithValue(err.message);
    });

  }
);

export const ReportIssue = createAsyncThunk(
  'appData/reportIssueThunk', 
  async (data, { dispatch, rejectWithValue }) => {

    if (data.issueType === "add") {
      dispatch(addPrereq(data));
    }
    else if (data.issueType === "remove") {
      dispatch(removePrereq(data));
    }

    postRequest("logIssue", {
      issue_type: data.issueType, 
      prereq_id: data.prereqCourse, 
      unlocked_id: data.unlockedCourse
    }).then((res) => {
      return;
    }, (err) => {
      console.log("error in Network.ReportIssue: " + JSON.stringify(err));
      // dispatch(setStatus(err.response.status));
      return rejectWithValue(err.message);
    });

  }
);

