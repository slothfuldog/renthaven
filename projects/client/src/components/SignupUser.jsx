import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { CiFacebook } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { auth, provider, providerFacebook } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import Axios from "axios";
import { useFormik } from "formik";
import { basicSchema } from "../schemas/signupValidator";
import Swal from "sweetalert2";

const SignupUserPage = (props) => {
  const [show, setShow] = useState(false);
  const [alerts, setAlert] = useState("");
  const [normalReg, setReg] = useState("common");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [infoIcon, setInfoIcon] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();
  //signup handle section
  const handleSignupGoogle = () => {
    setGoogleLoading(true);
    signInWithPopup(auth, provider)
      .then((data) => {
        Axios.post(process.env.REACT_APP_API_BASE_URL + "/signup/user", {
          email: data._tokenResponse.email,
        }).then((res) => {
          console.log(res.status);
          if (res.data.success == false) {
            setAlert("The email had already been registered");
            setInfoIcon(false);
            setGoogleLoading(false);
          } else {
            setFieldValue("name", data._tokenResponse.displayName);
            setFieldValue("email", data._tokenResponse.email);
            setReg("firebase");
            setAlert(
              "You are almost there, please complete the form to finish the registration!"
            );
            setInfoIcon(true);
            setGoogleLoading(false);
          }
        });
      })
      .catch((e) => {
        if (e.message == "Firebase: Error (auth/popup-closed-by-user).") {
          setGoogleLoading(false);
        } else {
          console.log(e);
          setAlert("The email had already been registered");
          setInfoIcon(false);
          setGoogleLoading(false);
        }
      });
  };
  const handleSignupFacebook = () => {
    setFacebookLoading(true);
    signInWithPopup(auth, providerFacebook)
      .then((data) => {
        Axios.post(process.env.REACT_APP_API_BASE_URL + "/signup/user", {
          email: data._tokenResponse.email,
        }).then((res) => {
          if (res.data.success == false) {
            setAlert("The email had already been registered");
            setInfoIcon(false);
            setFacebookLoading(false);
          } else {
            setFieldValue("name", data._tokenResponse.displayName);
            setFieldValue("email", data._tokenResponse.email);
            setReg("firebase");
            setAlert(
              "You are almost there, please complete the form to finish the registration!"
            );
            setInfoIcon(true);
            setFacebookLoading(false);
          }
        });
      })
      .catch((e) => {
        if (e.message == "Firebase: Error (auth/popup-closed-by-user).") {
          console.log("hello");
          setFacebookLoading(false);
        } else {
          console.log(e);
          setAlert("The email had already been registered");
          setInfoIcon(false);
          setFacebookLoading(false);
        }
      });
  };
  const registerHandler = () => {
    setSignupLoading(true);
    if (normalReg == "firebase") {
      Axios.post(process.env.REACT_APP_API_BASE_URL + "/signup/new-user", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        regis: normalReg,
      })
        .then((res) => {
          Swal.fire({
            title: "Registration Success!",
            icon: "success",
            confirmButtonText: "Confirm",
            confirmButtonColor: "#48BB78",
          }).then((res) => {
            navigate("/signin", { replace: true });
          });
          setSignupLoading(false);
        })
        .catch((e) => setSignupLoading(false));
    } else {
      Axios.post(process.env.REACT_APP_API_BASE_URL + "/signup/new-user", {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        regis: normalReg,
      })
        .then((res) => {
          Swal.fire({
            title: "Registration Success!",
            icon: "success",
            confirmButtonText: "Confirm",
            confirmButtonColor: "#48BB78",
          }).then((res) => {
            navigate("/signin", { replace: true });
          });
          setSignupLoading(false);
        })
        .catch((e) => setSignupLoading(false));
    }
  };
  //Formik configuration
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    validationSchema: basicSchema,
    onSubmit: registerHandler,
  });

  useEffect(() => {
    document.title = "Signup RentHaven";
  }, []);
  return (
    <div>
      <Box>
        <Box
          rounded="md"
          style={{
            height: "100%",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              textAlign: "left",
              margin: "0px 30px 0",
              paddingTop: "25px",
            }}
          >
            {/* <p
              className="fw-bold"
              style={{
                fontSize: "28px",
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              Sign Up
            </p> */}
            {alerts == "" ? (
              ""
            ) : (
              <Alert
                status={infoIcon == false ? "error" : "info"}
                style={{ marginBottom: "5px" }}
              >
                <AlertIcon />
                {alerts}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <p>
                Name <span style={{ color: "red" }}>*</span>
              </p>
              <FormControl isRequired>
                <Input
                  focusBorderColor="green.400"
                  isInvalid={errors.name && touched.name ? true : false}
                  id="name"
                  style={{ marginTop: "5px" }}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              {errors.name && touched.name ? (
                <p style={{ color: "red", marginBottom: "5px" }}>
                  {errors.name}
                </p>
              ) : (
                ""
              )}
              <p>
                Email <span style={{ color: "red" }}>*</span>
              </p>
              <FormControl isRequired>
                <Input
                  focusBorderColor="green.400"
                  isInvalid={errors.email && touched.email ? true : false}
                  id="email"
                  style={{ marginTop: "5px" }}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              {errors.email && touched.email ? (
                <p style={{ color: "red", marginBottom: "5px" }}>
                  {errors.email}
                </p>
              ) : (
                ""
              )}
              <p>
                Phone <span style={{ color: "red" }}>*</span>
              </p>
              <FormControl isRequired>
                <Input
                  focusBorderColor="green.400"
                  isInvalid={errors.phone && touched.phone ? true : false}
                  id="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              {errors.phone && touched.phone ? (
                <p style={{ color: "red", marginBottom: "5px" }}>
                  {errors.phone}
                </p>
              ) : (
                ""
              )}
              {normalReg === "common" ? (
                <div>
                  <p style={{ marginTop: "10px" }}>
                    Password <span style={{ color: "red" }}>*</span>
                  </p>
                  <FormControl isRequired>
                    <InputGroup size="md" style={{ marginTop: "5px" }}>
                      <Input
                        focusBorderColor="green.400"
                        isInvalid={
                          errors.password && touched.password ? true : false
                        }
                        id="password"
                        type={show ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <InputRightElement width="3.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  {errors.password && touched.password ? (
                    <p style={{ color: "red", marginBottom: "5px" }}>
                      {errors.password}
                    </p>
                  ) : (
                    ""
                  )}
                  <p style={{ marginTop: "10px" }}>
                    Confirm password <span style={{ color: "red" }}>*</span>
                  </p>
                  <FormControl isRequired>
                    <InputGroup size="md" style={{ marginTop: "5px" }}>
                      <Input
                        focusBorderColor="green.400"
                        isInvalid={
                          errors.confirmPassword && touched.confirmPassword
                            ? true
                            : false
                        }
                        id="confirmPassword"
                        type={show ? "text" : "password"}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <InputRightElement width="3.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <p style={{ color: "red", marginBottom: "5px" }}>
                      {errors.confirmPassword}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              <Button
                isLoading={signupLoading}
                variant="solid"
                colorScheme="green"
                style={{
                  width: "100%",
                  marginTop: "15px",
                  marginBottom: "10px",
                }}
                type="submit"
                onClick={registerHandler}
              >
                Sign up
              </Button>
            </form>
            {normalReg === "common" ? (
              <div>
                <p
                  style={{
                    width: "100%",
                    textAlign: "center",
                    borderBottom: "1px solid #000",
                    lineHeight: "0.1em",
                    margin: "10px 0 20px",
                  }}
                >
                  <span style={{ background: "#fff", padding: "0 10px" }}>
                    OR
                  </span>
                </p>
                <Button
                  isLoading={googleLoading}
                  leftIcon={<FcGoogle />}
                  style={{
                    width: "100%",
                    marginTop: "5px",
                    marginBottom: "10px",
                  }}
                  onClick={handleSignupGoogle}
                >
                  Sign up with Google
                </Button>
                <Button
                  isLoading={facebookLoading}
                  colorScheme="facebook"
                  leftIcon={<CiFacebook size="21" />}
                  style={{
                    width: "100%",
                    marginTop: "5px",
                    marginBottom: "10px",
                  }}
                  onClick={handleSignupFacebook}
                >
                  Sign up with Facebook
                </Button>
              </div>
            ) : (
              ""
            )}

            <div
              style={{
                fontSize: "14px",
                marginTop: "10px",
                paddingBottom: "30px",
              }}
            >
              <p style={{ marginTop: "10px" }}>
                Already have an account?{" "}
                <Link to="/signin" style={{ fontWeight: "600" }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default SignupUserPage;
