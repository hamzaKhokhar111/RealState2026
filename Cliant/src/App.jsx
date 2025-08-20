import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './Components/Header'
import Private from './Components/Private'
import CreateListing from './pages/CreateListing'

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
     <Routes>
      <Route  path='/' element={<Home/>} />
      <Route  path='/sign-in' element={<SignIn/>} />
      <Route  path='/sign-up' element={<SignUp/>} />
      <Route  path='/about' element={<About/>} />
      <Route  element={<Private />} > 
      <Route  path='/create-listing' element={<CreateListing/>} />
      <Route  path='/Profile' element={<Profile/>} />
      </Route>
     </Routes>
    </BrowserRouter>
  )
}
