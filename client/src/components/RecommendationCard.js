import { Box, Button, Select } from "@chakra-ui/react"

export default function RecommendationCard(props) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p="5" style={styles.boxContainer}>
      <h1>Recommendation: { props.title } </h1>
      { props.description }
      <br />
      <Button variant="link" colorScheme="cyan"> Critical Review Link </Button>
    </Box>
  );
}

const styles = {
  boxContainer: {
    textAlign: "left", 
    lineHeight: "2em", 
    width: "28vw", 
    marginBottom: "1rem"
  }
}

