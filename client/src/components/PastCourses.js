import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllCourseCodes, selectCoursesTaken, 
  addCourseTaken, removeCourseTaken} from '../store/slices/appDataSlice';

import { InputGroup, Input, Button, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react"

import CourseAutocomplete from '../components/CourseAutocomplete';

export default function PastCourses(props) {

  const dispatch = useDispatch();
  const allCourseCodes = useSelector(selectAllCourseCodes);
  const coursesTaken = useSelector(selectCoursesTaken);

  function handleCloseTag(courseName) {
    dispatch(removeCourseTaken(courseName));
  }

  return (
    <div style={{width: "20vw", marginRight: "3rem"}}>
      <CourseAutocomplete 
        handleAddCourse={(newCourseCode) => {
          if (!coursesTaken.includes(newCourseCode)) {
            dispatch(addCourseTaken(newCourseCode));
          }
        }}
      />
      <br/>

      <div>
        { coursesTaken.map((aCourseName) => (
            <Tag
              style={{ margin: "0.2rem" }}
              size="md"
              borderRadius="full"
              variant="solid"
              colorScheme="green"
              key={aCourseName}
            >
              <TagLabel>{aCourseName}</TagLabel>
              <TagCloseButton onClick={() => handleCloseTag(aCourseName)} />
            </Tag>
          ))
        }
      </div>
    </div>
  );
}

