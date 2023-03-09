import axios from "axios";
import {Routes, Route} from "react-router-dom"; 
import "./App.css";
import { useEffect, useState } from "react";
import SignupPanelPage from "./pages/SignupPanel";
import SigninPanelPage from "./pages/SigninPanel";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios"
import { loginAction } from "./actions/userAction";
import { Spinner } from "@chakra-ui/react";

function App() {
  const [message, setMessage] = useState("");
  const {email, login} = useSelector( state => {
    return{
    email: state.userReducer.email,
    login: state.userReducer.login
  }})
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const keepLogin = async () =>{
    try {
      let getLocalStorage = localStorage.getItem('renthaven1')
      if(getLocalStorage){
        let res = await Axios.post(process.env.REACT_APP_API_BASE_URL + `/signin/keep-login`,{
          login
        }, {
          headers:{
            "Authorization" : `Bearer ${getLocalStorage}`
          }
        })
        console.log(res.data.result)
        dispatch(loginAction(res.data.result))
        localStorage.setItem("renthaven1", res.data.token)
        setLoading(false)
      }
    else{
      setLoading(false)
    }} 
    catch (error) {
        setLoading(false)
        console.log(error)
        localStorage.removeItem("renthaven1")
      }
    }

  useEffect(() => {
    keepLogin()
  }, []);
  return (
    <div className="App">
      {loading == true ? <Spinner /> : email != "" ? "Welcome": "Notloggedin"}
      <Routes>
        <Route path='/'  />
        <Route path='/signup' element={<SignupPanelPage />} />
        <Route path='/signin' element={<SigninPanelPage />} />
        <Route path='/verify' />
        <Route path='/*'/>
      </Routes>
    </div>
  );
}

export default App;
