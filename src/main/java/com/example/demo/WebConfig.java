package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Autorise tous les chemins de l'API
                        .allowedOrigins("*") // Autorise toutes les provenances (y compris localhost:63342)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Autorise toutes les actions
                        .allowedHeaders("*"); // Autorise tous les en-têtes
            }
        };
    }
}
