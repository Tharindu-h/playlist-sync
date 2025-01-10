import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import AppleMusicDashboard from "./components/AppleMusicDashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="apple-music-dashboard" element={<AppleMusicDashboard />}></Route>
            </Routes>
        </Router>
    );
}

export default App;
