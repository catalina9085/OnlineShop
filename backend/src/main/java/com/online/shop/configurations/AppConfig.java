package com.online.shop.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

@Configuration
public class AppConfig {
	
	 @Bean
	    public RestTemplate restTemplate() {
	        return new RestTemplate();
	    }

	     @Bean
	     public CommonsRequestLoggingFilter logFilter() {
	         CommonsRequestLoggingFilter filter = new CommonsRequestLoggingFilter();
	         filter.setIncludeQueryString(true);
	         filter.setIncludePayload(true);
	         //filter.setMaxPayloadLength(10000); // cât vrei să vezi din body
	         filter.setIncludeHeaders(true);
	         filter.setAfterMessagePrefix("REQUEST DATA: ");
	         return filter;
	     }
	
}
