package com.phat.common.configs;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "grpc")
@Data
public class GrpcSecurityProperties {
    private List<String> publicMethods = new ArrayList<>();
}
