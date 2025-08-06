import React from 'react'
import {BrowserRouter, routes, Route, Routes} from 'react-router-dom';

//import componenti
import Login from './components/Login';
import NotFound from './components/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import User from './components/User';


//gestione visualizzazione delle pagine usando ReactRouter
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
