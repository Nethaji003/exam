package com.examprep.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(CorsConfig.class);

    @Value("${cors.allowed-origins:}")
    private String customAllowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        List<String> patterns = new ArrayList<>();

        // 1. Localhost on any port (Vite dev 5173, 5174, preview 4173, etc.)
        patterns.add("http://localhost:*");
        patterns.add("http://127.0.0.1:*");

        // 2. Vercel deployment domains (production & preview branches)
        patterns.add("https://*.vercel.app");

        // 3. Custom frontend domain(s) from environment variable (e.g. custom domain)
        if (customAllowedOrigins != null && !customAllowedOrigins.isBlank()) {
            Arrays.stream(customAllowedOrigins.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .forEach(patterns::add);
        }

        log.info("Configured CORS origin patterns: {}", patterns);

        registry.addMapping("/**")
                .allowedOriginPatterns(patterns.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
