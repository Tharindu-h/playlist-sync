import React from "react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

function PlaylistItemsList({ items, loadMore, nextPageUrl, platform }) {
    const infiniteRef = useInfiniteScroll(() => {
        loadMore();
    });

    return (
        <div>
            {items.length > 0 ? (
                <ul className="space-y-4">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100"
                        >   
                            <span className="text-lg font-bold text-gray-700">
                                {index + 1}.
                            </span>
                            {platform === "spotify" ? (
                                item.track.album.images?.[0]?.url ? (
                                  <img
                                      src={item.track.album.images[0].url}
                                      alt={item.track.album.name}
                                      className="w-16 h-16 rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 text-sm">No Image</span>
                                  </div>
                                )
                            ) : platform === "apple" ? (
                              item.attributes.artwork?.url ? (
                                <img
                                    src={item.attributes.artwork.url.replace("{w}x{h}", "100x100")}
                                    alt={item.attributes.name}
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
                                    { platform === "spotify" 
                                    ? item.track.name
                                    : platform === "apple"
                                    ? item.attributes.name
                                    : "Error getting song name"}
                                </div>
                                <div className="text-sm text-gray-500">
                                    by 
                                    { platform === "spotify"
                                    ? ` ${item.track.artists.map((artist) => artist.name).join(", ")}`
                                    : platform === "apple"
                                    ? ` ${item.attributes.artistName}`
                                    : ""
                                    }
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md shadow-md">
                  <p className="font-semibold text-center">
                    No tracks found in this playlist. 
                  </p>
                </div>
                // <p className="text-black-500">No tracks found in this playlist.</p>
            )}
            {nextPageUrl && <p className="text-blue-500 text-center mt-4">Loading more...</p>}
            <div ref={infiniteRef} className="h-10 bg-transparent"></div>
        </div>
    );
}

export default PlaylistItemsList;
