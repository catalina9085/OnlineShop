package com.online.shop.configurations;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private CustomUserDetailsService userDetailsService;
	
	public SecurityConfig(CustomUserDetailsService userDetailsService) {
		this.userDetailsService=userDetailsService;
	}
	
	 
	@Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
            .userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder())
            .and()
            .build();
    }
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests(request->request
				.requestMatchers("/auth/**","/js/**", "/css/**", "/images/**","/favicon.ico","/uploads/**","/").permitAll()
				.requestMatchers("/admin/**").hasRole("ADMIN")
				.anyRequest().authenticated()
				)
		.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("http://localhost:4200"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
            config.setAllowCredentials(true);
            return config;
        }))
			.csrf().disable()
			.formLogin(form -> form
		            .loginProcessingUrl("/auth/login") // endpoint-ul apelat de Angular
		            .successHandler((request, response, authentication) -> {
		            	String role = authentication.getAuthorities().iterator().next().getAuthority();
		            	Cookie cookie = new Cookie("userRole",role);
		            	cookie.setHttpOnly(false); // dacă vrei să fie accesibil din JS
		            	cookie.setPath("/");       // valabil pentru toate rutele
		                response.addCookie(cookie);
		                response.setStatus(HttpServletResponse.SC_OK);
		                response.setContentType("application/json");
		                response.getWriter().write("{\"message\":\"Login successful\"}");
		            })
		            .failureHandler((request, response, exception) -> {
		                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		                response.setContentType("application/json");
		                response.getWriter().write("{\"message\":\"Login failed\"}");
		            })
		            .permitAll()
		        )
			.logout().logoutUrl("/logout")
            .invalidateHttpSession(true)
            .clearAuthentication(true)
            .permitAll();
			return http.build();
    
	}
}
