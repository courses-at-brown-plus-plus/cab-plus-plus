import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalCloseButton, ModalFooter, ModalBody, useDisclosure } from "@chakra-ui/react"

export default function AboutPopup() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <React.Fragment>
      <Button variant="outline" onClick={onOpen}>About</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <center>
            <ModalHeader>About The Site</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

              This site was created by 
              <br/>
              Emily Ye, Gareth Mansfield, Kevin Hsu, William Sun
              <br/>
              for our CS0320 term project.

              <br/> <br/>

              We process data on various courses in order to figure out which ones correlate best with each other so we can recommend them to students. We ensure that this is done safely by not using any data linked to specific students and only using publicly available data from C@B or aggregated data from the Critical Review. 

              <br/> <br/>
              This project is secured against possible malfunctions/crashes by scraping the data and calculating course similarities ahead of time to ensure that there is always a version that we can use even if there is a malfunction.


            </ModalBody>

            <ModalFooter>
            </ModalFooter>
          </center>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}

