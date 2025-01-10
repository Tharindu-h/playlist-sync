import React, { useEffect } from "react";
import useAppleMusic from "../hooks/useAppleMusic";

function AppleMusicDashboard() {
    const { isLoggedIn, topSongs, fetchTopSongs, login, userPlaylists, fetchUserPlaylists } = useAppleMusic();

    useEffect(() => {
        if (isLoggedIn && userPlaylists.length === 0) {
            fetchUserPlaylists();
        }
    }, [isLoggedIn, fetchUserPlaylists, userPlaylists.length]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-red-500 to-pink-500 p-6">
            <h1 className="text-3xl font-bold text-white text-center mb-6">
                Your Top 5 Apple Music Songs
            </h1>
            {!isLoggedIn ? (
                <div className="flex justify-center">
                    <button
                        onClick={login}
                        className="bg-white text-red-500 font-semibold py-2 px-4 rounded-md shadow-lg hover:bg-red-500 hover:text-white transition duration-300"
                    >
                        Login to Apple Music
                    </button>
                </div>
            ) : (
                <ul className="space-y-4">
                    {topSongs.length > 0 ? (
                        topSongs.map((song, index) => (
                            <li
                                key={index}
                                className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100"
                            >
                                {song.attributes?.artwork?.url ? (
                                    <img
                                        src={song.attributes.artwork.url.replace("{w}x{h}", "100x100")}
                                        alt={song.attributes.name}
                                        className="w-16 h-16 rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500 text-sm">No Image</span>
                                    </div>
                                )}
                                <div>
                                    <div className="text-lg font-medium text-gray-700">
                                        {song.attributes.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        by {song.attributes.artistName}
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-200 text-center">No songs found.</p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default AppleMusicDashboard;
