import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function Dashboard() {
    const [topSongs, setTopSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Fetch top songs when the component mounts
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

    const fetchPlaylists = () => {
        setLoading(true);
        axios
            .get("http://localhost:8080/api/spotify/playlists", { withCredentials: true })
            .then((response) => {
                console.log(response.data.items);
                
                setPlaylists(response.data.items);
                setShowPlaylists(true);
            })
            .catch((error) => {
                console.error("Error fetching playlists:", error);
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="h-screen bg-gradient-to-r from-green-400 to-blue-500">
            {/* Navbar */}
            <Navbar
                onShowTopSongs={() => setShowPlaylists(false)}
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
                ) : showPlaylists ? (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Your Playlists
                        </h2>
                        {playlists.length > 0 ? (
                            <ul className="space-y-4">
                                {playlists.map((playlist, index) => (
                                    <li
                                        key={playlist.name}
                                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100"
                                    >
                                        <div className="text-lg font-medium text-gray-700">
                                            {index}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Tracks: {index}
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
                                        <div className="text-lg font-medium text-gray-700">
                                            {song.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            by {song.artists.map((artist) => artist.name).join(", ")}
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
