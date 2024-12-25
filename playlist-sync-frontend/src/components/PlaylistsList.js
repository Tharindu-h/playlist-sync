import React from "react";

function PlaylistsList({ playlists, onSelect }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Playlists</h2>
            {playlists.length > 0 ? (
                <ul className="space-y-4">
                    {playlists.map((playlist) => (
                        <li
                            key={playlist.id}
                            className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
                            onClick={() => onSelect(playlist.id, playlist.name)}
                        >
                            {playlist.images?.[0]?.url ? (
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
    );
}

export default PlaylistsList;
