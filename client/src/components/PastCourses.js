import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllCourseCodes, selectCoursesTaken, 
  addCourseTaken, removeCourseTaken} from '../store/slices/appDataSlice';

import { InputGroup, Input, useToast, 
  Button, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react"

import CourseAutocomplete from '../components/CourseAutocomplete';

export default function PastCourses(props) {

  const toast = useToast()
  const dispatch = useDispatch();
  const allCourseCodes = useSelector(selectAllCourseCodes);
  const coursesTaken = useSelector(selectCoursesTaken);

  const [courseExists, setCourseExists] = useState(true);
  const [courseInputValue, setCourseInputValue] = useState("");

  // function handleAddCourse() {
  //   if (allCourseCodes.includes(courseInputValue)) {
  //     if (!coursesTaken.includes(courseInputValue)) {
  //       dispatch(addCourseTaken(courseInputValue));
  //     }
  //     setCourseInputValue("");
  //     setCourseExists(true);
  //   }
  //   else {
  //     setCourseExists(false);
  //     toast({
  //       title: "Invalid course code",
  //       status: "error",
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //   }
  // }

  function handleCloseTag(courseName) {
    dispatch(removeCourseTaken(courseName));
  }

  return (
    <div style={{width: "20vw", marginRight: "3rem"}}>
      {
      // <InputGroup style={(courseExists) ? styles.inputGroup: styles.inputGroupError}>
      //   <Input 
      //     value={courseInputValue} 
      //     onChange={(e) => setCourseInputValue(e.target.value)}
      //     style={styles.courseInput}
      //     placeholder="Course ID"
      //   />
      //   <Button onClick={handleAddCourse} style={styles.addCourseButton}>Add Course</Button>
      // </InputGroup>
      }

      <CourseAutocomplete 
        allCourseCodes={allCourseCodes} 
        handleAddCourse={(newCourseCode) => {
          if (!coursesTaken.includes(newCourseCode)) {
            dispatch(addCourseTaken(newCourseCode));
          }
        }}
      />
      <br/>

      <div style={styles.tagContainer}>
        {
          coursesTaken.map((aCourseName) => (
            <Tag
              style={styles.courseTag}
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

const styles = {
  inputGroup: {
    border: "1px solid lightgrey", 
    borderRadius: "0.3rem"
  },
  inputGroupError: {
    border: "2px solid red", 
    borderRadius: "0.3rem"
  },
  courseInput: {
    border: "none"
  },
  addCourseButton: {
    paddingLeft: "2rem",
    paddingRight: "2rem",
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "0"
  }, 
  courseTag: {
	margin: "0.2rem",
  }
}
