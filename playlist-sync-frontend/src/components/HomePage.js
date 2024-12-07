import React from "react";

function HomePage() {
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/login";
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-6">
                    Welcome to Playlist Sync
                </h1>
                <p className="text-lg text-gray-200 mb-8">
                    Sync your favorite Spotify playlists across platforms.
                </p>
                <button
                    onClick={handleLogin}
                    className="bg-white text-green-500 font-semibold py-3 px-6 rounded-md shadow-lg hover:bg-green-500 hover:text-white transition duration-300"
                >
                    Login with Spotify
                </button>
            </div>
        </div>
    );
}

export default HomePage;
