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
        createAppleMusicPlaylist 
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
            // const appleMusicIds = await searchAppleMusicSongs(playlistItems);
            // if (appleMusicIds.length === 0) {
                // throw new Error("No matching songs found on Apple Music.");
            // }
            // console.log(`ids: ${appleMusicIds}`)
            // console.log(`after throwing err`);
            const playlistResponse = await createAppleMusicPlaylist(playlistName);
            // setNewPlaylistId(playlistResponse.id);
            // setNewPlaylistName(playlistName);
        } catch (error) {
          console.log(`error.message: ${error.message}`);
            setTransferError(error.message);
        } finally {
            setTransferLoading(false);
        }
  };

    return { transferPlaylistToSpotify, transferPlaylistToApple, transferLoading, transferError, setTransferError, newPlaylistId, setNewPlaylistId, newPlaylistName, setNewPlaylistName };
}


//example playlist id: "6HZSItUP5ThyG1dWfWtaXJ" 