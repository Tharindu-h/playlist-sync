import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import TopSongsList from "./TopSongsList";
import PlaylistsList from "./PlaylistsList";
import PlaylistItemsList from "./PlaylistItemsList";
import { usePlaylists } from "../hooks/usePlaylists";
import { usePlaylistItems } from "../hooks/usePlaylistItems";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { fetchTopSongs } from "../api";

function Dashboard() {
    const [view, setView] = useState('TOP_SONGS'); // Default view
    const [currentPlaylistName, setCurrentPlaylistName] = useState('');

    const [topSongs, setTopSongs] = React.useState([]);
    const { playlists, getPlaylists } = usePlaylists();
    const { playlistItems, getPlaylistItems, loadMoreItems } = usePlaylistItems();

    useEffect(() => {
        fetchTopSongs().then((res) => setTopSongs(res.data.items));
    }, []);

    const infiniteRef = useInfiniteScroll(() => {
        loadMoreItems();
    });

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
                {view === 'TOP_SONGS' && <TopSongsList songs={topSongs} />}
                {view === 'PLAYLISTS' && (
                    <PlaylistsList playlists={playlists} onSelect={handlePlaylistSelect} />
                )}
                {view === 'PLAYLIST_ITEMS' && (
                    <>
                        <button
                            onClick={() => setView('PLAYLISTS')}
                            className="text-blue-500 font-medium mb-4 hover:underline"
                        >
                            ← Back to Playlists
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {currentPlaylistName}
                        </h2>
                        <PlaylistItemsList
                            items={playlistItems}
                            loadMore={loadMoreItems}
                            infiniteRef={infiniteRef}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
