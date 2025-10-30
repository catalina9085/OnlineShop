package com.online.shop.controllers;


import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online.shop.entities.CartItem;
import com.online.shop.entities.Shipment;
import com.online.shop.services.CartService;

@RestController
@RequestMapping("/user/cart")
public class CartController {
	private CartService cartService;
	
	public CartController(CartService cartService) {
		this.cartService=cartService;
	}
	
	@GetMapping
	public ResponseEntity<List<CartItem>> getCartItems(Principal principal){
		return ResponseEntity.ok(cartService.getCartItems(principal));
	}
	
	@PostMapping("/{productId}")
	public ResponseEntity<String> addProductToCart(@PathVariable Long productId,Principal principal){
		cartService.addProductToCart(productId,principal);
		return ResponseEntity.ok("The product was added to cart!");
	}
	
	@DeleteMapping("/{itemId}")
	public ResponseEntity<String> deleteItemFromCart(Principal principal,@PathVariable Long itemId){
		cartService.deleteItemFromCart(principal,itemId);
		return ResponseEntity.ok("The product was deleted from the cart!");
	}
	
//	@GetMapping("/total")
//	public ResponseEntity<Double> getCartTotal(Principal principal){
//		return ResponseEntity.ok(cartService.getCartTotal(principal));
//	}
	
	@PutMapping("/{itemId}")
	public ResponseEntity<String> updateProductQuantity(Principal principal,@PathVariable Long itemId,@RequestBody Integer newQuantity){
		cartService.updateProductQuantity(principal,itemId,newQuantity.intValue());
		return ResponseEntity.ok("The product quantity is updated!");
	}
	
//	@DeleteMapping("/clearCart")
//	public ResponseEntity<String> clearCart(Principal principal){
//		cartService.clearCart(principal);
//		return ResponseEntity.ok("The cart has been cleared!");
//	}
	
	@GetMapping("/shipment")
	public ResponseEntity<Shipment> getShipmentDetails(Principal principal){
		Shipment shipment=cartService.getShipmentDetails(principal);
		return ResponseEntity.ok(shipment);
	}
	
	
//	@GetMapping("/itemTotalPrice/{itemId}")
//	public ResponseEntity<Double> getItemTotalPrice(@PathVariable Long itemId){
//		return ResponseEntity.ok(cartService.getItemTotalPrice(itemId));
//	}
	
		
}

