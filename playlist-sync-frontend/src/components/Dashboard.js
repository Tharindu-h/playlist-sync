import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [topSongs, setTopSongs] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/spotify/top5songs", { withCredentials: true })
            .then((response) => {
                setTopSongs(response.data.items);
                
            })
            .catch((error) => {
                console.error("Error fetching top songs:", error);
            });
    }, []);

    useEffect(() => {
        if (topSongs.length > 0) {
            console.log("Top Songs Array:", topSongs);
        }
    }, [topSongs]); 

    return (
        <div className="h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Your Top 5 Songs
                </h1>
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
                                    by {song.artists.map(artist => artist.name).join(", ")}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">
                        No top songs available. Try logging in again.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
