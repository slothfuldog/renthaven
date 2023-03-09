import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

const SigninPanelPage = (props) => {
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
        Sign In
      </p>
      <Tabs variant="enclosed" isFitted>
        <TabList>
          <Tab fontWeight="semibold" _selected={{ color: "green" }}>
            Signin as user
          </Tab>
          <Tab fontWeight="semibold" _selected={{ color: "green" }}>
            Signin as tenant
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            asdasdasd
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SigninPanelPage;
