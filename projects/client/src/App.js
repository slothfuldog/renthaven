import axios from "axios";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import SignupPanelPage from "./pages/SignupPanel";
import SigninPanelPage from "./components/SigninPanel";

function App() {
  // const [message, setMessage] = useState("");

  useEffect(() => {
    // (async () => {
    //   const { data } = await axios.get(
    //     `${process.env.REACT_APP_API_BASE_UR}/greetings`
    //   );
    //   setMessage(data?.message || "");
    // })();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignupPanelPage />} />
        <Route path="/signin" element={<SigninPanelPage />} />
        <Route path="/*" />
      </Routes>
    </div>
  );
}

export default App;
