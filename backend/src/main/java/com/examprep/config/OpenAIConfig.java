package com.examprep.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class OpenAIConfig {

    private static final Logger log = LoggerFactory.getLogger(OpenAIConfig.class);

    @Value("${openai.api-key:}")
    private String apiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    @Value("${openai.timeout:30000}")
    private int timeout;

    @Bean
    public RestTemplate openAiRestTemplate() {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("OpenAI API key is not configured. AI features will use fallback mode.");
        }
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(timeout);
        factory.setReadTimeout(timeout);
        return new RestTemplate(factory);
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getModel() {
        return model;
    }

    public int getTimeout() {
        return timeout;
    }
}
