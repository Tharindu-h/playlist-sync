import React from "react";

function TopSongsList({ songs, platform }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              
              {platform === "spotify"
                  ? "Your Top 5 Songs"
                  : platform === "apple"
                  ? "Your Top 5 Recent songs"
                  : ""}
              </h2>
            {songs.length > 0 ? (
                <ul className="space-y-4">
                    {songs.map((song, index) => (
                        <li
                            key={index}
                            className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100"
                        >
                            {platform === "spotify" ? (
                                // Spotify Image
                                song.album.images?.[0]?.url ? (
                                    <img
                                        src={song.album.images[0].url}
                                        alt={song.album.name}
                                        className="w-16 h-16 rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500 text-sm">No Image</span>
                                    </div>
                                )
                            ) : platform === "apple" ? (
                                // Apple Music Image
                                song.attributes?.artwork?.url ? (
                                    <img
                                        src={song.attributes.artwork.url.replace("{w}x{h}", "100x100")}
                                        alt={song.attributes.name}
                                        className="w-16 h-16 rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500 text-sm">No Image</span>
                                    </div>
                                )
                            ) : null}

                            <div>
                                <div className="text-lg font-medium text-gray-700">
                                    {platform === "spotify"
                                        ? song.name
                                        : platform === "apple"
                                        ? song.attributes?.name
                                        : ""}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {platform === "spotify"
                                        ? `by ${song.artists.map((artist) => artist.name).join(", ")}`
                                        : platform === "apple"
                                        ? `by ${song.attributes?.artistName}`
                                        : "Error getting song name"}
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
