import React from 'react'
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import InstallersMap from './Pages/InstallersMap'
import Charts from './Pages/Charts'
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
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
