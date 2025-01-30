package com.example.playlist_sync_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;

@Service
public class SpotifyService {

    private final OAuth2AuthorizedClientService authorizedClientService;
    private final WebClient webClient;

    public SpotifyService(OAuth2AuthorizedClientService authorizedClientService, WebClient.Builder webClientBuilder) {
        this.authorizedClientService = authorizedClientService;
        this.webClient = webClientBuilder.baseUrl("https://api.spotify.com/v1")
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024)) // 16 MB buffer size
                        .build())
                .build();
    }

    public String getAccessToken(String userName) {
        OAuth2AuthorizedClient client = this.authorizedClientService
                .loadAuthorizedClient("spotify", userName);
        return client.getAccessToken().getTokenValue();
    }

    public String fetchUserPlaylists(String userName) {
        String token = getAccessToken(userName);

        return this.webClient.get()
                .uri("/me/playlists?limit=50")
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

    public String fetchPlaylistItems(String userName, String playlistID, String nextUrl) {
        String token = this.getAccessToken(userName);
        try {
            String uri = (nextUrl != null && nextUrl.startsWith("http"))
                    ? nextUrl
                    : "/playlists/" + playlistID + "/tracks?limit=50";
            System.out.println(uri);
            return  this.webClient.get()
                    .uri(uri)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error fetching user top songs: " + e.getMessage();
        }
    }

    public JsonNode searchSpotifySong(String userName, String songName, String artist) {
        String query = songName + " " + artist;
        String token = getAccessToken(userName);

        try {
            return this.webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/search")
                            .queryParam("q", query)
                            .queryParam("type", "track")
                            .queryParam("limit", "1")
                            .build())
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String createSpotifyPlaylist(String userName, String playlistName) {
        String token = getAccessToken(userName);
        try {
            JsonNode response = this.webClient.post()
                    .uri("/me/playlists")
                    .header("Authorization", "Bearer " + token)
                    .bodyValue("{\"name\": \"" + playlistName + "\", \"public\": false}")
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            return response.get("id").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void addSongsToPlaylist(String userName, String playlistId, List<String> songUris) {
        String token = getAccessToken(userName);
        try {
            this.webClient.post()
                    .uri("/playlists/" + playlistId + "/tracks")
                    .header("Authorization", "Bearer " + token)
                    .bodyValue("{\"uris\": " + songUris.toString() + "}")
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
