import './CourseView.css';

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Divider
} from "@chakra-ui/react"

function CourseView(props) {
    return (
        <div style={{width: props.width, height: props.height}} className="courseView">
            <h1 className="courseTitle">{props.node.id + ": " + props.node.name}</h1>
            <Divider orientation="horizontal" />
            <p className="courseDesc">{props.node.desc}</p>
            <Table>
                <Thead>
                  <Tr>
                    <Th>FYS</Th>
                    <Th>SOPH</Th>
                    <Th>DIAP</Th>
                    <Th>WRIT</Th>
                    <Th>CBLR</Th>
                    <Th>COEX</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    {
                        props.node.categories.map((s, index) => {return(<Td key={index} className="categoryTd">{s[0]}</Td>);})
                    }
                  </Tr>

                <Tr>

                </Tr>
                </Tbody>
            </Table>
        </div>);
}

export default CourseView;