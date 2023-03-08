import * as yup from "yup"

export const loginSchema = yup.object().shape({
    email: yup.string().email("Please input the correct email").required("Please input your email here"),
    password: yup.string().required("Please input your password here")
})