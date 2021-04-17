import './CourseView.css';

import {
  Divider,
  Button,
  Tag
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

    return (
        <div style={{width: props.width, height: props.height}} className="courseView" >
            <h1 className="courseTitle">{props.node.id + ": " + props.node.name}</h1>
            <Divider orientation="horizontal" />
            <p className="courseDesc">{props.node.desc}</p>

            <div style={{textAlign: 'center'}}>
              {
                getCategories().map((x, i) => {
                  return <Tag key={i} style={{margin: '10px'}} size='lg' borderRadius="full"
                    variant="solid"
                    >{x}</Tag>})
              }
            </div>

            <br/>
            {props.annotation &&
              <Button colorScheme="green" style={{display: 'block', margin: 'auto', }}
              onClick={(e) => props.add(props.node.id)}>Add annotation</Button>
            }
            {props.rann &&
              <Button colorScheme="red" style={{display: 'block', margin: 'auto', }}
              onClick={(e) => props.remove(props.node.id)}>Remove annotation</Button>
            }
        </div>);
}

export default CourseView;