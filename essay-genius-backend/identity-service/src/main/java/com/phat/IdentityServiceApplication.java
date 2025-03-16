package com.phat;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

@SpringBootApplication
@ComponentScan(basePackages = {"com.phat", "com.phat.common"})
@EnableDiscoveryClient
public class IdentityServiceApplication {
    public static void main(String[] args)
    {
        SpringApplication.run(IdentityServiceApplication.class, args);
    }
}