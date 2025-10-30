package com.online.shop.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIService {
	private final String AI_API_URL = "http://127.0.0.1:8000/";
	private RestTemplate restTemplate;
	
	public AIService(RestTemplate restTemplate) {
		this.restTemplate=restTemplate;
	}
	
	public String getResponse(String message) {
		String response=restTemplate.getForObject(AI_API_URL+"/ask?message="+message, String.class);
		return response;
	}
}
