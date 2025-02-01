import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import TopSongsList from "./TopSongsList";
import PlaylistsList from "./PlaylistsList";
import PlaylistItemsList from "./PlaylistItemsList";
import useAppleMusic from "../hooks/useAppleMusic";
import usePlaylistTransfer from "../hooks/usePlaylistTransfer";

function AppleMusicDashboard({ setNewSpotifyPlaylistId, setNewSpotifyPlaylistName }) {
    const {
        isLoggedIn,
        recentSongs,
        fetchRecentSongs,
        userPlaylists,
        fetchUserPlaylists,
        playlistItems,
        fetchPlaylistItems,
        loadMoreItems,
        nextPageUrl,
    } = useAppleMusic();

    const { transferPlaylistToSpotify, 
            transferLoading, 
            transferError, 
            setTransferError, 
            newPlaylistId, 
            setNewPlaylistId,
            newPlaylistName,
            setNewPlaylistName } = usePlaylistTransfer();

    const [view, setView] = useState("TOP_SONGS"); // Default view
    const [currentPlaylistName, setCurrentPlaylistName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn && recentSongs.length === 0) {
            setLoading(true); // Start loading
            fetchRecentSongs().finally(() => setLoading(false)); // Stop loading when complete
        }
    }, [isLoggedIn, fetchRecentSongs, recentSongs.length]);

    useEffect(() => {
      if (newPlaylistId) {
        setNewSpotifyPlaylistId(newPlaylistId);
        setNewSpotifyPlaylistName(`${newPlaylistName}`);
      }
    }, [newPlaylistId, newPlaylistName, setNewSpotifyPlaylistId, setNewSpotifyPlaylistName]);

    // Handle Navigation from Navbar
    const handleNavigate = (view) => {
        setView(view);
        if (view === "PLAYLISTS") {
          fetchUserPlaylists();
          cleanUpSpotifyTransfer();
        }
    };

    // Handle Playlist Selection
    const handlePlaylistSelect = (playlistId, playlistName) => {
        fetchPlaylistItems(playlistId);
        setCurrentPlaylistName(playlistName);
        setView("PLAYLIST_ITEMS");
        cleanUpSpotifyTransfer();
    };

    const cleanUpSpotifyTransfer = () => {
      setTransferError(null);
      setNewPlaylistId(null);
      setNewPlaylistName(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-red-500 to-pink-500">
            <Navbar onNavigate={handleNavigate} />
            <div className="container mx-auto p-6">
                {view === "TOP_SONGS" && (
                    <>
                        {loading ? (
                            <p className="text-white text-center">Loading top songs...</p>
                        ) : (
                            <TopSongsList songs={recentSongs} platform={"apple"} />
                        )}
                    </>
                )}
                {view === "PLAYLISTS" && (
                    <PlaylistsList playlists={userPlaylists} onSelect={handlePlaylistSelect} platform={"apple"} />
                )}
                {view === "PLAYLIST_ITEMS" && (
                    <>
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setView("PLAYLISTS")}
                                className="bg-white text-pink-500 font-bold py-2 px-4 rounded-md shadow-md hover:bg-pink-500 hover:text-white transition duration-300 mb-4"
                            >
                                ← Back to Playlists
                            </button>
                            <button
                                onClick={() => transferPlaylistToSpotify(currentPlaylistName, playlistItems)}
                                className="bg-white text-green-500 font-bold py-2 px-4 rounded-md shadow-md hover:bg-green-500 hover:text-white transition duration-300"
                            >
                                {loading ? "Transferring..." : "Transfer to Spotify"}
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {currentPlaylistName}
                        </h2>
                        {transferError !== null && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md shadow-md">
                                <p className="font-semibold">
                                  <span role="img" aria-label="warning">⚠️</span> Error transferring playlist: {transferError} 
                                </p>
                            </div>
                        )}
                        {newPlaylistId !== null && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md shadow-md">
                                <p className="font-semibold">
                                  <span role="img" aria-label="success">&#x2705;</span> Playlist transfer successfull 
                                </p>
                            </div>
                        )}
                        <PlaylistItemsList
                            items={playlistItems}
                            loadMore={loadMoreItems}
                            nextPageUrl={nextPageUrl}
                            platform={"apple"}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default AppleMusicDashboard;
