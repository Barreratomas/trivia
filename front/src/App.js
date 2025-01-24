import React from 'react'

import Home from './Screens/home'
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Game from './Screens/Game';
import EndFail from './Screens/EndFail';
import EndWin from './Screens/EndWin';
import ServerErrorPage from './Screens/ServerErrorPage';

export default function App(){
  return(
    
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home></Home>} />
          <Route path='/game' element={<Game/>} />
          <Route path='/EndFail' element={<EndFail/>} />
          <Route path='/EndWin' element={<EndWin/>} />
          <Route path='/ServerError' element={<ServerErrorPage/>}/>
          

      </Routes>
    </BrowserRouter>
  )
}