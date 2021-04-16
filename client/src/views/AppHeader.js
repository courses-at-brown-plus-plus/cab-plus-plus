import React from 'react';
import { Flex, Box, Text, Heading } from "@chakra-ui/react"
import { NavLink } from 'react-router-dom';
import PopupModal from '../components/PopupModal';

export default function AppHeader() {

  function renderHeaderButton(text) {
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
      >
        <Text fontSize="16px">
          { text }
        </Text>
      </Box>
    );
  }

  function renderAboutSection() {
    return (
      <PopupModal title="About" header="About C@B++">
        This site was created by 
        <br/>
        Emily Ye, Gareth Mansfield, Kevin Hsu, William Sun
        <br/>
        for our CS0320 term project.

        <br/> <br/>

        We process data on various courses in order to figure out which ones correlate best with each other, so we can recommend them to students. We ensure that this is done safely by not using any data linked to specific students and only using publicly available data from C@B or aggregated data from the Critical Review. 

        <br/> <br/>
        This project is secured against possible malfunctions/crashes by scraping the data and calculating course similarities ahead of time to ensure that there is always a version that we can use even if there is a malfunction.

      </PopupModal>
    );
  }

  function renderInstructionsSection() {
    return (
      <PopupModal title="Instructions" header="How to use the site">

        <hr/> <br/>
        <Heading as="h6" size="md"> Pathways </Heading>
        <Box margin="0 auto" pl={7}>
          <Text align="left">
            <ol>
              <li> Input the courses you've already taken on the input box to the left.</li>
              <li> Explore concentrations by choosing one in the "Select concentration" dropdown. </li>
              <li> Here, you can use the "Search for course ID" feature to immediately find a course on the graph. </li>
              <li> Double clicking a course on the graph shows additional information about the course. </li>
              <li> For courses that you've cleared the requirements for, there will also be the option to annotate them. </li>
              <li> The annotations of each concentration can be named and saved, then retrieved by clicking on the container to the right. </li>
              <li> Issues can be filed and reported with the link on the bottom, which will update immediately on your instance of the application </li>
            </ol>
          </Text>
        </Box>

        <br/> <hr/> <br/>

        <Heading as="h6" size="md"> Course Suggestions </Heading>
        <Box margin="0 auto" pl={7}>
          <Text align="left">
            <ol>
              <li> Input the courses you've already taken on the input box to the left. </li>
              <li> Select up to a maximum of four ranked priorities from the dropdowns. </li>
              <li> Click submit and explore our suggestions! </li>
            </ol>
          </Text>
        </Box>
      </PopupModal>
    );
  }

  return (
    <Flex
      as="nav"
      padding="1rem 2rem"
      bg="red.700"
      color="white"
      wrap="wrap"
      fontSize="1.5em"
      justify="space-between"
    >

      <Flex>
        <Box mr="8">
          <h1> COURSES @ BROWN ++ </h1>
        </Box>

        <Box mr="8">
          <NavLink to={ "/" }>
            { renderHeaderButton("Pathways") }
          </NavLink>
        </Box>

        <Box mr="8">
          <NavLink to={ "/suggestions" }>
            { renderHeaderButton("Course Suggestions") }
          </NavLink>
        </Box>
      </Flex>

      <Flex>
        <Box mr="8"> { renderInstructionsSection() } </Box>
        <Box> { renderAboutSection() } </Box>
      </Flex>

    </Flex>
  );
}
