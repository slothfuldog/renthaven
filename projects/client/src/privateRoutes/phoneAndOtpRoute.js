import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const VerifyChecker = (props) => {
    const {isVerified} = useSelector(state => {
        return { 
            isVerified: state.userReducer.isVerified
        }
    })
    const getLocalStorage = localStorage.getItem("renthaven1")
    if(getLocalStorage){
        if(isVerified == false){
            return(<Navigate to = "/verify" />)
        }
            return props.children
        }
    else if(!getLocalStorage){
        return props.children
    }
}

export default VerifyChecker;