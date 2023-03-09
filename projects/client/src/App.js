import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";

function App() {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   (async () => {
  //     const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/greetings`);
  //     setMessage(data?.message || "");
  //   })();
  // }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default App;
