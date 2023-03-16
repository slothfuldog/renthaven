import React from "react";
import LandingSearchForm from "../components/LandingSearchForm";
import LandingContent from "../components/LandingContent";
import { Box, Image, Flex, Divider } from "@chakra-ui/react";
import Testimonials from "../components/Testimonials";
import MainContent from "../components/MainContent";
import LandingBanner from "../components/LandingBanner";

function Landing(props) {
  return (
    <Box>
      {/* banner */}
      <Flex py={{ base: 0, lg: 3 }} direction="row" justify="center" bg="green.700">
        <LandingBanner />
      </Flex>
      <LandingSearchForm />
      <Box mb="70">
        <MainContent />
      </Box>
      <Divider />
      <LandingContent />
    </Box>
  );
}

export default Landing;
