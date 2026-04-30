import React, { useState } from "react";
import "./AuthPage.css";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

function AuthPage() {

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      if (isLogin) {

        const res = await axios.post(
          "http://localhost:8000/login",
          { email, password }
        );

        localStorage.setItem("token", res.data.token);

      } else {

        await axios.post(
          "http://localhost:8000/signup",
          { name, email, password }
        );

        alert("Account created. Please login.");
        setIsLogin(true);

      }

    } catch (err) {
      alert("Authentication failed");
    }

  };

  const handleGoogleAuth = async (credentialResponse) => {

    const token = credentialResponse.credential;

    await axios.post(
      "http://localhost:8000/google-login",
      { token }
    );

  };

  return (

    <div className="auth-wrapper">

      <div className="auth-card">

        {/* LEFT SIDE */}

        <div className="auth-left">

          <h2>🏏 Sportlytics</h2>

          <p>
            {isLogin
              ? "Login to analyze sports data"
              : "Create your Sportlytics account"}
          </p>

        </div>


        {/* RIGHT SIDE */}

        <div className="auth-right">

          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          <form onSubmit={handleSubmit}>

            {!isLogin && (

              <input
                type="text"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
                required
              />

            )}

            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {!isLogin && (

              <input
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

            )}

            <button type="submit">

              {isLogin ? "Login" : "Create Account"}

            </button>

          </form>


          <div className="divider">
            OR
          </div>

          <GoogleLogin
            onSuccess={handleGoogleAuth}
            onError={() => console.log("Google login failed")}
          />

          <p className="switch">

            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <span
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? " Sign Up" : " Login"}
            </span>

          </p>

        </div>

      </div>

    </div>

  );

}

export default AuthPage;