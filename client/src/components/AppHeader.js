import React from 'react';
import { Flex, Button, Box } from "@chakra-ui/react"
import { NavLink } from 'react-router-dom';

export default function AppHeader() {

  return (
    <Flex
      as="nav"
      padding="1rem 2rem"
      bg="red.700"
      color="white"
      wrap="wrap"
      fontSize="1.5em"
    >

      <Box mr="8">
        <h1 >
          COURSES @ BROWN ++
        </h1>
      </Box>

      <Box mr="8">
        <NavLink to={ "/" }>
          <Button variant="outline">
            Pathways
          </Button>
        </NavLink>
      </Box>

      <Box mr="8">
        <NavLink to={ "/suggestions" }>
          <Button variant="outline">
            Course Suggestions
          </Button>
        </NavLink>
      </Box>

    </Flex>
  );
}
