import React from "react";

function HomePage() {
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/login";
    };

    return (
        <div className="h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Playlist Sync</h1>
                <button
                    onClick={handleLogin}
                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
                >
                    Login with Spotify
                </button>
            </div>
        </div>
    );
}

export default HomePage;
