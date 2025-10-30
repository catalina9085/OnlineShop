package com.online.shop.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online.shop.entities.Order;
import com.online.shop.services.OrderService;

@RestController
@RequestMapping("/user/orders")
public class OrderController {
	
	private OrderService orderService;
	
	public OrderController(OrderService orderService) {
		this.orderService=orderService;
	}
	
	@GetMapping
	public ResponseEntity<List<Order>> getOrders(Principal principal){
		List<Order> orders=orderService.getOrders(principal);
		return ResponseEntity.ok(orders);
	}
	
	@GetMapping("/{orderId}")
	public ResponseEntity<Order> getOrder(@PathVariable Long orderId){
		return ResponseEntity.ok(orderService.getOrderById(orderId));
	}
	
	@PostMapping
	public ResponseEntity<Long> createOrder(Principal principal){
		return ResponseEntity.ok(orderService.createOrder(principal));
	}
	
	@PostMapping("/{orderId}")
	public ResponseEntity<String> placeOrder(Principal principal,@PathVariable Long orderId) throws Exception{
		String link=orderService.placeOrder(principal,orderId);
		return ResponseEntity.ok(link);
	}
	
	@DeleteMapping("/{orderId}")
	public ResponseEntity<String> removeOrder(Principal principal,@PathVariable Long orderId){
		orderService.removeOrder(principal,orderId);
		return ResponseEntity.ok("Order successfully removed!");
	}
	
	@PostMapping("/{orderId}/payment-cancelled")
	public void notifyAboutPendingOrder(Principal principal,@PathVariable Long orderId) {
		orderService.notifyAboutPendingOrder(principal,orderId);
	}
	
	@PostMapping("/{orderId}/mark-paid")
	public ResponseEntity<String> updateOrderToPaid(Principal principal,@PathVariable Long orderId){
		orderService.updateOrderToPaid(orderId,principal);
		return ResponseEntity.ok("Quantity successfully updated!");
	}
	
	

}
