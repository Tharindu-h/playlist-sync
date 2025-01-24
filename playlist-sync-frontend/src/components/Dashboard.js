import React from "react";
import SpotifyDashboard from "./SpotifyDashboard"; 
import AppleMusicDashboard from "./AppleMusicDashboard";
import HomePage from "./HomePage";
import { useAuth } from "../context/AuthContext"; 

function Dashboard() {
  const { isAppleMusicLoggedIn, isSpotifyLoggedIn } = useAuth();
  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-1/2 border-r border-gray-300">
        {isSpotifyLoggedIn ? (
          <SpotifyDashboard />
        ) :
        (
          <HomePage showSpotifyLogin={true}/>
        )}
        
      </div>
      <div className="w-1/2">
        {isAppleMusicLoggedIn ? (
          <AppleMusicDashboard />
        ) : (
          <HomePage showAppleMusicLogin={true} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
