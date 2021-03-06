import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Select, useToast } from "@chakra-ui/react"

import { GetRecommendations } from '../api/Network';
import { selectRecommendedCourses, selectCoursesTaken } from '../store/slices/appDataSlice';

import PastCourses from '../components/PastCourses';
import RecommendationCard from '../components/RecommendationCard';

import { PRIORITY_OPTIONS } from '../constants';

export default function CourseSuggestions() {

  // const [priorities, setPriorities] = useState({
  //   "Time commitment": -1, 
  //   "Difficulty": -1, 
  //   "Priority3": -1, 
  //   "Priority4": -1
  // });

  const coursesTaken = useSelector(selectCoursesTaken);
  const recommendedCourses = useSelector(selectRecommendedCourses);
  const toast = useToast();


  const [priorityContents, setPriorityContents] = useState({
    "1": "", 
    "2": "", 
    "3": "", 
    "4": ""
  });

  const dispatch = useDispatch();

  function submitPriorityForm() {
    // dispatch(GetRecommendations(priorityContents));

    if (coursesTaken.length === 0) {
      toast({
        title: "Recommendation generation",
        description: "No past course history", 
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    let priorities = [];
    Object.keys(priorityContents).forEach((keyName) => {
      let aPriorityTitle = priorityContents[keyName];
      if (aPriorityTitle !== "") {
        priorities.push(aPriorityTitle);
      }
    });

    let uniquePriorities = [...new Set(priorities)];
    if (uniquePriorities.length !== priorities.length) {
      toast({
        title: "Recommendation generation",
        description: "Contains duplicate priorities", 
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }

    dispatch(GetRecommendations({ 
      priorities: priorities,
      courses_taken: coursesTaken
    }));
  }

  function handleSelectionChange(e, key) {
    let newPriorityContents = {...priorityContents};
    newPriorityContents[key] = e.target.value;
    console.log(JSON.stringify(newPriorityContents));
    setPriorityContents(newPriorityContents);
  }

  // function renderDropdownOptions(availablePriorities) {

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

    // return (
    //   <React.Fragment>
    //     {PRIORITY_OPTIONS.map((priorityTitle) => {
    //         return (
    //           <option value={priorityTitle}> {priorityTitle}</option>
    //         )
    //       })
    //     }
    //   </React.Fragment>
    // );

    // return (
    //   <React.Fragment>
    //     <option value="Time Commitment">Time Commitment</option>
    //     <option value="option2">Option 2</option>
    //     <option value="option3">Option 3</option>
    //   </React.Fragment>
    // );
  // }

  function renderPriorityDropdowns() {
    // return Object.entries(priorities).map(([key, value]) => (
    // const takenPriorities = Object.values(priorityContents);

    // const availablePriorities = priorities.filter((aPriority) => !takenPriorities.includes(aPriority));

    // let availablePriorities = [];
    // priorities.forEach((aPriority) => {
    //   if (!takenPriorities.includes(aPriority)){
    //     availablePriorities.push(aPriority);
    //   }
    // });
    // console.log("availablePriorities: ");
    // console.log(JSON.stringify(availablePriorities));

    return Object.entries(priorityContents).map(([priorityNumber, selectedValue]) => (
      <Select 
        placeholder="No Option Chosen" 
        key={priorityNumber}
        value={selectedValue}
        onChange={(e) => handleSelectionChange(e, priorityNumber)}
      >
        {
          PRIORITY_OPTIONS.map((priorityTitle) => (
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
        <Button onClick={() => submitPriorityForm()} mt="5" colorScheme="red" bg="red.700" width="160px"> Submit </Button>
        <br/>
      </Box>

      { 
        // JSON.stringify(recommendedCourses) 
      }
      {
      // <Box style={{marginLeft: "3rem", width: "28vw"}}>
      //   { recommendedCourses && recommendedCourses.map((aCourseInfo) => 
      //   <RecommendationCard 
      //     title={aCourseInfo.title} 
      //     description={aCourseInfo.description} 
      //     link={aCourseInfo.link} 
      //   />
      //   )}
      // </Box>
      }

      <Box style={{marginLeft: "3rem", width: "28vw"}}>
        { recommendedCourses && Object.keys(recommendedCourses).map((aCourseInfo) => 
        <RecommendationCard 
          title={recommendedCourses[aCourseInfo].title} 
          // description={recommendedCourses[aCourseInfo].description} 
          description={recommendedCourses[aCourseInfo].description} 
          link={recommendedCourses[aCourseInfo].link} 
        />
        )}
      </Box>


    </React.Fragment>
  );

}

