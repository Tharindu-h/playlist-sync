import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import TopSongsList from "./TopSongsList";
import PlaylistsList from "./PlaylistsList";
import PlaylistItemsList from "./PlaylistItemsList";
import { usePlaylists } from "../hooks/usePlaylists";
import { usePlaylistItems } from "../hooks/usePlaylistItems";
import { fetchTopSongs } from "../api";
import usePlaylistTransfer from "../hooks/usePlaylistTransfer";

function SpotifyDashboard({ newSpotifyPlaylistId, setNewSpotifyPlaylistId, 
                            newSpotifyPlaylistName, setNewSpotifyPlaylistName,
                            setNewAMPlaylistId, setNewAMPlaylistName }) {
    const [view, setView] = useState('TOP_SONGS'); // Default view
    const [currentPlaylistName, setCurrentPlaylistName] = useState('');

    const [topSongs, setTopSongs] = React.useState([]);
    const { playlists, getPlaylists } = usePlaylists();
    const { playlistItems, getPlaylistItems, loadMoreItems, nextPageUrl } = usePlaylistItems();

    const { transferPlaylistToApple,
            transferLoading, 
            transferError, 
            setTransferError, 
            newPlaylistId, 
            setNewPlaylistId,
            newPlaylistName,
            setNewPlaylistName } = usePlaylistTransfer();

    useEffect(() => {
        fetchTopSongs().then((res) => setTopSongs(res.data.items));
    }, []);

    // Handle Navigation from Navbar
    const handleNavigate = (view) => {
        setView(view);
        if (view === 'PLAYLISTS') getPlaylists();
    };

    // Handle Playlist Selection
    const handlePlaylistSelect = useCallback(
      (playlistId, playlistName) => {
          console.log("getting spotify playlist items");
          getPlaylistItems(playlistId);
          setCurrentPlaylistName(playlistName);
          setView('PLAYLIST_ITEMS');
          cleanUpAMTransfer();
      },
      [getPlaylistItems]
    );

    const cleanUpAMTransfer = () => {
      setTransferError(null);
      setNewPlaylistId(null);
      setNewPlaylistName(null);
    }

    useEffect(() => {
      if (newSpotifyPlaylistId && newSpotifyPlaylistName) {
          handlePlaylistSelect(newSpotifyPlaylistId, newSpotifyPlaylistName);
          setNewSpotifyPlaylistId(null);
          setNewSpotifyPlaylistName(null);
      }
    }, [newSpotifyPlaylistId, newSpotifyPlaylistName, handlePlaylistSelect, setNewSpotifyPlaylistId, setNewSpotifyPlaylistName]);

    useEffect(() => {
      if (newPlaylistId) {
        setNewAMPlaylistId(newPlaylistId);
        setNewAMPlaylistName(`${newPlaylistName}`);
      }
    }, [newPlaylistId, newPlaylistName, setNewAMPlaylistId, setNewAMPlaylistName]);

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
                                onClick={() => handleNavigate('PLAYLISTS')}
                                className="bg-white text-green-600 font-bold py-2 px-4 rounded-md shadow-md hover:bg-pink-500 hover:text-white transition duration-300 mb-4"
                            >
                                ← Back to Playlists
                            </button>
                            <button
                                onClick={() => transferPlaylistToApple(currentPlaylistName, playlistItems)}
                                className="bg-white text-pink-500 font-bold py-2 px-4 rounded-md shadow-md hover:bg-pink-500 hover:text-white transition duration-300"
                            >
                                Transfer to Apple Music
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {currentPlaylistName}
                        </h2>
                        {transferLoading && (
                            <div className="flex items-center justify-center space-x-2 bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-4 mb-4 rounded-md shadow-md">
                                <div role="status">
                                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pink-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="font-semibold">
                                    Transferring playlist <span className="font-bold">{currentPlaylistName}</span> to Spotify...
                                </p>
                            </div>
                        )}
                        {transferError !== null && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md shadow-md">
                                <p className="font-semibold">
                                  <span role="img" aria-label="warning">⚠️</span> Error transferring playlist: {transferError} 
                                </p>
                            </div>
                        )}
                        {newPlaylistId !== null && (
                            <div className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-4 mb-4 rounded-md shadow-md">
                                <p className="font-semibold">
                                  <span role="img" aria-label="success">&#x2705;</span> Playlist transfer successfull 
                                </p>
                            </div>
                        )}
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
