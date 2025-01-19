import React from "react";
import SpotifyDashboard from "./SpotifyDashboard"; // Spotify Dashboard
import AppleMusicDashboard from "./AppleMusicDashboard"; // Apple Music Dashboard

function Dashboard() {
    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Spotify Dashboard */}
            <div className="w-1/2 border-r border-gray-300">
                <SpotifyDashboard />
            </div>

            {/* Apple Music Dashboard */}
            <div className="w-1/2">
                <AppleMusicDashboard />
            </div>
        </div>
    );
}

export default Dashboard;
