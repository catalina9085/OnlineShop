package com.online.shop.controllers;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online.shop.dtos.AddProductRequest;
import com.online.shop.entities.Order;
import com.online.shop.entities.Product;
import com.online.shop.entities.User;
import com.online.shop.services.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {
	
	private AdminService adminService;
	
	public AdminController(AdminService adminService) {
		this.adminService=adminService;
	}
	
	@PutMapping("/products/{productId}")
	public ResponseEntity<Product> editProduct(@ModelAttribute AddProductRequest request,@PathVariable Long productId) throws IOException{
		return ResponseEntity.ok(adminService.editProduct(productId, request));
	}
	
	@PostMapping("/products")
	public ResponseEntity<Product> addNewProduct(@ModelAttribute AddProductRequest request) throws IOException {
		return ResponseEntity.ok(adminService.addNewProduct(request));
	}
	
	@GetMapping("/products")
	public ResponseEntity<List<Product>> getAllProducts(){
		return ResponseEntity.ok(adminService.getAllProducts());
	}
	
	@GetMapping("/products/{productId}")
	public ResponseEntity<Object> getProduct(@PathVariable Long productId) {
		try {
			Product product=adminService.getProductById(productId);
			return ResponseEntity.ok(product);
		}catch(RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@DeleteMapping("/products/{productId}")
	public ResponseEntity<String> deletetProduct(@PathVariable Long productId) {
			adminService.deleteProduct(productId);
			return ResponseEntity.ok("Object successfully deleted!");
		
	}
	
	
	@DeleteMapping("/images/{productId}/{imageId}")
	public ResponseEntity<String> deleteImage(@PathVariable Long productId,@PathVariable Long imageId) {
		adminService.deleteImage(imageId,productId);
		return ResponseEntity.ok("Object successfully deleted!");
	
	}
	
//	@PostMapping("/editProductInfo")
//	public ResponseEntity<String> editProductInfo(@RequestBody HashMap<String,String> map){
//		adminService.editProductInfo(map);
//		return ResponseEntity.ok("Product info successfully changed!");
//	}
//	
//	@PostMapping("/addNewFiles/{savingOption}")
//	public ResponseEntity<String> addNewFiles(@RequestParam Long productId,@RequestParam List<MultipartFile> files,@PathVariable int savingOption){
//		try{
//			adminService.addNewFiles(productId,files,savingOption);
//			return ResponseEntity.ok("Files successfully added!");
//		}catch(IOException e) {
//			return ResponseEntity.badRequest().body(e.getMessage());
//		}
//	}
	
	@DeleteMapping("/reviews/{reviewId}")
	public ResponseEntity<String> deleteReview(@PathVariable Long reviewId){
		try{
			adminService.deleteReview(reviewId);
			return ResponseEntity.ok("Review successfully deleted!");
		}catch(RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/users")
	public ResponseEntity<List<User>> getAllUsers(){
		return ResponseEntity.ok(adminService.getAllUsers());
	}
	
	@PutMapping("/users/role/{userId}")
	public ResponseEntity<String> changeUserRole(@PathVariable Long userId) {
		adminService.changeRole(userId);
		return ResponseEntity.ok("Role successfully changed!");
	}
	
	@DeleteMapping("/users/{userId}")
	public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
		adminService.deleteUser(userId);
		return ResponseEntity.ok("User successfully deleted!");
	}
	
	@GetMapping("/orders")
	public ResponseEntity<List<Order>> getOrders(){
		return ResponseEntity.ok(adminService.getAllOrders());
	}
	
	@GetMapping("/overview")
	public ResponseEntity<Map<String,Object>> getOverview(){
		return ResponseEntity.ok(adminService.getOverview());
	}
	
}
