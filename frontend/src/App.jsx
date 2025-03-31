import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Players from "./components/Players";
import Lineups from "./components/Lineups";
import Actions from "./components/Actions";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Jugadores</Link> | <Link to="/lineups">Alineaciones</Link> | <Link to="/actions">Acciones</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Players />} />
        <Route path="/lineups" element={<Lineups />} />
        <Route path="/actions" element={<Actions />} />
      </Routes>
    </Router>
  );
}

export default App;
