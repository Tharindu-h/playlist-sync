import React from "react";

function PlaylistsList({ playlists, onSelect, platform }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Playlists</h2>
            {playlists.length > 0 ? (
                <ul className="space-y-4">
                    {playlists.map((playlist, index) => {
                        const playlistName = platform === "spotify" ? playlist.name : playlist.attributes?.name;

                        return (
                          <li
                              key={playlist.id}
                              className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
                              onClick={() => onSelect(playlist.id, playlistName)}
                          >
                              <span className="text-lg font-bold text-gray-700">
                                  {index + 1}.
                              </span>
                              {platform === "spotify" ? (
                                playlist.images?.[0]?.url ? (
                                  <img
                                      src={playlist.images[0].url}
                                      alt={playlist.name}
                                      className="w-16 h-16 rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 text-sm">No Image</span>
                                  </div>
                                )
                              ) : platform === "apple" ? (
                                playlist.attributes?.artwork?.url ? (
                                  <img
                                      src={playlist.attributes.artwork.url.replace("{w}x{h}", "100x100")}
                                      alt={playlist.attributes.name}
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
                                      {playlistName ? playlistName : "Error getting playlist name"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                      {platform === "spotify" 
                                      ? `Tracks: ${playlist.tracks.total}`
                                      : ""
                                      }
                                  </div>
                              </div>
                          </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-500">No playlists found.</p>
            )}
        </div>
    );
}

export default PlaylistsList;