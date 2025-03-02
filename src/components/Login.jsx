import React, { useState } from "react";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      //Calling Login API 
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok){
        alert("Invalid credentials");
      }else{
        //Direct to upload if login is true
        window.location.href = "http://localhost:3000/upload"
      }

    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleSignUp = () =>{
     window.location.href = "http://localhost:3000/signup"
  }

  return (
    <div className={"login-container"}>
      <h5 className={"signup-corner"} onClick={()=>handleSignUp()}>Signup</h5>  
      <h2 className={"login-title"}>Login</h2>
      <form onSubmit={handleLogin} className={"login-form"}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={"input-field"}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={"input-field"}
            required
          />
        </div>
        <button type="submit" className={"login-button"}>Submit</button>
      </form>
    </div>
  );
}
