import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api/spotify",
    withCredentials: true,
});

export const fetchTopSongs = () => API.get("/top5songs");

export const fetchPlaylists = () => API.get("/playlists");

export const fetchPlaylistItems = (playlistId) => API.get(`/playlists/${playlistId}/items`);

export const fetchNextPage = (playlistId, nextUrl) =>
    API.get(`/playlists/${playlistId}/items?nextUrl=${encodeURIComponent(nextUrl)}`);

export const fetchIsLoggedIn = () => API.get("/isLoggedIn");

// export const transferPlaylist = (playlistName, playlistItems)
export const transferPlaylist = (playlistName, playlistItems) =>
    API.post("/transfer-to-spotify", { playlistName, songs: playlistItems });

// export const transferPlaylist = async (playlistName, playlistItems) => {
//   try {
//       const response = await fetch("http://localhost:8080/api/spotify/transfer-to-spotify", {
//           method: "POST",
//           credentials: "include", // Equivalent to withCredentials: true in axios
//           headers: {
//               "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ playlistName, songs: playlistItems }),
//       });

//       if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       return await response.json(); // Assuming the backend returns JSON
//   } catch (error) {
//       console.error("Error transferring playlist:", error);
//       throw error;
//   }
// };