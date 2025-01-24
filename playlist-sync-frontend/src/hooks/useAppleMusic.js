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
    }, [userToken]);


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

    return { isLoggedIn, userToken, login, logout, recentSongs, fetchRecentSongs, userPlaylists, fetchUserPlaylists, 
      fetchPlaylistItems, playlistItems, loadMoreItems, nextPageUrl, loading };
}
