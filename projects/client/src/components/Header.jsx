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
  useColorModeValue,
  Stack,
  Image,
  Heading,
  Container,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Links = ["Home", "Contact"];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"/"}
  >
    {children}
  </Link>
);

function Header(props) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {email} = useSelector(state => {
    return{
      email: state.userReducer.email
    }
  })

  return (
    <Container maxW="container.xl">
      <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              _hover={{
                cursor: "pointer",
              }}
              onClick={() => navigate("/", {replace: true})}
            >
              <Image boxSize="70px" src={logo} />
              <Heading size="md">Renthaven</Heading>
            </HStack>
            <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          {email ? <Flex> <Menu>
              <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                <HStack>
                  <Avatar
                    size={"sm"}
                    src={
                      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                    }
                  />
                  <Heading size="xs">Welcome,</Heading>
                </HStack>
              </MenuButton>
              <MenuList zIndex="dropdown">
                <MenuItem>My Profile</MenuItem>
                <MenuItem>My Orders</MenuItem>
                <MenuDivider />
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu> </Flex> : <>
          <Flex alignItems={"center"} gap={6}>
            {/* ini tampilan kalau belum login */}
            <Button
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"md"}
              fontWeight={500}
              variant={"link"}
              colorScheme="gray"
              onClick= {() => navigate("/signin", {replace: true})}
            >
              Sign In
            </Button>
            <Button display={{ base: "none", md: "inline-flex" }} colorScheme="green" onClick= {() => navigate("/signup", {replace: true})}>
              Register
            </Button>

            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            {/* ini tampilan kalau sudah login */}
          </Flex>
            
            </>}
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
              <Flex justify="space-between" gap={3}>
                <Button minW="50%" variant="outline" colorScheme="green" onClick= {() => navigate("/signin", {replace: true})}>
                  Sign In
                </Button>
                <Button minW="50%" variant="solid" colorScheme="green" onClick= {() => navigate("/signup", {replace: true})}>
                  Register
                </Button>
              </Flex>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </Container>
  );
}

export default Header;
