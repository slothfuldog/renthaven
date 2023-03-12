import { Box, Button, Flex, FormControl, Input } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as yup from "yup";
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const VerifyPage = (props) => {
  const navigate = useNavigate();
  //  testing
  const validationHandler = async () => {
    //validation func here
    try {
      let getLocalStorage = localStorage.getItem("renthaven1");

      if (getLocalStorage) {
        let res = await Axios.post(
          process.env.REACT_APP_API_BASE_URL + "/verify",
          {
            otp: values.otp,
            phone: values.phone,
          },
          { headers: { Authorization: `Bearer ${getLocalStorage}` } }
        );

        if (res.data.success) {
          Swal.fire({
            title: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Confirm",
            confirmButtonColor: "#48BB78",
          }).then((result) =>
            setTimeout(() => {
              navigate("/", { replace: true });
              window.location.reload();
            }, 500)
          );
        }
      }
    } catch (error) {
      Swal.fire({
        title: `${error.response.data.message}`,
        icon: "error",
        confirmButtonText: "Confirm",
        confirmButtonColor: "#48BB78",
      });
      console.log(error);
    }
  };

  const { provider } = useSelector((state) => {
    return {
      provider: state.userReducer.provider,
    };
  });

  const phoneRule = yup.object().shape({
    phone:
      provider === "common"
        ? yup.string()
        : yup
            .string()
            .matches(/^[\d +]+$/, {
              message: "Please input the valid phone number",
            })
            .required("Please input your phone number"),
    otp:
      provider === "google.com"
        ? yup.string()
        : yup.string().required("Please input your OTP"),
  });

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
      phone: "",
      otp: "",
    },
    validationSchema: phoneRule,
    onSubmit: validationHandler,
  });
  return (
    <Box>
      <Flex justifyContent="center" alignItems="center">
        <Box>
          verify
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              {provider !== "common" && provider !== "google.com" ? (
                <div id="fb">
                  <p>Phone:</p>
                  <Input
                    isInvalid={errors.phone && touched.phone ? true : false}
                    id="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.phone && touched.phone ? (
                    <p style={{ color: "red", marginBottom: "5px" }}>
                      {errors.phone}
                    </p>
                  ) : (
                    ""
                  )}

                  <p>OTP:</p>
                  <Input
                    isInvalid={errors.otp && touched.otp ? true : false}
                    id="otp"
                    value={values.otp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              ) : provider === "google.com" ? (
                <div id="google.com">
                  <p>Phone:</p>
                  <Input
                    isInvalid={errors.phone && touched.phone ? true : false}
                    id="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.phone && touched.phone ? (
                    <p style={{ color: "red", marginBottom: "5px" }}>
                      {errors.phone}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div id="common">
                  <p>OTP:</p>
                  <Input
                    isInvalid={errors.otp && touched.otp ? true : false}
                    id="otp"
                    value={values.otp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              )}

              {/* <p>Phone:</p>
              <Input
                isInvalid={errors.phone && touched.phone ? true : false}
                id="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.phone && touched.phone ? (
                <p style={{ color: "red", marginBottom: "5px" }}>
                  {errors.phone}
                </p>
              ) : (
                ""
              )}

              <p>OTP:</p>
              <Input
                isInvalid={errors.otp && touched.otp ? true : false}
                id="otp"
                value={values.otp}
                onChange={handleChange}
                onBlur={handleBlur}
              /> */}
            </FormControl>
            <Button type="submit" onSubmit={handleSubmit}>
              Click
            </Button>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default VerifyPage;
