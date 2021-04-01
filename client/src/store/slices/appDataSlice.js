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

export default slice.reducer;
