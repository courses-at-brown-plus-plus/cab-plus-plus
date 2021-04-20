import './CourseView.css';

import {
  Divider, Button, Tag, CloseButton, Table, Thead, Th, Tbody, Tr, Td, Link, Tooltip
} from "@chakra-ui/react"

function CourseView(props) {

    function getCategories() {
      let result = [];
      for (let i = 0; i < props.node.categories.length; i++) {
        if (props.node.categories[i] === 'TRUE') {
          result.push(['FYS', 'SOPH', 'DIAP', 'WRIT', 'CBLR', 'COEX'][i])
        }
      }
      return result;
    }

    function groupPrereqs() {
      let result = new Map();
      props.prereqs.forEach((e) => {
        if (!result.has(e[1])) {
          result.set(e[1], []);
        }
        result.get(e[1]).push(e[0]);
      });
      return result;
    }

    return (
        <div style={{width: props.width, height: props.height}} className="courseView" >
            <CloseButton style={{float: 'right'}} onClick={props.close}/>
            <h1 className="courseTitle">{props.node.id + ": " + props.node.name}</h1>
            <Divider orientation="horizontal" />
            <p className="courseDesc">{props.node.desc}</p>

            {getCategories().length > 0 && 
              <div style={{textAlign: 'center'}}>
              {
                getCategories().map((x, i) => {
                  return <Tag key={i} style={{margin: '10px'}} size='lg' borderRadius="full"
                    variant="solid"
                    >{x}</Tag>})
              }
              </div>
            }

             <a id="link" target="_blank" rel="noreferrer" 
              href={`https://thecriticalreview.org/search/${props.node.id.substring(0, 4)}/${props.node.id.substring(5, props.node.id.length)}`} >
              <Button variant="link" colorScheme="cyan"> Critical Review Link </Button>
            </a>

            {groupPrereqs().size === 0 && 
              <p className="courseDesc">This course has no prerequisites</p>
            }

            { groupPrereqs().size > 0 &&
            <Table style={{marginTop: '10px'}}>
            <Thead>
            <Th>Pre-reqs</Th>
            </Thead>
            <Tbody>
            {
              Array.from(groupPrereqs().values()).map((l) =>
                (
                  <Tr><Td>
                  {l.slice(0, -1).reduce((acc, e) => `${e}, ` + acc, 
                    (l.length <= 1 ? '' : 'or ') + l[l.length - 1])}
                 </Td></Tr>)
              )
            }
            </Tbody>
            </Table>
          }

            <br/>
            {props.annotation &&
            <Tooltip label="Save the courses you plan on taking!" aria-label="A tooltip">
              <Button colorScheme="green" style={{display: 'block', margin: 'auto', }}
                onClick={(e) => props.add(props.node.id)}>Add to wishlist</Button>
            </Tooltip>
            }
            {props.rann &&
              <Button colorScheme="red" style={{display: 'block', margin: 'auto', }}
              onClick={(e) => props.remove(props.node.id)}>Remove from wishlist</Button>
            }
        </div>);
}

export default CourseView;
