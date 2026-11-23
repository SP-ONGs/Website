package com.spongs.api.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class GoogleTokenVerifier {
    public record GoogleUser(String sub, String name, String picture) {
    }

    private final String clientId;
    private final RestClient restClient = RestClient.create();

    public GoogleTokenVerifier(@Value("${GOOGLE_CLIENT_ID:}") String clientId) {
        this.clientId = clientId;
    }

    public GoogleUser verify(String idToken) {
        if (clientId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Google login is not configured");
        }

        Map<?, ?> body;
        try {
            body = restClient.get()
                    .uri("https://oauth2.googleapis.com/tokeninfo?id_token={token}", idToken)
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }

        if (body == null || !clientId.equals(body.get("aud")) || body.get("sub") == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }

        String name = body.get("name") == null ? "Anônimo" : String.valueOf(body.get("name"));
        String picture = body.get("picture") == null ? null : String.valueOf(body.get("picture"));

        return new GoogleUser(String.valueOf(body.get("sub")), name, picture);
    }
}