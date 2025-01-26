package com.example.playlist_sync_backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest
class PlaylistSyncBackendApplicationTests {

	@DynamicPropertySource
	static void configureProperties(DynamicPropertyRegistry registry) {
		registry.add("APPLE_MUSIC_TEAM_ID", () -> "test_value");
		registry.add("APPLE_MUSIC_KEY_ID", () -> "test_value");
		registry.add("APPLE_MUSIC_PRIVATE_KEY", () -> "test_value");
	}

	@Test
	void contextLoads() {
	}

}
