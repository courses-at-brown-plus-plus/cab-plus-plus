
import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, Heading, Box, Text, 
  ModalCloseButton, ModalFooter, ModalBody, useDisclosure } from "@chakra-ui/react"

export function HeaderButton(props) {
  return (
    <Box
      as="button"
      bg="transparent"
      py={2}
      px={4}
      rounded="md"
      fontWeight="semibold"
      color="white"
      border="1px solid white"
      transition="0.2s"
      _hover={{ bg: "red.900" }}
      _focus={{ boxShadow: "outline" }}
      onClick={ props.onClick }
    >
      <Text fontSize="16px">
        { props.text }
      </Text>
    </Box>
  );
}

export default function PopupModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <React.Fragment>
      {
        // <Button variant="outline" onClick={onOpen}>{ props.title }</Button>
      }
      <HeaderButton text={props.title} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <center>
            <ModalHeader>
              <Heading as="h6" size="lg"> 
                { props.header }
              </Heading>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              { props.children }
            </ModalBody>

            <ModalFooter>
            </ModalFooter>
          </center>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}

