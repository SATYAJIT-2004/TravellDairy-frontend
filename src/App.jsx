import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home/Home"
import Login from "./pages/Auth/Login"
import Signup from "./pages/Auth/SignUp"
import PrivateRoute from './components/PrivateRoute'

const App = () => {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute/>}>
        <Route path="/" exact element={<Home/>}  />  
        </Route>
        <Route path="/login" exact element={ <Login/>}  />  
        <Route path="/signup" exact element={ <Signup/>}  />  
           
         </Routes>
      </BrowserRouter>
    </>
  )
}

export default App