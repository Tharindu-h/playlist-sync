import { useState } from "react";
import { fetchPlaylistItems, fetchNextPage } from "../api";

export function usePlaylistItems() {
    const [playlistItems, setPlaylistItems] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const getPlaylistItems = async (playlistId) => {
        setLoading(true);
        try {
            const { data } = await fetchPlaylistItems(playlistId);
            setPlaylistItems(data.items);
            setNextPageUrl(data.next);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreItems = async (playlistId) => {
        console.log("loadMoreItems");
        
        if (!nextPageUrl) return;

        setLoading(true);
        try {
            const { data } = await fetchNextPage(playlistId, nextPageUrl);
            setPlaylistItems((prev) => [...prev, ...data.items]);
            setNextPageUrl(data.next);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return { playlistItems, getPlaylistItems, loadMoreItems, loading, error };
}
