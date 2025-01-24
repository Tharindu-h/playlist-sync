import { createContext, useContext, useState, useEffect } from "react";
import { fetchIsLoggedIn } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const [isAppleMusicLoggedIn, setIsAppleMusicLoggedIn] = useState(false);

  // const loginToSpotify = () => setIsSpotifyLoggedIn(true);
  const loginToAppleMusic = () => setIsAppleMusicLoggedIn(true);
  // const logoutFromSpotify = () => setIsSpotifyLoggedIn(false);
  const logoutFromAppleMusic = () => setIsAppleMusicLoggedIn(false);

  const checkSpotifyLogin = async () => {
    try {
      const response = await fetchIsLoggedIn();
      setIsSpotifyLoggedIn(response.data); 
    } catch (error) {
      console.error("Error checking Spotify login status:", error);
      setIsSpotifyLoggedIn(false);
    }
  };

  useEffect(() => {
    checkSpotifyLogin();
  }, []);
  
  return(
    <AuthContext.Provider
    value={{
      isSpotifyLoggedIn,
      isAppleMusicLoggedIn,
      // loginToSpotify,
      loginToAppleMusic,
      // logoutFromSpotify,
      logoutFromAppleMusic
    }}>
      { children }
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}