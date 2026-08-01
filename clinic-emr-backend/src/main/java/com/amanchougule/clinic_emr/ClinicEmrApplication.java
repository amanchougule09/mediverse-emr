package com.amanchougule.clinic_emr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class ClinicEmrApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClinicEmrApplication.class, args);
	}
}
