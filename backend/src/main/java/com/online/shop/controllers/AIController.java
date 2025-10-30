package com.online.shop.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.online.shop.services.AIService;

@RestController
@RequestMapping("/user/ai")
public class AIController {
	
	private AIService aiService;
	
	public AIController(AIService aiService) {
		this.aiService=aiService;
	}
	
	@GetMapping("/ask")
	public ResponseEntity<String> getResponse(@RequestParam String message){
		return ResponseEntity.ok(aiService.getResponse(message));
	}

}
