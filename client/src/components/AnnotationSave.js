
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAnnotations, addAnnotation } from '../store/slices/appDataSlice';

import { Button, Box, Flex, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, 
  AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Input, Text, FormHelperText, 
} from "@chakra-ui/react";

export default function AnnotationSave(props) {
  const dispatch = useDispatch();
  const savedAnnotations = useSelector(selectAnnotations);

  const cancelRef = React.useRef();
  const [name, setName] = useState("");
  const [nameInvalid, setNameInvalid] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState("");

  function handleSave() {
    if (name === "") {
      setNameInvalid(true);
    }
    else if (name.length > 8) {
      setNameInvalid(true);
      setInvalidMessage("Name must be less than 8 characters");
    }
    else if (Object.keys(savedAnnotations).includes(name)) {
      setNameInvalid(true);
      setInvalidMessage("Name already taken");
    }
    else {
      dispatch(addAnnotation({ 
        name: name, 
        concentration: props.concentration, 
        annotation: props.annotations 
      }));
      // dispatch save 
      // name, annotations
      setNameInvalid(false);
      setInvalidMessage("");
      setName("");
      props.popup.onClose();
      return;
    }
  }

  return (
    <>
      <Button colorScheme="cyan" onClick={props.popup.onOpen}>Save Annotations</Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={props.popup.onClose}
        isOpen={props.popup.isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Save Annotations</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text> Save your annotations for the { props.concentration } concentration?  </Text>
            <Input 
              style={ nameInvalid ? {border: "2px solid red"} : {} }
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Filename" 
              mt={5} 
            />
            <center>
              <Text color="red">{ invalidMessage }</Text>
            </center>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={props.popup.onClose}> Cancel </Button>
            <Button colorScheme="red" ml={3} onClick={handleSave}> Save </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

