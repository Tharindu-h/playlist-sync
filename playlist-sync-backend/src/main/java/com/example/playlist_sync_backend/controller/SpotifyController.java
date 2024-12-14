package com.example.playlist_sync_backend.controller;

import com.example.playlist_sync_backend.service.SpotifyService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public String getPlaylistItems(@AuthenticationPrincipal OAuth2User user, @PathVariable String playlistId) {
        return this.spotifyService.fetchPlaylistItems(user.getName(), playlistId);
    }

}
