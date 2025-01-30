package com.example.playlist_sync_backend.controller;

import com.example.playlist_sync_backend.service.SpotifyService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/spotify")
public class SpotifyController {

    private final SpotifyService spotifyService;

    public SpotifyController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    @GetMapping("/token")
    public String getSpotifyToken(@AuthenticationPrincipal OAuth2User user) {
        String token = this.spotifyService.getAccessToken(user.getName());
        return "Access token: " + token;
    }

    @GetMapping("/playlists")
    public String getPlaylists(@AuthenticationPrincipal OAuth2User user) {
        return this.spotifyService.fetchUserPlaylists(user.getName());
    }

    @GetMapping("/top5songs")
    public String getTop5Songs(@AuthenticationPrincipal OAuth2User user) {
        return this.spotifyService.fetchUserTop5Songs(user.getName());
    }

    @GetMapping("/playlists/{playlistId}/items")
    public String getPlaylistItems(@AuthenticationPrincipal OAuth2User user,
                                   @PathVariable String playlistId,
                                   @RequestParam(required = false) String nextUrl) {

        return this.spotifyService.fetchPlaylistItems(user.getName(), playlistId, nextUrl);
    }

    @GetMapping("/isLoggedIn")
    public boolean isLoggedIn(@AuthenticationPrincipal OAuth2User user) {
        return user != null;
    }

    @PostMapping("/transfer-to-spotify")
    public String transferPlaylistToSpotify(@AuthenticationPrincipal OAuth2User user, @RequestBody PlaylistTransferRequest request) {
        List<String> spotifySongIds = new ArrayList<>();
        System.out.println("Apple music playlist name: " + request.getPlaylistName());
        for (Song song : request.getSongs()) {
            System.out.println("curr song: " + song.name + " by: " + song.artist);
            JsonNode spotifyMatch = spotifyService.searchSpotifySong(user.getName(), song.getName(), song.getArtist());
            if (spotifyMatch != null && spotifyMatch.get("tracks").get("items").size() > 0) {
                String spotifySongId = spotifyMatch.get("tracks").get("items").get(0).get("id").asText();
                spotifySongIds.add("spotify:track:" + spotifySongId);
            }
        }

        // Create a new Spotify playlist and add songs
//        String playlistId = spotifyService.createSpotifyPlaylist(user.getName(), request.getPlaylistName());
//        spotifyService.addSongsToPlaylist(user.getName(), playlistId, spotifySongIds);

        return "Playlist transferred successfully to Spotify!";
    }

    public static class PlaylistTransferRequest {
        private String playlistName;
        private List<Song> songs;

        public String getPlaylistName() {
            return playlistName;
        }

        public void setPlaylistName(String playlistName) {
            this.playlistName = playlistName;
        }

        public List<Song> getSongs() {
            return songs;
        }

        public void setSongs(List<Song> songs) {
            this.songs = songs;
        }
    }

    public static class Song {
        private String name;
        private String artist;
        private String album;
        private Integer duration_ms;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getArtist() { return artist; }
        public void setArtist(String artist) { this.artist = artist; }

        public String getAlbum() { return album; }
        public void setAlbum(String album) { this.album = album; }

        public Integer getDuration_ms() { return duration_ms; }
        public void setDuration_ms(Integer duration_ms) { this.duration_ms = duration_ms; }
    }
}
