package com.examprep.service;

import com.examprep.config.OpenAIConfig;
import com.examprep.exception.OpenAIException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OpenAIService {

    private static final Logger log = LoggerFactory.getLogger(OpenAIService.class);
    private static final String OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

    private final OpenAIConfig openAIConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public OpenAIService(OpenAIConfig openAIConfig, RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.openAIConfig = openAIConfig;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public boolean isConfigured() {
        String key = openAIConfig.getApiKey();
        return key != null && !key.isBlank() && key.trim().length() > 10;
    }

    public String callOpenAI(String systemPrompt, String userPrompt) {
        if (!isConfigured()) {
            throw new OpenAIException("OpenAI API key is not configured or empty.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAIConfig.getApiKey().trim());

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", openAIConfig.getModel());

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userPrompt));
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.3);

        // Request JSON object format when asking for JSON
        Map<String, String> responseFormat = new HashMap<>();
        responseFormat.put("type", "json_object");
        requestBody.put("response_format", responseFormat);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        int maxRetries = 3;
        long backoffMs = 1000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                ResponseEntity<String> response = restTemplate.exchange(
                        OPENAI_CHAT_URL,
                        HttpMethod.POST,
                        entity,
                        String.class
                );

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode choices = root.path("choices");
                    if (choices.isArray() && !choices.isEmpty()) {
                        return choices.get(0).path("message").path("content").asText();
                    }
                    throw new OpenAIException("Empty choices in OpenAI response.");
                }
            } catch (HttpClientErrorException.TooManyRequests e) {
                log.warn("OpenAI rate limited (429) on attempt {}/{}", attempt, maxRetries);
                if (attempt == maxRetries) {
                    throw new OpenAIException("OpenAI API rate limit exceeded. Please try again shortly.", e);
                }
                sleep(backoffMs);
                backoffMs *= 2;
            } catch (ResourceAccessException e) {
                log.warn("OpenAI timeout/connection issue on attempt {}/{}: {}", attempt, maxRetries, e.getMessage());
                if (attempt == maxRetries) {
                    throw new OpenAIException("OpenAI connection timed out.", e);
                }
                sleep(backoffMs);
                backoffMs *= 2;
            } catch (HttpServerErrorException e) {
                log.warn("OpenAI server error ({}) on attempt {}/{}", e.getStatusCode(), attempt, maxRetries);
                if (attempt == maxRetries) {
                    throw new OpenAIException("OpenAI service temporarily unavailable (" + e.getStatusCode() + ")", e);
                }
                sleep(backoffMs);
                backoffMs *= 2;
            } catch (Exception e) {
                log.error("OpenAI call failed: {}", e.getMessage(), e);
                throw new OpenAIException("Failed to call OpenAI API: " + e.getMessage(), e);
            }
        }

        throw new OpenAIException("Failed to get response from OpenAI after " + maxRetries + " attempts.");
    }

    private void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }
    }
}

