import React from "react";

function Navbar({ onNavigate }) {
    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* App Title */}
                <h1 className="text-xl font-bold text-gray-800">Playlist Sync</h1>
                
                {/* Navigation Buttons */}
                <ul className="flex space-x-6">
                    <li>
                        <button
                            onClick={() => onNavigate('TOP_SONGS')}
                            className="text-gray-700 font-medium hover:text-blue-500"
                        >
                            Top Songs
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => onNavigate('PLAYLISTS')}
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
