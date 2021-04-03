import React, { useState } from 'react';
import PastCourses from '../components/PastCourses';
import RecommendationCard from '../components/RecommendationCard';
import { Box, Button, Select } from "@chakra-ui/react"
import { COURSE_DESCRIPTIONS } from '../constants';

export default function CourseSuggestions() {

  // const [priorities, setPriorities] = useState({
  //   "Time commitment": -1, 
  //   "Difficulty": -1, 
  //   "Priority3": -1, 
  //   "Priority4": -1
  // });

  const priorities = ["Time Commitment", "Difficulty", "Priority3", "Priority4"];

  const [selectorContents, setSelectorContents] = useState({
    "1": "", 
    "2": "", 
    "3": "", 
    "4": ""
  });

  function handleSelectionChange(e, key) {
    let newSelectorContents = {...selectorContents};
    newSelectorContents[key] = e.target.value;
    console.log(JSON.stringify(newSelectorContents));
    setSelectorContents(newSelectorContents);
  }

  function renderDropdownOptions(availablePriorities) {

    // <option key={priorityTitle} value={priorityTitle}>{priorityTitle}</option>
    // return availablePriorities.map((priorityTitle) => (
    //   <option value="option1"> {priorityTitle}</option>
    // ));
        // {
        //   availablePriorities.map((priorityTitle) => {
        //     console.log("%c " + priorityTitle, 'background: green');
        //     return (
        //       <option value={priorityTitle}> {priorityTitle}</option>
        //     )
        //   }
        //   )
        // }

    return (
      <React.Fragment>
        {priorities.map((priorityTitle) => {
            return (
              <option value={priorityTitle}> {priorityTitle}</option>
            )
          })
        }
      </React.Fragment>
    );

    // return (
    //   <React.Fragment>
    //     <option value="Time Commitment">Time Commitment</option>
    //     <option value="option2">Option 2</option>
    //     <option value="option3">Option 3</option>
    //   </React.Fragment>
    // );
  }

  function renderPriorityDropdowns() {
    // return Object.entries(priorities).map(([key, value]) => (
    const takenPriorities = Object.values(selectorContents);

    // const availablePriorities = priorities.filter((aPriority) => !takenPriorities.includes(aPriority));

    // let availablePriorities = [];
    // priorities.forEach((aPriority) => {
    //   if (!takenPriorities.includes(aPriority)){
    //     availablePriorities.push(aPriority);
    //   }
    // });
    // console.log("availablePriorities: ");
    // console.log(JSON.stringify(availablePriorities));

    return Object.entries(selectorContents).map(([priorityNumber, selectedValue]) => (
      <Select 
        placeholder="No Option Chosen" 
        key={priorityNumber}
        value={selectedValue}
        onChange={(e) => handleSelectionChange(e, priorityNumber)}
      >
        {
          priorities.map((priorityTitle) => (
            <option value={priorityTitle}> {priorityTitle}</option>
          ))
        }
      </Select>
    ))
  }

  return (
    <React.Fragment>
      <PastCourses />

      <Box>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Box bg="gray.100" py="5" px="10">
            Priorities for Recommendations
            <br/>
            (Ranked)
          </Box>

          { renderPriorityDropdowns() }

        </Box>
        <Button mt="5" colorScheme="red" bg="red.700" width="160px"> Submit </Button>
        <br/>
      </Box>

      <Box style={{marginLeft: "3rem"}}>
        { COURSE_DESCRIPTIONS.map((aCourseInfo) => 
        <RecommendationCard 
          title={aCourseInfo.title} 
          description={aCourseInfo.description} 
          link={aCourseInfo.link} 
        />
        )}
      </Box>


    </React.Fragment>
  );

}

