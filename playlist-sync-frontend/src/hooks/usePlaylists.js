import { useState } from "react";
import { fetchPlaylists } from "../api";

export function usePlaylists() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const getPlaylists = async () => {
        setLoading(true);
        try {
            const { data } = await fetchPlaylists();
            setPlaylists(data.items);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return { playlists, getPlaylists, loading, error };
}
