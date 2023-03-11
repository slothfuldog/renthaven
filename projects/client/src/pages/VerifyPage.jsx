import { Box, Flex, FormControl, Input } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as yup from "yup";

const VerifyPage = (props) => {
  const phoneRule = yup.object().shape({
    phone: yup
      .string()
      .matches(/^[\d +]+$/, { message: "Please input the valid phone number" })
      .required("Please input your phone number"),
    otp: yup.string().required()
  });
  const validationHandler = () => {
    //validation func here
  };
  const { provider } = useSelector((state) => {
    return {
      provider: state.userReducer.provider,
    };
  });
  const { values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit } =
    useFormik({
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
              <p>Phone:</p>
              <Input
                isInvalid={errors.phone && touched.phone ? true : false}
                id="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.phone && touched.phone ? (
                <p style={{ color: "red", marginBottom: "5px" }}>{errors.phone}</p>
              ) : (
                ""
              )}
            </FormControl>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default VerifyPage;
