import { useState } from "react";
import { transferPlaylist } from "../api";

export default function usePlaylistTransfer() {
    const [transferLoading, setTransferLoading] = useState(false);
    const [transferError, setTransferError] = useState(null);
    const [newPlaylistId, setNewPlaylistId] = useState(null);

    const transferPlaylistToSpotify = async (playlistName, playlistItems) => {
        setTransferLoading(true);
        setTransferError(null);
        

        try {
            // Prepare data for backend
            const songsData = playlistItems.map(song => ({
                name: song.attributes.name,
                artist: song.attributes.artistName,
                album: song.attributes.albumName || "",
                duration_ms: song.attributes.durationInMillis || null,
                appleMusicId: song.id
            }));

            const response = await transferPlaylist(playlistName, songsData); // this returns the newly created spotify playlist id
            // get new playlist songs using usePlaylistItems()
            // set the view in spotify dashboard to PLAYLIST_ITEMS
            // display new playlist
            if (response.data.playlistId) {
              setNewPlaylistId(response.data.playlistId);
            }
        } catch (err) {
            // console.error("Error transferring playlist:", err);
            // setTransferError(err.message);
            // temp test to mock transfer completing successfully
            setNewPlaylistId(12345);
        } finally {
          setTransferLoading(false);
        }
    };

    return { transferPlaylistToSpotify, transferLoading, transferError, setTransferError, newPlaylistId };
}
