import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import TopSongsList from "./TopSongsList";
import PlaylistsList from "./PlaylistsList";
import PlaylistItemsList from "./PlaylistItemsList";
import { usePlaylists } from "../hooks/usePlaylists";
import { usePlaylistItems } from "../hooks/usePlaylistItems";
import { fetchTopSongs } from "../api";

function SpotifyDashboard({ newSpotifyPlaylistId, setNewSpotifyPlaylistId }) {
    const [view, setView] = useState('TOP_SONGS'); // Default view
    const [currentPlaylistName, setCurrentPlaylistName] = useState('');

    const [topSongs, setTopSongs] = React.useState([]);
    const { playlists, getPlaylists } = usePlaylists();
    const { playlistItems, getPlaylistItems, loadMoreItems, nextPageUrl } = usePlaylistItems();

    useEffect(() => {
        fetchTopSongs().then((res) => setTopSongs(res.data.items));
    }, []);

    useEffect(() => {
      if (newSpotifyPlaylistId) {
        console.log(`got new playlist ${newSpotifyPlaylistId}`)
        // display new playlist
      }
    }, [newSpotifyPlaylistId]);

    // Handle Navigation from Navbar
    const handleNavigate = (view) => {
        setView(view);
        if (view === 'PLAYLISTS') getPlaylists();
    };

    // Handle Playlist Selection
    const handlePlaylistSelect = (playlistId, playlistName) => {
        getPlaylistItems(playlistId);
        setCurrentPlaylistName(playlistName);
        setView('PLAYLIST_ITEMS'); // Switch view to Playlist Items
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <Navbar onNavigate={handleNavigate} />
            <div className="container mx-auto p-6">
                {view === 'TOP_SONGS' && <TopSongsList songs={topSongs} platform={"spotify"}/>}
                {view === 'PLAYLISTS' && (
                    <PlaylistsList playlists={playlists} onSelect={handlePlaylistSelect} platform={"spotify"}/>
                )}
                {view === 'PLAYLIST_ITEMS' && (
                    <>
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setView('PLAYLISTS')}
                                className="bg-white text-green-600 font-bold py-2 px-4 rounded-md shadow-md hover:bg-pink-500 hover:text-white transition duration-300 mb-4"
                            >
                                ← Back to Playlists
                            </button>
                            <button
                                onClick={() => {
                                    // Add functionality here later
                                }}
                                className="bg-white text-pink-500 font-bold py-2 px-4 rounded-md shadow-md hover:bg-pink-500 hover:text-white transition duration-300"
                            >
                                Transfer to Apple Music
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {currentPlaylistName}
                        </h2>
                        <PlaylistItemsList
                            items={playlistItems}
                            loadMore={loadMoreItems}
                            nextPageUrl={nextPageUrl}
                            platform={"spotify"}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default SpotifyDashboard;
