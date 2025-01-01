package com.example.playlist_sync_backend.controller;

import com.example.playlist_sync_backend.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applemusic")
public class AppleMusicTokenController {

    private final TokenService tokenService;

    @Autowired
    public AppleMusicTokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping("/token")
    public String getDeveloperToken() {
        return tokenService.generateAppleMusicToken();
    }
}
