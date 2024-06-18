// import { Route, Router } from 'electron-router-dom';
import { Route, Routes } from 'react-router-dom'

import Home from '@renderer/page/Home/Index';
import Dashboard from '@renderer/page/Dashboard';
import Account from '@renderer/page/Account';
import Settings from '@renderer/page/Settings';
import { useEffect, useState } from 'react';
import { Loading } from '@renderer/components/loading';

// import { Navbar } from '@renderer/components/Navbar';

const win: any = window

const Routers = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>()
  const [isLoad, setIsLoad] = useState<boolean>()
  
  useEffect(() => {
    setIsLoad(true)
    win.api.initialMain()
    win.api.initialRender(data => {
      setIsAuthorized(data)
    })
    setIsLoad(false)
  }, [])

  return (
    <Routes>
      {
        isLoad ?
        <Loading />
      :
        !isAuthorized ? 
        <Route path="/" element={<Account/>} />
        :
        <Route path="/" element={<Home/>} />
      
      }
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/account" element={<Account/>} />
      <Route path="/settings/" element={<Settings/>} />
    </Routes>
  );
};

export default Routers
