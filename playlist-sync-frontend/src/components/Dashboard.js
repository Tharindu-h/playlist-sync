import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function Dashboard() {
    const [topSongs, setTopSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [playlistItems, setPlaylistItems] = useState([]);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showPlaylistItems, setShowPlaylistItems] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Fetch top 5 songs on mount
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/spotify/top5songs", { withCredentials: true })
            .then((response) => {
                setTopSongs(response.data.items);
            })
            .catch((error) => {
                console.error("Error fetching top songs:", error);
                setError(true);
            });
    }, []);

    // Fetch all playlists
    const fetchPlaylists = () => {
        setLoading(true);
        axios
            .get("http://localhost:8080/api/spotify/playlists", { withCredentials: true })
            .then((response) => {
                setPlaylists(response.data.items);
                setShowPlaylists(true);
                setShowPlaylistItems(false);
            })
            .catch((error) => {
                console.error("Error fetching playlists:", error);
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Fetch items for a specific playlist
    const fetchPlaylistItems = (playlistId) => {
        setLoading(true);
        axios
            .get(`http://localhost:8080/api/spotify/playlists/${playlistId}/items`, {
                withCredentials: true,
            })
            .then((response) => {
                setPlaylistItems(response.data);
                console.log(response.data)
                setShowPlaylistItems(true);
            })
            .catch((error) => {
                console.error("Error fetching playlist items:", error);
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
            {/* Navbar */}
            <Navbar
                onShowTopSongs={() => {
                    setShowPlaylists(false);
                    setShowPlaylistItems(false);
                }}
                onShowPlaylists={fetchPlaylists}
            />

            {/* Content */}
            <div className="container mx-auto p-6">
                {loading ? (
                    <p className="text-blue-500 text-center">Loading...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">
                        Unable to fetch data. Please try again later.
                    </p>
                ) : showPlaylistItems ? (
                    <div>
                        {/* Back to Playlists */}
                        <button
                            onClick={() => setShowPlaylistItems(false)}
                            className="text-blue-500 font-medium mb-4 hover:underline"
                        >
                            Back to Playlists
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Playlist Items
                        </h2>
                        {playlistItems.tracks.items.length > 0 ? (
                            <ul className="space-y-4">
                                {playlistItems.tracks.items.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100"
                                    >
                                        {/* Item Image */}
                                        {item.track.album.images && item.track.album.images.length > 0 ? (
                                            <img
                                                src={item.track.album.images[0].url}
                                                alt={item.track.album.name}
                                                className="w-16 h-16 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500 text-sm">No Image</span>
                                            </div>
                                        )}
                                        {/* Item Details */}
                                        <div>
                                            <div className="text-lg font-medium text-gray-700">
                                                {item.track.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                by {item.track.artists.map((artist) => artist.name).join(", ")}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No tracks found in this playlist.</p>
                        )}
                    </div>
                ) : showPlaylists ? (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Your Playlists
                        </h2>
                        {playlists.length > 0 ? (
                            <ul className="space-y-4">
                                {playlists.map((playlist) => (
                                    <li
                                        key={playlist.id}
                                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
                                        onClick={() => fetchPlaylistItems(playlist.id)}
                                    >
                                        {/* Playlist Image */}
                                        {playlist.images && playlist.images.length > 0 ? (
                                            <img
                                                src={playlist.images[0].url}
                                                alt={playlist.name}
                                                className="w-16 h-16 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500 text-sm">No Image</span>
                                            </div>
                                        )}
                                        {/* Playlist Details */}
                                        <div>
                                            <div className="text-lg font-medium text-gray-700">
                                                {playlist.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Tracks: {playlist.tracks.total}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No playlists found.</p>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Your Top 5 Songs
                        </h2>
                        {topSongs.length > 0 ? (
                            <ul className="space-y-4">
                                {topSongs.map((song, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100"
                                    >
                                        {/* Song Image */}
                                        {song.album.images && song.album.images.length > 0 ? (
                                            <img
                                                src={song.album.images[0].url}
                                                alt={song.album.name}
                                                className="w-16 h-16 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500 text-sm">No Image</span>
                                            </div>
                                        )}
                                        {/* Song Details */}
                                        <div>
                                            <div className="text-lg font-medium text-gray-700">
                                                {song.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                by {song.artists.map((artist) => artist.name).join(", ")}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">
                                No top songs available. Try logging in again.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
