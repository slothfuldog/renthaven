export const loginAction = (data) =>{
    return({
        type: "LOGIN_SUCCESS",
        payload: data
    })
}
export const logoutAction = () =>{
    return({
        type: "LOGOUT_SUCCESS"
    })
}