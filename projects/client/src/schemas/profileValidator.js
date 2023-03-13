import * as yup from "yup";

const passwordRules = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
//password must contains 8 chars, one uppercase, one lowercase, one number and one special characters

export const profileSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  oldPass: yup.string().required("Required"),
  password: yup
    .string()
    .min(8)
    .matches(passwordRules, {
      message: "Password must contain 1 upper, 1 lower, 1 number and 1 special char",
    })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password Confirmation does not match")
    .required("Required"),
});
