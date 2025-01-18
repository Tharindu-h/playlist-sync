/* global MusicKit */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    // Initialize MusicKit on load
    useEffect(() => {
        const initializeMusicKit = async () => {
            if (!window.MusicKit) {
                console.error("MusicKit is not loaded.");
                return;
            }

            try {
                const music = MusicKit.getInstance();
                if (userToken) {
                    await music.authorize();
                    console.log("Apple Music re-authorized with stored token");
                }
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

            // Redirect to Apple Music Dashboard
            navigate("/apple-music-dashboard");
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
        try {
            const music = MusicKit.getInstance();
            const response = await music.api.music(`/v1/me/recent/played/tracks?types=songs&limit=5`);
            const songs = response.data?.data?.length ? response.data.data : []; 
            setRecentSongs(songs);
        } catch (error) {
            console.error("Failed to fetch top songs:", error);
            setRecentSongs([]); // Reset to empty array on error
        }
    }, []);

    const fetchUserPlaylists = useCallback(async () => {
        try {
            const music = MusicKit.getInstance();
            const response = await music.api.music(`/v1/me/library/playlists`);
            const playlists = response.data?.data?.length ? response.data.data : []; 
            setUserPlaylists(playlists);
        } catch (error) {
            console.error("Failed to fetch user playlists: ", error);
        }
    });

    return { isLoggedIn, userToken, login, logout, recentSongs, fetchRecentSongs, userPlaylists, fetchUserPlaylists };
}
