import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const VerifyChecker = (props) => {
  const { isVerified, phone } = useSelector((state) => {
    return {
      isVerified: state.userReducer.isVerified,
      phone: state.userReducer.phone,
    };
  });
  const getLocalStorage = localStorage.getItem("renthaven1");
  if (props.loading == false) {
    if (getLocalStorage) {
      if (isVerified == false || isVerified == 0 || phone === "-") {
        return <Navigate to="/verify" />;
      }
      return props.children;
    } else if (!getLocalStorage) {
      return props.children;
    }
  }
};

export default VerifyChecker;
