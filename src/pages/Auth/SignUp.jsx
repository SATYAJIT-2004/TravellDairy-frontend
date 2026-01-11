import React, { useEffect, useState } from "react";
import PasswordInput from "../../PasswordInput";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";
import { useDispatch, useSelector } from "react-redux";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loading,currentUser } = useSelector((state) => state.user);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError(null);

    //SignUp Api call
    try {
      const response = await axiosInstance.post("/auth/signup", {
        username: name,
        email,
        password,
      });
      //Handle successful signUp response
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong please try again");
      }
    }
  };

  useEffect(()=>{
    if(!loading && currentUser){
      navigate("/")
    }
  },[currentUser])

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />

      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end bg-[url('https://images.pexels.com/photos/14366357/pexels-photo-14366357.jpeg?_gl=1*1a1rt7j*_ga*OTk1NzI3Nzg0LjE3NTk5ODAyNjc.*_ga_8JE65Q40S6*czE3NjAwNTgzNTEkbzQkZzEkdDE3NjAwNTg1MjAkajM0JGwwJGgw')] bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Create your <br /> Stories
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Record your travel experience and memories in your travel journey
            </p>
          </div>
        </div>
        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">Create Your Account</h4>
            <input
              type="text"
              placeholder="Enter your name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            {loading ? (
              <p className="animate-pulse w-full text-center btn-primary">
                LOADING...
              </p>
            ) : (
              <button type="submit" className="btn-primary">
                SIGN UP
              </button>
            )}
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="submit"
              className="btn-primary btn-light"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
