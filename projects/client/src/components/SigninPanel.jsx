import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"

const SigninPanelPage = (props) =>{
    return(
        <Box >
            <p
              style={{
                fontSize: "28px",
                textAlign: "center",
                marginBottom: "25px",
                marginTop: "20px",
                fontWeight: "600",
              }}
            >
              Sign In
            </p>
      <Tabs variant="enclosed" isFitted >
        <TabList >
          <Tab fontWeight="semibold" _selected={{color: "green"}}>Signin as user</Tab>
          <Tab fontWeight="semibold" _selected={{color: "green"}}>Signin as tenant</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            asdasdas
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
    )
}

export default SigninPanelPage;