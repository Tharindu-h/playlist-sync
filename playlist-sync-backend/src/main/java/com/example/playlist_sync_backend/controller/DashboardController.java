package com.example.playlist_sync_backend.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal OAuth2User user) {
        // Fetch user details from the OAuth2User object
        String displayName = user.getAttribute("display_name");
        String email = user.getAttribute("email");
        return "Welcome, " + displayName + "! Your email is " + email + ".";
    }
}
