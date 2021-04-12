import React from 'react';
import { Button, Flex } from "@chakra-ui/react"

import ReportPopup from '../components/ReportPopup';

export default function AppFooter() {
  // <div style={{position: "absolute", bottom: "2rem", width: "100%"}}>
  return (
    <div style={{marginBottom: "2rem", width: "100%"}}>
      <Flex justifyContent="center">
        Report an issue to us!! 
        {
          // <Button variant="link" colorScheme="cyan"> Link </Button>
        }
        <ReportPopup/>
      </Flex>
    </div>
  );
}
