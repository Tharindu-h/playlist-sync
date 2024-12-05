import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [topSongs, setTopSongs] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/spotify/top-songs", { withCredentials: true })
            .then((response) => {
                setTopSongs(response.data);
            })
            .catch((error) => {
                console.error("Error fetching top songs:", error);
            });
    }, []);

    return (
        <div className="dashboard">
            <h1>Your Top 5 Songs</h1>
            <ul>
                {topSongs.map((song, index) => (
                    <li key={index}>
                        {song.name} by {song.artists.join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
