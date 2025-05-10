package com.phat.infrastructure.security;

import com.phat.infrastructure.component.JwtDecoderIdentity;
import com.phat.infrastructure.component.JwtAuthenticationEntryPoint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import static com.phat.app.helper.Constants.MICROSERVICE_NAME;

@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig{
    String[] PUBLIC_ENDPOINTS = new String[] {
            "/verify-email-by-code",
            "/verify-email-by-token",
            "/send-email-verification",
            "/refresh-token",
            "/send-forgot-password",
            "/forgot-password",
            "/reset-password",
            "/sign-up",
            "/sign-in",
            "/sign-out",
            "/introspect",
            "/actuator/health",
            "/actuator/info",
            "/actuator/prometheus",
            "/actuator/metrics",
            "/api-docs/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/swagger-resources/**",
            "/favicon.ico",
    };

    @Value("${jwt.accessSignerKey}")
    private String accessSignerKey;

    @Qualifier("jwtDecoderIdentity")
    JwtDecoderIdentity customJwtDecoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpRequest) throws Exception {

        httpRequest.authorizeHttpRequests(request ->
        {
            request.requestMatchers(PUBLIC_ENDPOINTS)
                    .permitAll()
//                    .requestMatchers(HttpMethod.OPTIONS)
//                    .permitAll()
                    .anyRequest()
                    .permitAll();
            log.info("[{}]: Request: {}", MICROSERVICE_NAME, request);
        });

        httpRequest.oauth2ResourceServer(oauth2 -> oauth2.jwt(
                                jwtConfigurer -> jwtConfigurer
                                        .decoder(customJwtDecoder)
                                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint()))
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return httpRequest.build();
    }

//    @Bean
//    JwtDecoder customJwtDecoder() {
//        SecretKeySpec spec = new SecretKeySpec(accessSignerKey.getBytes(), "HS512");
//        return NimbusJwtDecoder
//                .withSecretKey(spec)
//                .macAlgorithm(MacAlgorithm.HS512)
//                .build();
//    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
