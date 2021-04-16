import { Box, Button, Text } from "@chakra-ui/react"

export default function RecommendationCard(props) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p="5" style={styles.boxContainer}>
      <b> { props.title } </b>
      <Text noOfLines={3}>
        { props.description }
      </Text>

      <a target="_blank" rel="noreferrer" href={props.link}>
        <Button variant="link" colorScheme="cyan"> Critical Review Link </Button>
      </a>
    </Box>
  );
}

const styles = {
  boxContainer: {
    textAlign: "left", 
    lineHeight: "2em", 
    marginBottom: "1rem"
  }
}

