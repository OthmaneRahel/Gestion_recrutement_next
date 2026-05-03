import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes,Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';
import DashboardLayout from './components/DashboardLayout';
import ForumList from './components/User';
import LoginPage from './components/login';
import SignUpTalent from './components/signuptalent';
import SignUpRecruteur from './components/signuprecruteur';
import TestQrCode from './components/test';
import Forum2 from './components/event/forum2';
import Candidates from './components/Candidates';
import Statistics from './components/Statistics';
import Feedback from './components/Feedback';
import 'leaflet/dist/leaflet.css';
import Archive from './components/Archive';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  let token = localStorage.getItem("token-login")
  //navigate = Redirection vers page Authentification
  let navigate = useNavigate()
  // setTimeout(()=>{
  //   localStorage.removeItem("token-login")
  //   localStorage.removeItem("user")
  //   navigate("/login")
  // },900000)

  // useEffect(()=>{
  //   setInterval(() => {
  //     axios.get("http://127.0.0.1:8000/api/list_forums_candidature_demain/").then((res)=>{console.log(res.data)})
  //   },86400000);
  // },[])

  useEffect(() => {
  const now = new Date();
  const next11am = new Date();

  next11am.setHours(11, 0, 0, 0);

 
  
  if (now > next11am) {
    next11am.setDate(next11am.getDate() + 1);
  }

  
  const delay = next11am.getTime() - now.getTime();

  
  const timeoutId = setTimeout(() => {
    axios.get("http://127.0.0.1:8000/api/list_forums_candidature_demain/")
      .then((res) => {
        console.log("Email rappel envoyé:", res.data);
      });

   
    setInterval(() => {
      axios.get("http://127.0.0.1:8000/api/list_forums_candidature_demain/")
        .then((res) => {
          console.log("Email rappel envoyé:", res.data);
        });
    }, 24 * 60 * 60 * 1000); // 24h
  }, delay);

  return () => clearTimeout(timeoutId);
}, []);


  return (
    
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/user' element={<ForumList/>}/>
        <Route path='/Recruteur' element={<DashboardLayout/>}/>
        <Route path='/Test' element={<TestQrCode/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup-talent' element={<SignUpTalent/>}/>
        <Route path='/signup-recruteur' element={<SignUpRecruteur/>}/>
        <Route path='/event/:nom' element={<Forum2/>}/>
        <Route path="/Candidates/:forumId" element={<Candidates />} />
        <Route path="/Feedback/:forumId" element={<Feedback />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path='/Archive' element={< Archive />}/>
        </Routes>

    
  );
}

export default App;