package com.example.playlist_sync_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/hello", "/login", "/oauth2/**", "/api/applemusic/token").permitAll() // Allow public access to /api/hello
                        .anyRequest().authenticated() // Secure all other endpoints
                )

                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("http://localhost:3000/dashboard", true)
                )
                .csrf().disable();
        return http.build();
    }
}
