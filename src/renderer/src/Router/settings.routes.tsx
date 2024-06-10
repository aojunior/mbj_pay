// import { Route, Router } from 'electron-router-dom';
import { Route, Routes } from 'react-router-dom'

import Home from '@renderer/page/Home/Index';
import Dashboard from '@renderer/page/Dashboard';
import CreateAccount from '@renderer/page/CreateAccount';
import Settings from '@renderer/page/Settings';
import {AddBank} from '@renderer/page/Settings/_components/AddBank';
import {CreateAlias} from '@renderer/page/Settings/_components/CreateAlias';
// import { Navbar } from '@renderer/components/Navbar';

const RoutersSettings = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home/>} />
      <Route path="/createaccount" element={<CreateAccount/>} />
    </Routes>
  );
};

export default RoutersSettings
