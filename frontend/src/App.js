import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom';

//import componenti
import Login from './components/Login';
import NotFound from './components/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import User from './components/User';
import UserProfile from './components/UserProfile';
import Orders from './components/Orders';
import Deliveries from './components/Deliveries';
import Catalogue from './components/Catalogue';
import Chat from './components/Chat';


//gestione visualizzazione delle pagine usando ReactRouter
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<User />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/deliveries" element={<Deliveries />} />
            /*
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/chat" element={<Chat />} />
            */
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
