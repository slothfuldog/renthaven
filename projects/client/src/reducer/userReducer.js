const INITIAL_STATE = {
    email: "",
    name: "",
    phone: "",
    gender: "",
    profileImg: "",
    dob: "",
    role: "",
    isDelete: 0,
    isVerified: 0,
    isActive: 0,
    provider: "common"
}

export const userReducer = (state = INITIAL_STATE, action ) =>{
    switch (action.type) {
        case `LOGIN_SUCCESS`:
            return {...state, ...action.payload};
        case `LOGOUT_SUCCESS`:
            return state;
        default:
            return state;
    }
}
