import { useState } from 'react';
import Axios from 'axios';
import {Link} from "react-router-dom";
import './Login.css'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{4,24}$/;

function Login() {
  const [usernameReg, setUsernameReg] = useState("")
  const [passwordReg, setPasswordReg] = useState("")
  const [errMsgReg, setErrMsgReg] = useState("");

  const [usernameLog, setUsernameLog] = useState("")
  const [passwordLog, setPasswordLog] = useState("")
  const [errMsgLog, setErrMsgLog] = useState("");


  const register = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(usernameReg);
    const v2 = PWD_REGEX.test(passwordReg);
    if (!v1 || !v2) {
      if (errMsgReg !== "Invalid username or password") {
        setErrMsgReg("Invalid username or password")
      }
      return;
    }
    if (errMsgReg !== "") {
      setErrMsgReg("")
    }
    try {
      await Axios.post("http://localhost:8080/login/postUser", null, {
        params: {
          name: usernameReg,
          password: passwordReg,
        }
      })
      setErrMsgReg("Registered")
    }
    catch (err) {
      if (!err?.response) {
        setErrMsgReg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsgReg("User already exists");
      } else {
        setErrMsgReg("Registration failed")
      }
    }
  }

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:8080/login", null, {
        params: {
          name: usernameLog,
          password: passwordLog,
        }
      })
      setErrMsgLog("")
      localStorage.setItem('name', JSON.stringify(response.data.name));
      localStorage.setItem('highscore', JSON.stringify(response.data.highscore));
      console.log(localStorage.getItem('name'))
      console.log(localStorage.getItem('highscore'))
      window.location.reload(false);
    }
    catch (err) {
      if (!err?.response) {
        setErrMsgLog("No Server Response");
      } else if (err.response?.status === 401) {
        setErrMsgLog("Wrong password");
      } else {
        setErrMsgLog("User not found")
      }
    };
  }

  return (
    <div className="App">
      <div className="login">
        <ul id='login'>
          <li><h1>Login</h1></li>
          <li><label>Username</label></li>
          <li><input type="text" onChange={(e) => {
            setUsernameLog(e.target.value)
          }} /></li>
          <li><label>Password</label></li>
          <li><input type="password" onChange={(e) => {
            setPasswordLog(e.target.value)
          }} /></li>
          <li><Link to="/homepage"><button onClick={login}>Login</button></Link></li>
          <li><p>{errMsgLog}</p></li>
        </ul>
      </div>
      <div className="registration">
        <ul id='registration'>
          <li><h1>Register</h1></li>
          <li><label>Username</label></li>
          <li><input type="text" onChange={(e) => {
            setUsernameReg(e.target.value)
          }} /></li>
          <li><label>Password</label></li>
          <li><input type="password" onChange={(e) => {
            setPasswordReg(e.target.value)
          }} /></li>
          <li><button onClick={register}>Register</button></li>
          <li><p>{errMsgReg}</p></li>
        </ul>
      </div>
    </div>
  );
}

export default Login;