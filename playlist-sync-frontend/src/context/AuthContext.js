import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const [isAppleMusicLoggedIn, setIsAppleMusicLoggedIn] = useState(false);

  const loginToSpotify = () => setIsSpotifyLoggedIn(true);
  const loginToAppleMusic = () => setIsAppleMusicLoggedIn(true);
  const logoutFromSpotify = () => setIsSpotifyLoggedIn(false);
  const logoutFromAppleMusic = () => setIsAppleMusicLoggedIn(false);
  
  return(
    <AuthContext.Provider
    value={{
      isSpotifyLoggedIn,
      isAppleMusicLoggedIn,
      loginToSpotify,
      loginToAppleMusic,
      logoutFromSpotify,
      logoutFromAppleMusic
    }}>
      { children }
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}