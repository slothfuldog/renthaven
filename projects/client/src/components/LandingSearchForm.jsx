import { Box, Button, Container, FormLabel, Heading, Stack, VStack } from "@chakra-ui/react";
import { FormControl, Select } from "@chakra-ui/react";
import React, { useEffect } from "react";
import CalendarDateRange from "./CalendarDateRange";
import { SearchIcon } from "@chakra-ui/icons";
import Axios from "axios";

function LandingSearchForm(props) {
  const [city, setCity] = React.useState([]);

  const getCityData = async () => {
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + "/category");
      setCity(response.data);
    } catch (error) {
      console.log(error);
      setCity([]);
    }
  };
  useEffect(() => {
    getCityData();
  }, []);

  return (
    <Container maxW="container.lg">
      <Box my={4} shadow="md" p="5" rounded="md">
        <Heading mb={5} size="lg">
          Search for a place to stay
        </Heading>
        <VStack alignItems="start" spacing={7}>
          <Box minW="100%">
            <FormControl>
              <FormLabel>City</FormLabel>
              <Select placeholder="Select city">
                {city.map((val, idx) => {
                  return <option key={idx}>{`${val.province}, ${val.city}`}</option>;
                })}
              </Select>
            </FormControl>
          </Box>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={5}
            alignItems={{ base: "start", md: "end" }}
          >
            <Box minW="100%">
              <FormLabel>Date</FormLabel>
              <CalendarDateRange />
            </Box>
            <Box>
              <Button leftIcon={<SearchIcon />} minW="50%" colorScheme="green">
                Search
              </Button>
            </Box>
          </Stack>
        </VStack>
      </Box>
    </Container>
  );
}

export default LandingSearchForm;
