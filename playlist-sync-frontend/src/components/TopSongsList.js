import React from "react";

function TopSongsList({ songs }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Top 5 Songs</h2>
            {songs.length > 0 ? (
                <ul className="space-y-4">
                    {songs.map((song, index) => (
                        <li
                            key={index}
                            className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100"
                        >
                            {song.album.images?.[0]?.url ? (
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
                <p className="text-gray-500">No top songs available. Try logging in again.</p>
            )}
        </div>
    );
}

export default TopSongsList;
