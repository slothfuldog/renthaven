import { ChevronDownIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { Button, IconButton, Text, Container, Box, Flex, CloseButton, Avatar, Divider } from "@chakra-ui/react";
import {MdOutlineDashboard} from "react-icons/md"
import { useEffect, useState } from "react";
import {VscCircleFilled} from "react-icons/vsc"
import { IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Sidebar = ({propW, setAppWidth}) => {
  const {name} = useSelector(state => {
    return{
      name: state.userReducer.name
    }
  })
  const navigate = useNavigate()
  const [propertyIsOpen, setPropertyIsOpen] = useState(false)
  const [orderIsOpen, setOrderIsOpen] = useState(false)
  const [reportIsOpen, setReportIsOpen] = useState(false)
  const setPropertyOpenHandler = ()=>{
    propertyIsOpen ? setPropertyIsOpen(false) : setPropertyIsOpen(true)
  }
  const setOrderOpenHandler = ()=>{
    orderIsOpen ? setOrderIsOpen(false) : setOrderIsOpen(true)
  }
  const setReportOpenHandler = ()=>{
    reportIsOpen ? setReportIsOpen(false) : setReportIsOpen(true)
  }
  return (
    <Box w= {propW} h="100vh" shadow="md"  position="fixed" mt="62px" top={0} left={0} zIndex={2} overflowX="hidden" overFlowY="scroll" transition="ease-in-out width .2s">
        <Container mt={4} display="flex" alignItems="center" flexDirection="column">
          {/* <Button variant="ghost" colorScheme="green" w="100%" leftIcon={<IoCloseOutline />} onClick={setAppWidth}>Close Sidebar</Button> */}
          {/* <Avatar size="lg" mt={4} /> */}
          <Text color="gray" mt={2} fontWeight="600" fontSize={17} textAlign="center">{name.split(" ")[0]}'s <tr/>Dashboard</Text>
          <Divider mt={4} />
          <Button variant="ghost" color={"gray"} colorScheme="green" w="100%" leftIcon={<MdOutlineDashboard />} mt={3} onClick={() => navigate("/tenant-dashboard", {replace: true})}>Dashboard</Button>
          <Button transition="ease-in-out all 0.3" variant="ghost" color={"gray"} colorScheme="green" w="100%" rightIcon={propertyIsOpen ? <ChevronDownIcon w="20px" h="20px" /> : <ChevronRightIcon w="20px" h="20px" />} onClick={setPropertyOpenHandler}>Property</Button>
          {propertyIsOpen ? 
            <div>
            <Box rounded="md" h={5} pl={2} pr={2} ml={"40px"} className="menu-list"><Text fontSize={"13px"} fontWeight={"600"} color="gray" display={"flex"} flexDirection="row" alignItems={"center"}><VscCircleFilled style={{marginRight: "10px"}} />Manage Properties</Text></Box>
            <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"40px"} className="menu-list"><Text fontSize={"13px"} fontWeight={"600"} color="gray" display={"flex"} flexDirection="row" alignItems={"center"}><VscCircleFilled style={{marginRight: "10px"}} />Manage Rooms</Text></Box>
            <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"40px"} className="menu-list"><Text fontSize={"13px"} fontWeight={"600"} color="gray" display={"flex"} flexDirection="row" alignItems={"center"}><VscCircleFilled fontSize="13px" style={{marginRight: "10px"}} />Manage Categories</Text></Box>
            </div>:""}
            <Button transition="ease-in-out all 0.3" variant="ghost" color="gray" colorScheme="green" w="100%" rightIcon={orderIsOpen ? <ChevronDownIcon w="20px" h="20px" /> : <ChevronRightIcon w="20px" h="20px" />} onClick={setOrderOpenHandler}>Order List</Button>
            {orderIsOpen ? 
            <div>
            <Box rounded="md" h={5} pl={2} pr={2} ml={"40px"} className="menu-list"><Text fontSize={"13px"} fontWeight={"600"} color="gray" display={"flex"} flexDirection="row" alignItems={"center"}><VscCircleFilled style={{marginRight: "10px"}} />Manage Properties</Text></Box>
            <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"40px"} className="menu-list"><Text fontSize={"13px"} fontWeight={"600"} color="gray" display={"flex"} flexDirection="row" alignItems={"center"}><VscCircleFilled style={{marginRight: "10px"}} />Manage Rooms</Text></Box>
            <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"40px"} className="menu-list"><Text fontSize={"13px"} fontWeight={"600"} color="gray" display={"flex"} flexDirection="row" alignItems={"center"}><VscCircleFilled fontSize="13px" style={{marginRight: "10px"}} />Manage Categories</Text></Box>
            </div> : ""}
            <Button transition="ease-in-out all 0.3" variant="ghost" color="gray" colorScheme="green" w="100%" rightIcon={reportIsOpen ? <ChevronDownIcon w="20px" h="20px" /> : <ChevronRightIcon w="20px" h="20px" />} onClick={setReportOpenHandler}>Report</Button>
            {reportIsOpen ? 
            <div>
            <Box rounded="md" h={5} pl={2} pr={2} ml={"40px"} className="menu-list"><Text fontSize={"13px"} fontWeight={"600"} color="gray" display={"flex"} flexDirection="row" alignItems={"center"}><VscCircleFilled style={{marginRight: "10px"}} />Manage Properties</Text></Box>
            <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"40px"} className="menu-list"><Text fontSize={"13px"} fontWeight={"600"} color="gray" display={"flex"} flexDirection="row" alignItems={"center"}><VscCircleFilled style={{marginRight: "10px"}} />Manage Rooms</Text></Box>
            <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"40px"} className="menu-list"><Text fontSize={"13px"} fontWeight={"600"} color="gray" display={"flex"} flexDirection="row" alignItems={"center"}><VscCircleFilled fontSize="13px" style={{marginRight: "10px"}} />Manage Categories</Text></Box>
            </div> : ""}
        </Container>
    </Box>
  );
};

export default Sidebar;
