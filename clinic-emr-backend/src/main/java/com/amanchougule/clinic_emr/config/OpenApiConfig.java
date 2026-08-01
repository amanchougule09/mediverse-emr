package com.amanchougule.clinic_emr.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI clinicEmrOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MediVerse EMR API")
                        .description("REST API for the MediVerse Clinic Management and Electronic Medical Record System")
                        .version("v1.0.0")
                        .license(new License().name("MIT")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
