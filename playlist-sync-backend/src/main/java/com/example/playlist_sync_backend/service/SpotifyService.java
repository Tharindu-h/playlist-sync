package com.example.playlist_sync_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class SpotifyService {

    private final OAuth2AuthorizedClientService authorizedClientService;
    private final WebClient webClient;

    public SpotifyService(OAuth2AuthorizedClientService authorizedClientService, WebClient.Builder webClientBuilder) {
        this.authorizedClientService = authorizedClientService;
        this.webClient = webClientBuilder.baseUrl("https://api.spotify.com/v1").build();
    }

    public String getAccessToken(String userName) {
        OAuth2AuthorizedClient client = this.authorizedClientService
                .loadAuthorizedClient("spotify", userName);
        return client.getAccessToken().getTokenValue();
    }

    public String fetchUserPlaylists(String userName) {
        String token = getAccessToken(userName);

        return this.webClient.get()
                .uri("/me/playlists")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String fetchUserTop5Songs(String userName) {
        String token = getAccessToken(userName);
        try {
            return this.webClient.get()
                    .uri("/me/top/tracks?time_range=long_term&limit=5")
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error fetching user top songs: " + e.getMessage();
        }

    }
}
