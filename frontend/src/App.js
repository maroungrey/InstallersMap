import React from 'react'
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './Components/Common/Navbar';
import Home from './Pages/Home'
import InstallersMap from './Pages/InstallersMap'
import Charts from './Pages/Charts'
import Contact from './Pages/Contact'
import NoPage from './Pages/NoPage'
 


function App() {
  return (
    <div>
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/installers-map" element={<InstallersMap />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
