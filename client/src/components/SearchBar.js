import React, { useState, useEffect } from 'react';
import { selectAllCourseCodes, selectCoursesTaken, 
  addCourseTaken, removeCourseTaken} from '../store/slices/appDataSlice';

import { InputGroup, Input, useToast, 
  Button, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react"

function SearchBar(props) {
    return (
        <InputGroup style={styles.inputGroup}>
            <Input 
              
              style={styles.courseInput}
              placeholder="Course ID"
            />
            <Button style={styles.findCourseButton}>Search</Button>
        </InputGroup>
    )
}

const styles = {
  inputGroup: {
    marginTop: "1rem",
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
  findCourseButton: {
    paddingLeft: "2rem",
    paddingRight: "2rem",
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "0"
  }, 
  courseTag: {
    margin: "0.2rem",
  }
}

export default SearchBar;