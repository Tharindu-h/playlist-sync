import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import TopSongsList from "./TopSongsList";
import PlaylistsList from "./PlaylistsList";
import PlaylistItemsList from "./PlaylistItemsList";
import useAppleMusic from "../hooks/useAppleMusic";

function AppleMusicDashboard() {
    const {
        isLoggedIn,
        login,
        recentSongs,
        fetchRecentSongs,
        userPlaylists,
        fetchUserPlaylists,
        playlistItems,
        fetchPlaylistItems,
        loadMoreItems,
        nextPageUrl,
    } = useAppleMusic();

    const [view, setView] = useState("TOP_SONGS"); // Default view
    const [currentPlaylistName, setCurrentPlaylistName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn && recentSongs.length === 0) {
            setLoading(true); // Start loading
            fetchRecentSongs().finally(() => setLoading(false)); // Stop loading when complete
        }
    }, [isLoggedIn, fetchRecentSongs, recentSongs.length]);

    // Handle Navigation from Navbar
    const handleNavigate = (view) => {
        setView(view);
        if (view === "PLAYLISTS") fetchUserPlaylists();
    };

    // Handle Playlist Selection
    const handlePlaylistSelect = (playlistId, playlistName) => {
        fetchPlaylistItems(playlistId);
        setCurrentPlaylistName(playlistName);
        setView("PLAYLIST_ITEMS");
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
                    <PlaylistsList playlists={userPlaylists} onSelect={handlePlaylistSelect} />
                )}
                {view === "PLAYLIST_ITEMS" && (
                    <>
                        <button
                            onClick={() => setView("PLAYLISTS")}
                            className="text-pink-500 font-medium mb-4 hover:underline"
                        >
                            ← Back to Playlists
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {currentPlaylistName}
                        </h2>
                        <PlaylistItemsList
                            items={playlistItems}
                            loadMore={loadMoreItems}
                            nextPageUrl={nextPageUrl}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default AppleMusicDashboard;
