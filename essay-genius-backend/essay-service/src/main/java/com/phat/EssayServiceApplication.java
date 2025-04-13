package com.phat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableDiscoveryClient
@EnableMongoAuditing
@ComponentScan(basePackages = {"com.phat", "com.phat.common"})
public class EssayServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EssayServiceApplication.class);
    }
}