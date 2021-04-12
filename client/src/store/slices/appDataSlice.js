import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'appData', 
  initialState: {
    pathwayData: {"placeholderConcentration": "aGraph"},
    allCourseCodes: [],
    coursesTaken: [], 
    recommendedCourses: [], 
    errorMessage: "",
    issueReportState: 0, 
    annotations: {},
    // graph annotations
    // undo tree for "courses taken" input?
    // undo tree for graph annotations?
  }, 
  reducers: {
    setPathwayData: (state, action) => {
      state.pathwayData = action.payload;
    },
    setAllCourseCodes: (state, action) => {
      state.allCourseCodes = action.payload;
    },
    setRecommendedCourses: (state, action) => {
      state.recommendedCourses = action.payload;
    },
    addCourseTaken: (state, action) => {
      state.coursesTaken.push(action.payload);
    },
    removeCourseTaken: (state, action) => {
      let targetIndex = state.coursesTaken.indexOf(action.payload);
      if (targetIndex !== -1) {
        state.coursesTaken.splice(targetIndex, 1);
      }
    },
    addAnnotation: (state, action) => {
      state.annotations[action.payload.name] = { 
        content: [...action.payload.annotation], 
        concentration: action.payload.concentration
      };
    }, 
    removeAnnotation: (state, action) => {
      delete state.annotations[action.payload.name];
    }, 
    addPrereq: (state, action) => {
      let unlockedCourse = action.payload.unlockedCourse;
      let prereqCourse = action.payload.prereqCourse;

      let targetIndex = -1;
      state.pathwayData[prereqCourse].preReqs.forEach((aPrereq, index) => {
        if (aPrereq[0] === unlockedCourse) {
          targetIndex = index;
        }
      })

      if (targetIndex === -1) {
        state.pathwayData[prereqCourse].preReqs.push([unlockedCourse, 1]);
        state.errorMessage = "We'll review your changes as soon as possible!";
        state.issueReportState = 1;
      }
      else {
        state.errorMessage = "This prerequisite already exists";
        state.issueReportState = -1;
      }
    }, 
    removePrereq: (state, action) => {
      let unlockedCourse = action.payload.unlockedCourse;
      let prereqCourse = action.payload.prereqCourse;

      let targetIndex = -1;
      state.pathwayData[prereqCourse].preReqs.forEach((aPrereq, index) => {
        if (aPrereq[0] === unlockedCourse) {
          targetIndex = index;
        }
      })

      if (targetIndex !== -1) {
        state.pathwayData[prereqCourse].preReqs.splice(targetIndex, 1);
        state.errorMessage = "We'll review your changes as soon as possible!";
        state.issueReportState = 1;
      }
      else {
        state.errorMessage = "This prerequisite does not exist";
        state.issueReportState = -1;
      }
    }, 
    resetIssueReportState: (state, action) => {
      state.issueReportState = 0;
    }
    // addGraphAnnotations: (state, action) => {
    //   state.graphAnnotations[action.payload.concentration] = action.payload.annotation;
    // }
  }
})

export const { setPathwayData, setAllCourseCodes, setRecommendedCourses, 
  addCourseTaken, removeCourseTaken, 
  addPrereq, removePrereq, 
  addAnnotation, removeAnnotation, resetIssueReportState } = slice.actions;

export const selectPathwayData = state => state.appData.pathwayData;
export const selectAllCourseCodes = state => state.appData.allCourseCodes;
export const selectCoursesTaken = state => state.appData.coursesTaken;
export const selectRecommendedCourses = state => state.appData.recommendedCourses;
export const selectErrorMessage = state => state.appData.errorMessage;
export const selectIssueReportState = state => state.appData.issueReportState;
export const selectAnnotations = state => state.appData.annotations;
// export const selectConcentrations = state => {
//   let concentrations = Object.entries(state.appData.pathwayData).map(([concentrationName, values]) => {
//     return baseCourse;
//   });
//   for (const [baseCourse, unlockedCourses] of Object.entries(concentrationInfo)) {
//     let courseEdges = unlockedCourses.map((nextCourse) => {
//       return new Edge(baseCourse, nextCourse, 0);
//     });
//     aGraph.set(baseCourse, new CourseNode(baseCourse, courseEdges, []));
//   }
//   return state.appData.pathwayData;

// }

export default slice.reducer;
