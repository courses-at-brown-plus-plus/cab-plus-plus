import React, { useState, useEffect } from 'react';
import { Select, Box, Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption} from "@chakra-ui/react"
import './Legend.css';

function Legend(props) {
    return (
      <Box p={5} w={'14vw'} ml={'3rem'}>
          <Table>
            <Thead>
                <Tr>
                    <Th>Color</Th>
                    <Th>Meaning</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td><span id="whiteDot"></span></Td>
                    <Td>Course Unavailable</Td>
                </Tr>
                <Tr>
                    <Td><span id="greenDot"></span></Td>
                    <Td>Course Taken</Td>
                </Tr>
                <Tr>
                    <Td><span id="lightGreenDot"></span></Td>
                    <Td>Course Available</Td>
                </Tr>
            </Tbody>
          </Table>
      </Box>
    )
}

export default Legend;