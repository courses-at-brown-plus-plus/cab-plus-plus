import { Box, Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from "@chakra-ui/react";
import './Legend.css';
import { COLORS } from '../constants';

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
                    <Td><span className="dot" style={{backgroundColor: 'white'}}></span></Td>
                    <Td>Selected Course</Td>
                </Tr>
                <Tr>
                    <Td><span className="borderlessDot" style={{backgroundColor: COLORS.courseTaken}}></span></Td>
                    <Td>Course Taken</Td>
                </Tr>
                <Tr>
                    <Td><span className="dot" style={{backgroundColor: COLORS.courseAvailable}}></span></Td>
                    <Td>Available Course</Td>
                </Tr>
                <Tr>
                    <Td><span className="borderlessDot" 
                    style={{backgroundColor: COLORS.courseAvailable, borderWidth: "3px", borderColor: COLORS.courseTaken}}
                    ></span></Td>
                    <Td>Course in Wishlist</Td>
                </Tr>
            </Tbody>
          </Table>
      </Box>
    )
}

export default Legend;
