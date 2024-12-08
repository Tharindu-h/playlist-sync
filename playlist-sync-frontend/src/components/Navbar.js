import React from "react";

function Navbar({ onShowTopSongs, onShowPlaylists }) {
    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Playlist Sync</h1>
                <ul className="flex space-x-6">
                    <li>
                        <button
                            onClick={onShowTopSongs}
                            className="text-gray-700 font-medium hover:text-blue-500"
                        >
                            Top Songs
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={onShowPlaylists}
                            className="text-gray-700 font-medium hover:text-blue-500"
                        >
                            Playlists
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
