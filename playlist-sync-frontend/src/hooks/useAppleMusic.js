/* global MusicKit */
import { useState } from "react";

export default function useAppleMusic() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userToken, setUserToken] = useState(null);

    const login = async () => {
        try {
            const music = MusicKit.getInstance();
            const token = await music.authorize();
            setUserToken(token);
            setIsLoggedIn(true);
            console.log("Apple Music Token:", token);
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
            console.log("Logged out of Apple Music");
        } catch (error) {
            console.error("Failed to logout from Apple Music:", error);
        }
    };

    return { isLoggedIn, userToken, login, logout };
}
