package com.example.playlist_sync_backend.controller;

import com.example.playlist_sync_backend.service.AppleMusicService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applemusic")
public class AppleMusicController {
    private final AppleMusicService appleMusicService;

    public AppleMusicController(AppleMusicService appleMusicService) {
        this.appleMusicService = appleMusicService;
    }

    @GetMapping("/test")
    public String getTest() {
        return this.appleMusicService.test();
    }
}
