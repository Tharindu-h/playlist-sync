import React from "react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

function PlaylistItemsList({ items, loadMore, nextPageUrl }) {
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
                            {item.track.album.images?.[0]?.url ? (
                                <img
                                    src={item.track.album.images[0].url}
                                    alt={item.track.album.name}
                                    className="w-16 h-16 rounded-md object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">No Image</span>
                                </div>
                            )}
                            <div>
                                <div className="text-lg font-medium text-gray-700">
                                    {item.track.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    by {item.track.artists.map((artist) => artist.name).join(", ")}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No tracks found in this playlist.</p>
            )}
            {nextPageUrl && <p className="text-blue-500 text-center mt-4">Loading more...</p>}
            <div ref={infiniteRef} className="h-10 bg-transparent"></div>
        </div>
    );
}

export default PlaylistItemsList;
