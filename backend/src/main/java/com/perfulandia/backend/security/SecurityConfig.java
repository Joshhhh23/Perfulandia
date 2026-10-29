package com.perfulandia.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
@Configuration @EnableWebSecurity
public class SecurityConfig {
 private final JwtTokenFilter jwtTokenFilter; private final AuthenticationProvider authenticationProvider;
 public SecurityConfig(JwtTokenFilter filter, AuthenticationProvider provider) { this.jwtTokenFilter=filter; this.authenticationProvider=provider; }
 @Bean public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  return http.csrf(csrf->csrf.disable()).cors(cors->cors.configurationSource(corsConfigurationSource()))
   .headers(headers->headers.frameOptions(frame->frame.sameOrigin()))
   .authorizeHttpRequests(auth->auth
    .requestMatchers("/auth/**","/error","/actuator/health","/swagger-ui/**","/v3/api-docs/**").permitAll()
    .requestMatchers("/h2-console/**").permitAll()
    .requestMatchers("/api/admin/rabbitmq/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
    .requestMatchers("/api/perfumes/**").authenticated().anyRequest().permitAll())
   .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authenticationProvider(authenticationProvider).addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class).build();
 }
 @Bean CorsConfigurationSource corsConfigurationSource() {
  CorsConfiguration c=new CorsConfiguration(); c.setAllowedOrigins(List.of(System.getenv().getOrDefault("FRONTEND_ORIGIN","http://localhost:3000")));
  c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS")); c.setAllowedHeaders(List.of("Authorization","Content-Type")); c.setAllowCredentials(false);
  UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource(); s.registerCorsConfiguration("/**",c); return s;
 }
}
