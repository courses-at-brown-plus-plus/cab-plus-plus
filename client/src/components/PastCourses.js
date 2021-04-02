import React, { useEffect, useState } from 'react';
import { InputGroup, Input, InputRightAddon, 
  Button, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react"
// import './PastCourses.css';

export default function PastCourses(props) {

  const [courseExists, setCourseExists] = useState(true);
  const [courseInputValue, setCourseInputValue] = useState("");

  // const [coursesTaken, setCoursesTaken] = useState(["CS19"]);
  const courseOptions = [
    "CS19", 
    "CS30", 
    "CS32", 
    "MATH0520", 
    "MATH0540"
  ]
  const [coursesTaken, setCoursesTaken] = useState(courseOptions);

  function handleAddCourse() {
    if (courseOptions.includes(courseInputValue)) {
      if (!coursesTaken.includes(courseInputValue)) {
        console.log("adding tag: " + courseInputValue);
        let newCoursesTaken = [...coursesTaken];
        newCoursesTaken.push(courseInputValue);
        setCoursesTaken(newCoursesTaken);
      }
      setCourseExists(true);
    }
    else {
      setCourseExists(false);
    }
  }

  function handleCloseTag(courseName) {
    let targetIndex = coursesTaken.indexOf(courseName);
    let newCoursesTaken = [...coursesTaken];
    if (targetIndex !== -1) {
      newCoursesTaken.splice(targetIndex, 1);
      setCoursesTaken(newCoursesTaken);
    }
  }

  return (
    <div style={{width: "24vw"}}>
      <InputGroup style={(courseExists) ? styles.inputGroup: styles.inputGroupError}>
        <Input 
          value={courseInputValue} 
          onChange={(e) => setCourseInputValue(e.target.value)}
          style={styles.courseInput}
          placeholder="Course ID"
        />
        <Button onClick={handleAddCourse} style={styles.addCourseButton}>Add Course</Button>
      </InputGroup>
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
