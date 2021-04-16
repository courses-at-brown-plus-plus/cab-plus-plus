import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllCourseCodes, selectErrorMessage, selectIssueReportState, selectPathwayData, 
  resetIssueReportState, broadcastError } from '../store/slices/appDataSlice';

import { ReportIssue } from '../api/Network';

import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalCloseButton, ModalFooter, ModalBody, useDisclosure, 
  Box, Input, Flex, Text, useToast } from "@chakra-ui/react";
import { ArrowForwardIcon } from '@chakra-ui/icons';


export default function ReportPopup() {
  const toast = useToast();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const allCourseCodes = useSelector(selectAllCourseCodes);
  const errorMessage = useSelector(selectErrorMessage);
  const issueReportState = useSelector(selectIssueReportState);
  const pathwayData = useSelector(selectPathwayData);

  const [addPrereqInputVal, setAddPrereqInputVal] = useState("");
  const [addPrereqCourseExists, setAddPrereqCourseExists] = useState(true);

  const [addUnlockedInputVal, setAddUnlockedInputVal] = useState("");
  const [addUnlockedCourseExists, setAddUnlockedCourseExists] = useState(true);

  const [removePrereqInputVal, setRemovePrereqInputVal] = useState("");
  const [removePrereqCourseExists, setRemovePrereqCourseExists] = useState(true);

  const [removeUnlockedInputVal, setRemoveUnlockedInputVal] = useState("");
  const [removeUnlockedCourseExists, setRemoveUnlockedCourseExists] = useState(true);

  useEffect(() => {
    if (errorMessage === "" || issueReportState === 0) {
      return;
    }
    toast({
      title: "Issue Report",
      description: errorMessage, 
      status: (issueReportState > 0) ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });
    dispatch(resetIssueReportState());
    if (issueReportState < 0) {
      onOpen();
    }
  }, [issueReportState]);

  function prereqExists(prereqCourse, unlockedCourse) {
    let targetIndex = -1;
    pathwayData[prereqCourse].preReqs.forEach((aPrereq, index) => {
      if (aPrereq[0] === unlockedCourse) {
        targetIndex = index;
      }
    })
    return (targetIndex !== -1);
  }

  function handleAddPrereq() {
    let prereqCourse = addPrereqInputVal;
    let unlockedCourse = addUnlockedInputVal;
    let prereqValid = allCourseCodes.includes(prereqCourse);
    let unlockedValid = allCourseCodes.includes(unlockedCourse);
    setAddPrereqCourseExists(prereqValid);
    setAddUnlockedCourseExists(unlockedValid);

    if (prereqValid && unlockedValid) {
      if (!prereqExists(prereqCourse, unlockedCourse)) {
        dispatch(ReportIssue({
          issueType: "add",
          prereqCourse: addPrereqInputVal, 
          unlockedCourse: addUnlockedInputVal
        }));
        setAddPrereqInputVal("");
        setAddUnlockedInputVal("");
        onClose();
      }
      else {
        dispatch(broadcastError({
          errorMessage: "This prerequisite already exists", 
          issueReportState: -1
        }));
      }
    }
  }

  function handleRemovePrereq() {
    let prereqCourse = removePrereqInputVal;
    let unlockedCourse = removeUnlockedInputVal;
    let prereqValid = allCourseCodes.includes(prereqCourse);
    let unlockedValid = allCourseCodes.includes(unlockedCourse);
    setRemovePrereqCourseExists(prereqValid);
    setRemoveUnlockedCourseExists(unlockedValid);

    if (prereqValid && unlockedValid) {
      if (prereqExists(prereqCourse, unlockedCourse)) {
        dispatch(ReportIssue({ 
          issueType: "remove",
          prereqCourse: removePrereqInputVal, 
          unlockedCourse: removeUnlockedInputVal
        }));
        setRemovePrereqInputVal("");
        setRemoveUnlockedInputVal("");
        onClose();
      }
      else {
        dispatch(broadcastError({
          errorMessage: "This prerequisite does not exist", 
          issueReportState: -1
        }));
      }
    }
  }

  return (
    <React.Fragment>
      <Box mx={2}>
        <Button variant="link" onClick={onOpen}>Link</Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <center>
            <ModalHeader>Report an Issue</ModalHeader>
            <ModalCloseButton />
            <ModalBody>


              <Flex justifyContent="center" alignItems="center">
                <Input 
                  value={addPrereqInputVal} 
                  onChange={(e) => setAddPrereqInputVal(e.target.value)}
                  style={(addPrereqCourseExists) ? styles.courseInput: styles.courseInputError}
                  placeholder="Prereq code"
                />
                <ArrowForwardIcon m={3}/>
                <Input 
                  value={addUnlockedInputVal} 
                  onChange={(e) => setAddUnlockedInputVal(e.target.value)}
                  style={(addUnlockedCourseExists) ? styles.courseInput: styles.courseInputError}
                  placeholder="Unlocked code"
                />
                <Button mx={3} px={10} onClick={handleAddPrereq}> Add </Button>
              </Flex>

              <br/> 

              <Flex justifyContent="center" alignItems="center">
                <Input 
                  value={removePrereqInputVal} 
                  onChange={(e) => setRemovePrereqInputVal(e.target.value)}
                  style={(removePrereqCourseExists) ? styles.courseInput: styles.courseInputError}
                  placeholder="Prereq code"
                />
                <ArrowForwardIcon m={3}/>
                <Input 
                  value={removeUnlockedInputVal} 
                  onChange={(e) => setRemoveUnlockedInputVal(e.target.value)}
                  style={(removeUnlockedCourseExists) ? styles.courseInput: styles.courseInputError}
                  placeholder="Unlocked code"
                />
                <Button mx={3} px={10} onClick={handleRemovePrereq}> Remove </Button>
              </Flex>

              <br/>
              <Text>
                This report will be stored in our internal databases, and manually reviewed as soon as possible!!
                In the meantime, your instance of the app will be updated to reflect your suggestions
              </Text>


            </ModalBody>
            <ModalFooter>
            </ModalFooter>
          </center>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}

const styles = {
  courseInput: {
    border: "1px solid lightgrey", 
    borderRadius: "0.3rem"
  },
  courseInputError: {
    border: "2px solid red", 
    borderRadius: "0.3rem"
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

