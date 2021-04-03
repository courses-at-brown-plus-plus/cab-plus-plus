import React from 'react';
import { Button } from "@chakra-ui/react"

export default function AppFooter() {
  // <div style={{position: "absolute", bottom: "2rem", width: "100%"}}>
  return (
    <div style={{marginBottom: "2rem", width: "100%"}}>
      Report an issue to us!! 
      <Button variant="link" colorScheme="cyan"> Link </Button>
    </div>
  );
}
