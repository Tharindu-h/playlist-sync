import { useState } from "react";
import { transferPlaylist } from "../api";
import useAppleMusic from "../hooks/useAppleMusic";

export default function usePlaylistTransfer() {
    const [transferLoading, setTransferLoading] = useState(false);
    const [transferError, setTransferError] = useState(null);
    const [newPlaylistId, setNewPlaylistId] = useState(null);
    const [newPlaylistName, setNewPlaylistName] = useState(null);
    const { 
        isLoggedIn, 
        searchAppleMusicSongs,
        createAppleMusicPlaylist,
        addSongsToAMPlaylist
    } = useAppleMusic();

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
            if (response.data.playlistId) {
              setNewPlaylistId(response.data.playlistId);
              setNewPlaylistName(response.data.playlistName);
            }
        } catch (err) {
            console.error("Error transferring playlist:", err);
            setTransferError(err.message);
        } finally {
          setTransferLoading(false);
        }
    };

    const transferPlaylistToApple = async (playlistName, playlistItems) => {
      if (!isLoggedIn) {
          setTransferError("Apple Music is not initialized or user is not logged in.");
          return;
      }

        setTransferLoading(true);
        setTransferError(null);
        
        try {
            const appleMusicSongIds = await searchAppleMusicSongs(playlistItems);
            if (appleMusicSongIds.length === 0) {
                throw new Error("No matching songs found on Apple Music.");
            }
            const newAMPlaylistId = await createAppleMusicPlaylist(playlistName);
            const addPlaylistItemsResponse = await addSongsToAMPlaylist(newAMPlaylistId, appleMusicSongIds);
            setNewPlaylistId(newAMPlaylistId);
            setNewPlaylistName(playlistName);
        } catch (error) {
            console.error(`error.message: ${error}`);
            setTransferError(error);
        } finally {
            setTransferLoading(false);
        }
  };

    return { transferPlaylistToSpotify, transferPlaylistToApple, transferLoading, transferError, setTransferError, newPlaylistId, setNewPlaylistId, newPlaylistName, setNewPlaylistName };
}


//example playlist id: "6HZSItUP5ThyG1dWfWtaXJ" 