import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, ButtonGroup, Button, IconButton } from "@chakra-ui/react"
import { CloseIcon } from '@chakra-ui/icons';
import { removeAnnotation } from '../store/slices/appDataSlice';

export default function AnnotationBox(props) {

  const dispatch = useDispatch();

  function handleSelectAnnotation(name) {
    props.setSelectedConcentration(props.content.concentration);
    props.setDisplayedAnnotation(props.content.content);
  }

  function handleRemoveAnnotation(name) {
    dispatch(removeAnnotation({ name: name }));
  }

  return (
    <Box m={3}> 
      <ButtonGroup size="md" isAttached variant="outline">
        <Button px={10} onClick={() => {handleSelectAnnotation(props.name)}}> { props.name } </Button>
        <IconButton onClick={() => {handleRemoveAnnotation(props.name)}} icon={<CloseIcon />} />
      </ButtonGroup>
    </Box>
  )
}


