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
    const [topSongs, setTopSongs] = useState([]);
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
            setTopSongs([]);
            localStorage.removeItem("appleMusicToken"); // Clear stored token
            console.log("Logged out of Apple Music");
        } catch (error) {
            console.error("Failed to logout from Apple Music:", error);
        }
    };

    const fetchTopSongs = useCallback(async () => {
        try {
            const music = MusicKit.getInstance();
            const response = await music.api.music(`/v1/me/recent/played/tracks?limit=5`);
            setTopSongs(response.data || []);
            console.log("Fetched Top Songs:", response.data);
        } catch (error) {
            console.error("Failed to fetch top songs:", error);
        }
    }, []);

    const fetchUserPlaylists = useCallback(async () => {
        try {
            const music = MusicKit.getInstance();
            const response = await music.api.music(`/v1/me/library/playlists`);
            setUserPlaylists(response.data || []);
            console.log("fetched user playlists:", response.data);
        } catch (error) {
            console.error("Failed to fetch user playlists: ", error);
        }
    });

    return { isLoggedIn, userToken, login, logout, topSongs, fetchTopSongs, userPlaylists, fetchUserPlaylists };
}
