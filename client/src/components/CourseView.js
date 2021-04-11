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
                    <Th>FYS</Th>
                    <Th>SOPH</Th>
                    <Th>DIAP</Th>
                    <Th>WRIT</Th>
                    <Th>CBLR</Th>
                    <Th>COEX</Th>
                </Thead>
                    {
                        props.node.categories.map((s, index) => {return(<Td className="categoryTd">{s[0]}</Td>);})
                    }
                <Tr>

                </Tr>
            </Table>
        </div>);
}

export default CourseView;