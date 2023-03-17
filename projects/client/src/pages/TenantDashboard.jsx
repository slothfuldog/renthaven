import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const { Box, Input, Container, Text } = require("@chakra-ui/react")

const TenantDashboardPage = ({isMobile}) =>{
    const [txt, setTxt] = useState('');
 
    const onInputChange = e => {
      const { value } = e.target;
      console.log('Input value: ', value);
      const re = /^[A-Za-z]+$/;
      if (value === "" || re.test(value)) {
        setTxt(value);
      }
    }
    useEffect(() =>{
      document.title = "Renthaven || Tenant Dashboard"
    }, [])
    return (
      <Box w="100%" display={"flex"} flexDirection={"column"}>
        <Box shadow="md"  style={{margin: isMobile ? "-64px 0 0" : "30px 80px 50px 80px"}}>
          <Box m="10px">
          <Text >Put summary here</Text>
          </Box>
        </Box>
      </Box>)
}

export default TenantDashboardPage;