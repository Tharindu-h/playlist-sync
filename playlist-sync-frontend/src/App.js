import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import SpotifyDashboard from "./components/SpotifyDashboard";
import AppleMusicDashboard from "./components/AppleMusicDashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage showSpotifyLogin={true} showAppleMusicLogin={true} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/spotify-dashboard" element={<SpotifyDashboard />} />
                <Route path="apple-music-dashboard" element={<AppleMusicDashboard />}></Route>
            </Routes>
        </Router>
    );
}

export default App;
