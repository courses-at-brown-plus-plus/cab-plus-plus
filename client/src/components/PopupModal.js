
import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, Heading, 
  ModalCloseButton, ModalFooter, ModalBody, useDisclosure } from "@chakra-ui/react"

export default function PopupModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <React.Fragment>
      <Button variant="outline" onClick={onOpen}>{ props.title }</Button>

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

