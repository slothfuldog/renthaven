import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import "../assets/css/login.css"
import SignupUserPage from "../components/SignupUser";

const SignupPanelPage = (props) => {
  return (
    <Box boxShadow="dark-lg" className="mobile" rounded="md">
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
  );
};

export default SignupPanelPage;
