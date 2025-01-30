import { useState } from "react";
import { transferPlaylist } from "../api";

export default function usePlaylistTransfer() {
    const [transferLoading, setTransferLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const transferPlaylistToSpotify = async (playlistName, playlistItems) => {
      setTransferLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Prepare data for backend
            const songsData = playlistItems.map(song => ({
                name: song.attributes.name,
                artist: song.attributes.artistName,
                album: song.attributes.albumName || "",
                duration_ms: song.attributes.durationInMillis || null,
                appleMusicId: song.id
            }));

            const response = await transferPlaylist(playlistName, songsData);

            const result = await response.json();
            if (response.ok) {
                setSuccess(true);
                console.log("Playlist transferred successfully:", result);
            } else {
                throw new Error(result.message || "Failed to transfer playlist");
            }
        } catch (err) {
            console.error("Error transferring playlist:", err);
            setError(err.message);
        } finally {
          setTransferLoading(false);
        }
    };

    return { transferPlaylistToSpotify, transferLoading, error, success };
}
