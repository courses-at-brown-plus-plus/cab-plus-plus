import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'appData', 
  initialState: {
    pathwayData: {"placeholderConcentration": "aGraph"}
    // graph annotations
    // courses taken
    // undo tree for "courses taken" input
    // undo tree for graph annotations
  }, 
  reducers: {
    setPathwayData: (state, action) => {
      state.pathwayData = action.payload;
    },
    // addGraphAnnotations: (state, action) => {
    //   state.graphAnnotations[action.payload.concentration] = action.payload.annotation;
    // }
  }
})

export const { setPathwayData } = slice.actions;

export const selectPathwayData = state => state.appData.pathwayData;
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
