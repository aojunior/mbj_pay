// import { Route, Router } from 'electron-router-dom';
import { Route, Routes } from 'react-router-dom'

import Home from '@renderer/page/Home/Index';
import Dashboard from '@renderer/page/Dashboard';
import CreateAccount from '@renderer/page/CreateAccount';
import Settings from '@renderer/page/Settings';
// import { Navbar } from '@renderer/components/Navbar';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/createaccount" element={<CreateAccount/>} />
      <Route path="/settings" element={<Settings/>} />
    </Routes>
  );
};

export default Routers
