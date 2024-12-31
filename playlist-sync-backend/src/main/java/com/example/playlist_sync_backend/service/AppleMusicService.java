package com.example.playlist_sync_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AppleMusicService {
    private final WebClient webClient;
    private final TokenService tokenService;

    public AppleMusicService(WebClient.Builder webClientBuilder, TokenService tokenService) {
        this.tokenService = tokenService;
        this.webClient = webClientBuilder.baseUrl("https://api.music.apple.com/v1").build();
    }

    public String test() {
        String token = tokenService.getAppleMusicToken();

        return webClient.get()
                .uri("/catalog/us/songs/203709340")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
