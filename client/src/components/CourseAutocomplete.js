
import React, { useState, useEffect } from 'react'
import { TextField } from '@material-ui/core/';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useSelector } from 'react-redux';
import { selectAllCourseCodes } from '../store/slices/appDataSlice';

export default function CourseAutocomplete(props) {
  const allCourseCodes = useSelector(selectAllCourseCodes);
  const [courseCodes, setCourseCodes] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);

  useEffect(() => {
    let newCourseCodes = [];
    allCourseCodes.forEach((aCourseCode) => {
      newCourseCodes.push({ title: aCourseCode });
    });
    setCourseCodes(newCourseCodes);
  }, [allCourseCodes]);

  useEffect(() => {
    if (selectedCourseCode !== null && selectedCourseCode !== "") {
      let newCourseCode = selectedCourseCode
      props.handleAddCourse(newCourseCode);
      setSelectedCourseCode("");
    }
  }, [selectedCourseCode]);

  function handleSelectCourseCode(newCourseObject) {
    if (newCourseObject && newCourseObject.title) {
      setSelectedCourseCode(newCourseObject.title)
    }
  }

  const widthValue = (props.sm) ? 200 : 380;

  return (
    <div>
      <Autocomplete
        options={courseCodes}
        getOptionLabel={(option) => option.title}
        style={{ width: widthValue }}
        value={selectedCourseCode}
        onChange={(event, newInputValue) => {handleSelectCourseCode(newInputValue)}}
        renderInput={(params) => 
          <TextField {...params} 
            label={(props.title) ? props.title : "Add Course ID" }
            variant="outlined" 
          /> }
      />
    </div>
  );
}

