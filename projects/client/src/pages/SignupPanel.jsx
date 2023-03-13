import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import "../styles/login.css";
import SignupUserPage from "../components/SignupUser";
import { useEffect, useState } from "react";

const SignupPanelPage = (props) => {
  const [backgrounds, setBackground] = useState([
    "https://www.ahstatic.com/photos/5451_ho_00_p_1024x768.jpg",
    "https://cdn.loewshotels.com/loewshotels.com-2466770763/cms/cache/v2/5f5a6e0d12749.jpg/1920x1080/fit/80/86e685af18659ee9ecca35c465603812.jpg",
    "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg",
  ]);
  const [currentBackground, setCurrentBackground] = useState("");
  const randomBackground = () => {
    const len = backgrounds.length;
    const randomNum = Math.floor(Math.random() * len);
    setCurrentBackground(backgrounds[randomNum]);
  };
  useEffect(() => {
    randomBackground();
  }, []);
  return (
    <Box
      backgroundImage={`url(${currentBackground})`}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
    >
      <Flex>
        <Box
          className="mobile"
          rounded={{ base: "none", md: "md" }}
          style={{ background: "white" }}
        >
          <p
            style={{
              fontSize: "28px",
              fontWeight: "600",
              textAlign: "center",
              paddingTop: "20px",
              marginBottom: "20px",
            }}
          >
            Sign Up
          </p>
          <Tabs variant="enclosed" isFitted>
            <TabList>
              <Tab fontWeight="semibold" _selected={{ color: "green" }}>
                Signup as user
              </Tab>
              <Tab fontWeight="semibold" _selected={{ color: "green" }}>
                Signup as tenant
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SignupUserPage />
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  );
};

export default SignupPanelPage;
