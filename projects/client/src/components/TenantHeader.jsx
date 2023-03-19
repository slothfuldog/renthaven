import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
  Image,
  Heading,
  Container,
  Divider,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../actions/userAction";
import { useEffect, useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { VscCircleFilled } from "react-icons/vsc";

const Links = ["Home", "Contact"];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: "gray.200",
    }}
    href={"/"}
  >
    {children}
  </Link>
);

function TenantHeader(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [propertyIsOpen, setPropertyIsOpen] = useState(false);
  const [orderIsOpen, setOrderIsOpen] = useState(false);
  const [reportIsOpen, setReportIsOpen] = useState(false);
  const setPropertyOpenHandler = () => {
    propertyIsOpen ? setPropertyIsOpen(false) : setPropertyIsOpen(true);
  };
  const setOrderOpenHandler = () => {
    orderIsOpen ? setOrderIsOpen(false) : setOrderIsOpen(true);
  };
  const setReportOpenHandler = () => {
    reportIsOpen ? setReportIsOpen(false) : setReportIsOpen(true);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { email, name, role } = useSelector((state) => {
    return {
      email: state.userReducer.email,
      name: state.userReducer.name,
      role: state.userReducer.role,
    };
  });
  const logoutHandler = () => {
    dispatch(logoutAction());
    localStorage.removeItem("renthaven1");
    window.location.reload();
    navigate("/signin", { replace: true });
  };
  useEffect(() => {}, [email]);
  return (
    //CLONE CODE DANIEL
    <Box
      w="100%"
      shadow="sm"
      backgroundColor="white"
      zIndex={1}
      position={props.isMobile ? "unset" : "fixed"}
    >
      <Container maxW={role === "tenant" ? "100%" : "container.lg"}>
        <Box px={4}>
          <Flex h={16} alignItems={"center"} justifyContent="space-between">
            <HStack spacing={8} alignItems={"center"}>
              <HStack
                _hover={{
                  cursor: "pointer",
                }}
                onClick={() => navigate("/tenant-dashboard", { replace: true })}
              >
                <Image boxSize="70px" src={logo} />
                <Heading size="md">Renthaven</Heading>
              </HStack>
              {/* <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
              </HStack> */}
            </HStack>
            {/* ini tampilan kalau sudah login */}
            {props.loading === true ? (
              <Spinner />
            ) : email ? (
              <Flex>
                {" "}
                <Menu>
                  <MenuButton
                    as={Button}
                    display={{ base: "none", md: "inline-flex" }}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <HStack>
                      <Avatar
                        size={"sm"}
                        src={
                          "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                        }
                      />
                      <Heading size="xs" textTransform="capitalize">
                        {name.split(" ")[0]}
                      </Heading>
                    </HStack>
                  </MenuButton>
                  <MenuList zIndex="dropdown">
                    <MenuItem onClick={() => navigate("/profile", { replace: true })}>
                      My Profile
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                  </MenuList>
                </Menu>{" "}
                <IconButton
                  size={"md"}
                  icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                  aria-label={"Open Menu"}
                  display={{ md: "none" }}
                  onClick={isOpen ? onClose : onOpen}
                />
              </Flex>
            ) : (
              <>
                <Flex alignItems={"center"} gap={6}>
                  {/* ini tampilan kalau belum login */}
                  <Button
                    display={{ base: "none", md: "inline-flex" }}
                    fontSize={"md"}
                    fontWeight={500}
                    variant={"link"}
                    colorScheme="gray"
                    onClick={() => navigate("/signin", { replace: true })}
                  >
                    Sign In
                  </Button>
                  <Button
                    display={{ base: "none", md: "inline-flex" }}
                    colorScheme="green"
                    onClick={() => navigate("/signup", { replace: true })}
                  >
                    Register
                  </Button>

                  <IconButton
                    size={"md"}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={"Open Menu"}
                    display={{ md: "none" }}
                    onClick={isOpen ? onClose : onOpen}
                  />
                </Flex>
              </>
            )}
          </Flex>

          {isOpen && !email ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
                <Flex justify="space-between" gap={3}>
                  <Button
                    minW="50%"
                    variant="outline"
                    colorScheme="green"
                    onClick={() => navigate("/signin", { replace: true })}
                  >
                    Sign In
                  </Button>
                  <Button
                    minW="50%"
                    variant="solid"
                    colorScheme="green"
                    onClick={() => navigate("/signup", { replace: true })}
                  >
                    Register
                  </Button>
                </Flex>
              </Stack>
            </Box>
          ) : null}
          {isOpen && email ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                <HStack
                  spacing={7}
                  _hover={{ cursor: "pointer" }}
                  onClick={() => navigate("/profile", { replace: true })}
                >
                  <Avatar
                    size={"lg"}
                    src={
                      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                    }
                  />
                  <Heading size="md" textTransform="capitalize">
                    {name.split(" ")[0]}
                  </Heading>
                </HStack>
                <Button
                  fontSize={"17px"}
                  variant="ghost"
                  color={"gray"}
                  colorScheme="green"
                  w="100%"
                  leftIcon={<MdOutlineDashboard />}
                  mt={3}
                  onClick={() => navigate("/tenant-dashboard", { replace: true })}
                >
                  Dashboard
                </Button>
                <Box display={"flex"} justifyContent={"center"} className="menu-list" rounded="md" w="100%" onClick={setPropertyOpenHandler}>
                  <Text ml={"50px"} fontWeight="600" fontSize={"17px"}>
                    Property{" "}
                    {propertyIsOpen ? (
                      <ChevronDownIcon w="20px" h="20px" ml={3} />
                    ) : (
                      <ChevronRightIcon w="20px" h="20px" ml={3} />
                    )}{" "}
                  </Text>
                </Box>
                {propertyIsOpen ? (
                  <div style={{display: "flex", justifyContent:"center", alignItems:"center"}}>
                    <Box rounded="md" h={5} pl={2} pr={2} ml={"40px"} className="menu-list">
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        <VscCircleFilled style={{ marginRight: "10px" }} />
                        Manage Properties
                      </Text>
                    </Box>
                    <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"40px"} className="menu-list">
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        <VscCircleFilled style={{ marginRight: "10px" }} />
                        Manage Rooms
                      </Text>
                    </Box>
                    <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"40px"} className="menu-list">
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        <VscCircleFilled fontSize="13px" style={{ marginRight: "10px" }} />
                        Manage Categories
                      </Text>
                    </Box>
                  </div>
                ) : (
                  ""
                )}
                <Box
                  className="menu-list"
                  mt={1}
                  rounded="md"
                  w="100%"
                  onClick={setOrderOpenHandler}
                  justifyContent={"center"}
                  display={"flex"}
                >
                  <Text ml={"50px"} fontWeight="600" fontSize={"17px"}>
                    Order List{" "}
                    {orderIsOpen ? (
                      <ChevronDownIcon w="20px" h="20px" ml={1} />
                    ) : (
                      <ChevronRightIcon w="20px" h="20px" ml={1} />
                    )}{" "}
                  </Text>
                </Box>
                {orderIsOpen ? (
                  <div style={{display: "flex", justifyContent:"center", alignItems:"center"}}>
                    <Box rounded="md" h={5} pl={2} pr={2} ml={"30px"} className="menu-list">
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        <VscCircleFilled style={{ marginRight: "10px" }} />
                        Booked Request
                      </Text>
                    </Box>
                    <Box
                      rounded="md"
                      h="38px"
                      pl={2}
                      pr={"16px"}
                      mt={1}
                      ml={"30px"}
                      className="menu-list"
                    >
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        <VscCircleFilled style={{ marginRight: "10px" }} />
                        Manage Booked
                      </Text>
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                        ml="23px"
                      >
                        Room
                      </Text>
                    </Box>
                    <Box rounded="md" h={5} pl={2} pr={2} mt={1} ml={"30px"} className="menu-list">
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        <VscCircleFilled fontSize="13px" style={{ marginRight: "10px" }} />
                        History & Status
                      </Text>
                    </Box>
                  </div>
                ) : (
                  ""
                )}
                <Box
                  display={"flex"}
                  className="menu-list"
                  mt={1}
                  rounded="md"
                  w="100%"
                  onClick={setReportOpenHandler}
                  justifyContent={"center"}
                >
                  <Text ml={"50px"} fontWeight="600" fontSize={"17px"}>
                    Report{" "}
                    {reportIsOpen ? (
                      <ChevronDownIcon w="20px" h="20px" ml={6} />
                    ) : (
                      <ChevronRightIcon w="20px" h="20px" ml={6} />
                    )}{" "}
                  </Text>
                </Box>
                {reportIsOpen ? (
                  <div style={{display: "flex", justifyContent:"center", alignItems:"center"}}>
                    <Box
                      rounded="md"
                      h={5}
                      pl={2}
                      pr={"40px"}
                      mt={1}
                      ml={"35px"}
                      className="menu-list"
                    >
                      <Text
                        fontSize={"13px"}
                        fontWeight={"600"}
                        color="gray"
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                      >
                        <VscCircleFilled fontSize="13px" style={{ marginRight: "10px" }} />
                        View Reports
                      </Text>
                    </Box>
                  </div>
                ) : (
                  ""
                )}
                <Flex justify="space-between" gap={3}>
                  <Button minW="100%" variant="outline" colorScheme="green" onClick={logoutHandler}>
                    Logout
                  </Button>
                </Flex>
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Container>
      <Divider />
    </Box>
  );
}

export default TenantHeader;
