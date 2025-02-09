import React, { useState, useCallback } from "react";
import SpotifyDashboard from "./SpotifyDashboard"; 
import AppleMusicDashboard from "./AppleMusicDashboard";
import HomePage from "./HomePage";
import { useAuth } from "../context/AuthContext"; 

function Dashboard() {
  const { isAppleMusicLoggedIn, isSpotifyLoggedIn } = useAuth();
  const [newSpotifyPlaylistId, setNewSpotifyPlaylistId] = useState(null);
  const [newSpotifyPlaylistName, setNewSpotifyPlaylistName] = useState(null);
  const [newAMPlaylistId, setNewAMPlaylistId] = useState(null);
  const [newAMPlaylistName, setNewAMPlaylistName] = useState(null);
  const memoizedSetNewSpotifyPlaylistId = useCallback((id) => setNewSpotifyPlaylistId(id), []);
  const memoizedSetNewSpotifyPlaylistName = useCallback((name) => setNewSpotifyPlaylistName(name), []);
  const memoizedSetNewAMPlaylistId = useCallback((id) => setNewAMPlaylistId(id), []);
  const memoizedSetNewAMPlaylistName = useCallback((name) => setNewAMPlaylistName(name), []);


  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-1/2 border-r border-gray-300">
        {isSpotifyLoggedIn ? (
          <SpotifyDashboard newSpotifyPlaylistId={newSpotifyPlaylistId} 
                            setNewSpotifyPlaylistId={memoizedSetNewSpotifyPlaylistId}
                            newSpotifyPlaylistName={newSpotifyPlaylistName}
                            setNewSpotifyPlaylistName={memoizedSetNewSpotifyPlaylistName}
                            setNewAMPlaylistId={memoizedSetNewAMPlaylistId}
                            setNewAMPlaylistName={memoizedSetNewAMPlaylistName} />
        ) :
        (
          <HomePage showSpotifyLogin={true}/>
        )}
        
      </div>
      <div className="w-1/2">
        {isAppleMusicLoggedIn ? (
          <AppleMusicDashboard setNewSpotifyPlaylistId={memoizedSetNewSpotifyPlaylistId}
                              setNewSpotifyPlaylistName={memoizedSetNewSpotifyPlaylistName}
                              newAMPlaylistId={newAMPlaylistId}
                              newAMPlaylistName={newAMPlaylistName}
                              setNewAMPlaylistId={memoizedSetNewAMPlaylistId}
                              setNewAMPlaylistName={memoizedSetNewAMPlaylistName} />
        ) : (
          <HomePage showAppleMusicLogin={true} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
