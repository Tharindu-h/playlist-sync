package com.example.playlist_sync_backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

@Service
public class TokenService {

    @Value("${applemusic.teamId}")
    private String teamId;

    @Value("${applemusic.keyId}")
    private String keyId;

    @Value("${applemusic.privateKey}")
    private String privateKeyEnv;

    private String cachedToken;       // Store the token in memory
    private long tokenExpirationTime; // Store the token's expiration timestamp

    public synchronized String getAppleMusicToken() {
        long currentTime = System.currentTimeMillis() / 1000; // Current time in seconds

        // Check if the token is valid or expired
        if (cachedToken == null || currentTime >= tokenExpirationTime - 3600) {
            // Generate a new token if none exists or it's about to expire (1 hour buffer)
            cachedToken = generateAppleMusicToken();
            tokenExpirationTime = currentTime + 15777000; // 6 months
        }

        return cachedToken;
    }

    private String generateAppleMusicToken() {
        try {
            // Decode the base64 key
            byte[] keyBytes = Base64.getDecoder().decode(privateKeyEnv);

            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
            PrivateKey privateKey = KeyFactory.getInstance("EC").generatePrivate(spec);

            long now = System.currentTimeMillis() / 1000; // Current time in seconds

            return Jwts.builder()
                    .setHeaderParam("alg", "ES256")
                    .setHeaderParam("kid", keyId)
                    .setIssuer(teamId)
                    .setIssuedAt(new Date(now * 1000))
                    .setExpiration(new Date((now + 15777000) * 1000)) // 6 months in seconds
                    .signWith(privateKey, SignatureAlgorithm.ES256)
                    .compact();

        } catch (Exception e) {
            throw new RuntimeException("Error generating Apple Music token", e);
        }
    }
}
