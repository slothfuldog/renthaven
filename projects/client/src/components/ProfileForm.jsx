import React from "react";
import Axios from "axios";
import { Flex, Heading, Text, Divider, Input, Button, FormControl } from "@chakra-ui/react";
import { InputRightElement, InputGroup, FormErrorMessage } from "@chakra-ui/react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useFormik } from "formik";
import { profileSchema } from "../schemas/profileValidator";
import Swal from "sweetalert2";

function ProfileForm(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: "daniel",
    dob: "",
    gender: "",
    email: "ds@gmail.com",
    provider: "common",
  });

  const onBtnUpdatePass = async () => {
    const { oldPass, password, confirmPassword } = values;
    if (oldPass !== "" || password !== "" || confirmPassword !== "") {
      if (userData.provider !== "common") {
        Swal.fire({
          icon: "info",
          text: `Sorry you cant update your password if you login with a ${userData.provider} account`,
        });
      } else if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          text: `Password and Password Confirmation didn't match`,
        });
      } else {
        setIsLoading(true);
        try {
          let response = await Axios.patch(
            process.env.REACT_APP_API_BASE_URL + "/user/change-password",
            { oldPass, password, email: userData.email, provider: userData.email }
          );
          Swal.fire({
            icon: "success",
            text: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          setFieldValue("oldPass", "", false);
          setFieldValue("password", "", false);
          setFieldValue("confirmPassword", "", false);
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            text: error.response.data.message,
          });
        }
      }
    }
    setIsLoading(false);
  };

  //Formik configuration
  const { values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        gender: "",
        dateOfBirth: "",
        oldPass: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: profileSchema,
      onSubmit: onBtnUpdatePass,
    });

  const [showOldPass, setShowOldPass] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClick = (value) => {
    if (value === 1) {
      setShowOldPass(!showOldPass);
    } else if (value === 2) {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Flex gap={3} pt={6} direction="column" mb={3} minW="50%">
      <Heading size="md">Profile</Heading>
      <Flex direction="column" gap={8}>
        <Flex direction="row" gap={4}>
          <Text minW="35%">Name</Text>
          <Text textTransform="capitalize">{userData.name}</Text>
          <Button size="sm" colorScheme="green" variant="link">
            Edit
          </Button>
        </Flex>
        <Flex direction="row" gap={4}>
          <Text minW="35%">Date of Birth</Text>
          <Text>{userData.dob === "" ? `Not Set Yet` : userData.dob}</Text>
          <Button size="sm" colorScheme="green" variant="link">
            Edit
          </Button>
        </Flex>
        <Flex direction="row" gap={4}>
          <Text minW="35%">Gender</Text>
          <Text>{userData.gender === "" ? `Not Set Yet` : userData.gender}</Text>
          <Button size="sm" colorScheme="green" variant="link">
            Edit
          </Button>
        </Flex>
        <Flex direction="row" gap={4}>
          <Text minW="35%">Email</Text>
          <Text>{userData.email}</Text>
          <Button size="sm" colorScheme="green" variant="link">
            Edit
          </Button>
        </Flex>
      </Flex>
      <Divider />

      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap={4}>
          <Heading size="md">Password</Heading>
          <Flex direction="row" align="center">
            {/* OLD PASSWORD */}
            <Text minW="40%">Current Password</Text>
            <FormControl isInvalid={errors.oldPass && touched.oldPass ? true : false}>
              <InputGroup>
                <Input
                  type={showOldPass ? "text" : "password"}
                  id="oldPass"
                  value={values.oldPass}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InputRightElement width="3.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => handleClick(1)}>
                    {showOldPass ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize="xs" m="auto">
                {errors.oldPass}
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction="row" align="center">
            {/* NEW PASSWORD */}
            <Text minW="40%">New Password</Text>
            <FormControl isInvalid={errors.password && touched.password ? true : false}>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InputRightElement width="3.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => handleClick(2)}>
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize="xs" m="auto">
                {errors.password}
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction="row" align="center">
            {/* CONFIRM PASSWORD */}
            <Text minW="40%">Confirm New Password</Text>
            <FormControl
              isInvalid={errors.confirmPassword && touched.confirmPassword ? true : false}
            >
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InputRightElement width="3.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => handleClick(3)}>
                    {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize="xs" m="auto">
                {errors.confirmPassword}
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex justify="end">
            <Button
              isLoading={isLoading}
              onClick={onBtnUpdatePass}
              type="submit"
              colorScheme="green"
              variant="outline"
            >
              Update Password
            </Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}

export default ProfileForm;
