import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllCourseCodes } from '../store/slices/appDataSlice';

import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalCloseButton, ModalFooter, ModalBody, useDisclosure, 
  Box, Input, Flex, Text, InputGroup, useToast } from "@chakra-ui/react";

import { ArrowForwardIcon } from '@chakra-ui/icons';


export default function ReportPopup() {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const allCourseCodes = useSelector(selectAllCourseCodes);

  const [addPrereqInputVal, setAddPrereqInputVal] = useState("");
  const [addPrereqCourseExists, setAddPrereqCourseExists] = useState(true);

  const [addUnlockedInputVal, setAddUnlockedInputVal] = useState("");
  const [addUnlockedCourseExists, setAddUnlockedCourseExists] = useState(true);

  const [removePrereqInputVal, setRemovePrereqInputVal] = useState("");
  const [removePrereqCourseExists, setRemovePrereqCourseExists] = useState(true);

  const [removeUnlockedInputVal, setRemoveUnlockedInputVal] = useState("");
  const [removeUnlockedCourseExists, setRemoveUnlockedCourseExists] = useState(true);

  function displayToast() {
    toast({
      title: "Graph Updated",
      description: "We'll review your changes as soon as possible!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  function handleAddPrereq() {
    let prereqValid = allCourseCodes.includes(addPrereqInputVal);
    let unlockedValid = allCourseCodes.includes(addUnlockedInputVal);
    setAddPrereqCourseExists(prereqValid);
    setAddUnlockedCourseExists(unlockedValid);

    if (prereqValid && unlockedValid) {
      alert("sent");
      // connect nodes (addPrereqInputVal, addUnlockedInputVal)
      setAddPrereqInputVal("");
      setAddUnlockedInputVal("");
      displayToast();
    }
  }

  function handleRemovePrereq() {
    let prereqValid = allCourseCodes.includes(removePrereqInputVal);
    let unlockedValid = allCourseCodes.includes(removeUnlockedInputVal);
    setRemovePrereqCourseExists(prereqValid);
    setRemoveUnlockedCourseExists(unlockedValid);

    if (prereqValid && unlockedValid) {
      alert("sent");
      // connect nodes (removePrereqInputVal, removeUnlockedInputVal)
      setRemovePrereqInputVal("");
      setRemoveUnlockedInputVal("");
      displayToast();
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

