import React from "react";

function HomePage() {
    const handleSpotifyLogin = () => {
        window.location.href = "http://localhost:8080/login";
    };

    const handleAppleMusicLogin = () => {
        window.location.href = "/applemusic";
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-6">
                    Welcome to Playlist Sync
                </h1>
                <p className="text-lg text-gray-200 mb-8">
                    Sync your favorite Spotify and Apple Music playlists across platforms.
                </p>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleSpotifyLogin}
                        className="bg-white text-green-500 font-semibold py-3 px-6 rounded-md shadow-lg hover:bg-green-500 hover:text-white transition duration-300"
                    >
                        Login with Spotify
                    </button>
                    
                    <button
                        onClick={handleAppleMusicLogin}
                        className="bg-black text-white font-semibold py-3 px-6 rounded-md shadow-lg hover:bg-gray-900 transition duration-300 flex items-center justify-center space-x-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="w-5 h-5"
                            viewBox="0 0 16 16"
                        >
                        </svg>
                        <span>Login with Apple Music</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
