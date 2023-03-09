import * as yup from "yup";

const passwordRules = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
//password must contains 8 chars, one uppercase, one lowercase, one number and one special characters

export const basicSchema = yup.object().shape({
    name: yup.string().required("Please input your name"),
    email: yup.string().email("Please enter the correct email").required("Required"),
    phone: yup.string().matches(/^[\d +]+$/, {message: "Please input the valid phone number"}).required("Please input your phone number"),
    password: yup.string().min(8).matches(passwordRules,{message: "Password must contains 8 chars, one uppercase, one lowercase, one number and one special characters"}).required("Required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Password must match!")
})