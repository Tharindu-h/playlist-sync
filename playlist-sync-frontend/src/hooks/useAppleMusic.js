/* global MusicKit */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function useAppleMusic() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Check localStorage for authentication state
        return localStorage.getItem("appleMusicToken") ? true : false;
    });
    const [userToken, setUserToken] = useState(() => {
        return localStorage.getItem("appleMusicToken") || null;
    });
    const [recentSongs, setRecentSongs] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [playlistItems, setPlaylistItems] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [musicKitReady, setMusicKitReady] = useState(false);
    const navigate = useNavigate();
    const { loginToAppleMusic } = useAuth();

    
    // Initialize MusicKit on load
    useEffect(() => {
        const initializeMusicKit = async () => {
            try {
                // Wait for MusicKit to be configured
                await window.musicKitReady;
            
                // Wait for MusicKit instance to become available
                const waitForInstance = () =>
                    new Promise((resolve, reject) => {
                        const interval = setInterval(() => {
                            const music = MusicKit.getInstance();
                            if (music) {
                                clearInterval(interval);
                                resolve(music);
                            }
                        }, 100); // Check every 100ms
                        setTimeout(() => {
                            clearInterval(interval);
                            reject(new Error("MusicKit instance did not become ready in time."));
                        }, 5000); // Timeout after 5 seconds
                    });
                  
                const music = await waitForInstance();
                  
                if (userToken) {
                    await music.authorize();
                    loginToAppleMusic();
                }
                setMusicKitReady(true); // Mark MusicKit as ready
            } catch (error) {
                console.error("Failed to re-authorize Apple Music:", error);
            }
        };
      
        initializeMusicKit();
    }, [userToken, loginToAppleMusic]);


    const login = async () => {
        try {
            const music = MusicKit.getInstance();
            const token = await music.authorize();
            setUserToken(token);
            setIsLoggedIn(true);
            localStorage.setItem("appleMusicToken", token); // Persist token
            console.log("Apple Music Token:", token);
            loginToAppleMusic();

            // Redirect to Dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error("Failed to login with Apple Music:", error);
        }
    };

    const logout = async () => {
        try {
            const music = MusicKit.getInstance();
            await music.unauthorize();
            setIsLoggedIn(false);
            setUserToken(null);
            setRecentSongs([]);
            localStorage.removeItem("appleMusicToken"); // Clear stored token
            console.log("Logged out of Apple Music");
        } catch (error) {
            console.error("Failed to logout from Apple Music:", error);
        }
    };

    const fetchRecentSongs = useCallback(async () => {
        if (!musicKitReady) return;
        try {
            const music = MusicKit.getInstance();
            const response = await music.api.music(`/v1/me/recent/played/tracks?types=songs&limit=5`);
            const songs = response.data?.data?.length ? response.data.data : []; 
            setRecentSongs(songs);
        } catch (error) {
            console.error("Failed to fetch top songs:", error);
            setRecentSongs([]); // Reset to empty array on error
        }
    }, [musicKitReady]);

    const fetchUserPlaylists = useCallback(async () => {
        if (!musicKitReady) return;
        try {
            const music = MusicKit.getInstance();
            const response = await music.api.music(`/v1/me/library/playlists`);
            const playlists = response.data?.data?.length ? response.data.data : []; 
            setUserPlaylists(playlists);
        } catch (error) {
            console.error("Failed to fetch user playlists: ", error);
        }
    }, [musicKitReady]);

    const fetchPlaylistItems = useCallback(async (playlistId) => {
      if (!musicKitReady) return;
      try {
          setLoading(true);
          const music = MusicKit.getInstance();
          const response = await music.api.music(`/v1/me/library/playlists/${playlistId}/tracks`);
          const items = response.data?.data?.length ? response.data.data : []; 
          const next = response.data?.next || null;
          setPlaylistItems(items);
          setNextPageUrl(next);
      } catch (error) {
          console.error("Failed to fetch playlist items: ", error);
          setPlaylistItems([]);
          setNextPageUrl(null);
      } finally {
          setLoading(false);
      }
    }, [musicKitReady]);

    const loadMoreItems = useCallback(async () => {
      if (!nextPageUrl || !musicKitReady) return;

      try {
          setLoading(true);
          const music = MusicKit.getInstance();
          const response = await music.api.music(nextPageUrl);
          const items = response.data?.data || [];
          const next = response.data?.next || null;
          setPlaylistItems((prev) => [...prev, ...items]);
          setNextPageUrl(next);
      } catch (error) {
          console.error("Failed to load more playlist items: ", error);
      } finally {
          setLoading(false);
      }
    }, [nextPageUrl, musicKitReady]);

    // TO_DO: for better search matches in the search query change the limit to 3-5
    // check if playlistItems[i].track.explicit if true look at the search results to find
    // a song that has searchResults.data?.[i]?.results?.songs?.data?.[0]?.attributes.contentRating==="explicit"
    const searchAppleMusicSongs = async (playlistItems) => {
      if (!musicKitReady) return [];
      try{
        const music = MusicKit.getInstance();
        let AMSongIds = [];
        for (let i = 0; i < playlistItems.length; i++) {
          const songName = playlistItems[i].track.name
                            .replace(/&/, "")
                            .replace(/ +/g, "+");
          const artists = playlistItems[i].track.artists
                          .map((artist) => artist.name)
                          .join("+")
                          .replace(/&/, "")
                          .replace(/ +/g, "+");
          const searchResults = await music.api.music(`/v1/catalog/us/search?term=${songName + '+' + artists}&types=songs&limit=1`);
          const result = searchResults.data?.results?.songs?.data?.[0]?.attributes 
                        ? searchResults.data.results?.songs.data[0].attributes
                        : null;
          if (result) {   AMSongIds.push(result.playParams.id);   }
        }
        return AMSongIds;
      }catch (error) {
        console.error("Error while searching for songs in Apple Music: ", error);
        throw `Error while searching for songs in Apple Music: ${error}`;
      }
    };

    const createAppleMusicPlaylist = async(playlistName) => {
      if (!musicKitReady || !playlistName) return;
      try {
        const music = MusicKit.getInstance();
        let LibraryPlaylistCreationRequest = {
          "attributes": {
            "description": "", // support transferring the description later,
            "name": `${playlistName}`
          }
        };
        const response = await music.api.music(`/v1/me/library/playlists`, null, {
          fetchOptions: {
            method: "POST",
            body: JSON.stringify(LibraryPlaylistCreationRequest),
            headers: { "Content-Type": "application/json" }
          }
        });
        return response.data?.data?.[0]?.id;
      } catch (error) {
        console.error(`Error while creating Apple Music Playlist: ${error}`);
        throw `Error while creating Apple Music Playlist: ${error}`;
      }
    }

    const addSongsToAMPlaylist = async(playlistId, songIds) => {
      if (!musicKitReady || !playlistId || songIds.length === 0) return;
      try {
        const music = MusicKit.getInstance();
        let songData = songIds.map((song) => {
          return {
            id: song,
            type: "songs"
          }
        });
        let LibraryPlaylistTracksRequest = {
          data: songData
        }
        const response = await music.api.music(`/v1/me/library/playlists/${playlistId}/tracks`, null, {
          fetchOptions: {
            method: "POST",
            body: JSON.stringify(LibraryPlaylistTracksRequest),
            headers: { "Content-Type": "application/json" }
          }
        });
        return response.response.ok;
      } catch (error) {
        console.error(`Error adding songs to playlist: ${error}`);
        throw `Error adding songs to playlist: ${error}`;
      }
    }

    return { isLoggedIn, userToken, login, logout, recentSongs, fetchRecentSongs, userPlaylists, fetchUserPlaylists, 
      fetchPlaylistItems, playlistItems, loadMoreItems, nextPageUrl, loading, searchAppleMusicSongs,
      createAppleMusicPlaylist, addSongsToAMPlaylist };
}


// playlistId = "p.5PG5588iEmplPW";
