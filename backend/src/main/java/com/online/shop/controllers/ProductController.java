package com.online.shop.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online.shop.dtos.AddReviewRequest;
import com.online.shop.dtos.Filter;
import com.online.shop.entities.Category;
import com.online.shop.entities.Product;
import com.online.shop.entities.ProductImage;
import com.online.shop.entities.Review;
import com.online.shop.entities.User;
import com.online.shop.services.ProductService;

@RestController
@RequestMapping("/user/products")
public class ProductController {
	private ProductService productService;
	
	public ProductController(ProductService productService) {
		this.productService=productService;
	}
	
	@GetMapping
	public ResponseEntity<List<Product>> getAllProducts(Principal principal){
		List<Product> products = productService.getAllProducts(principal);
	    return ResponseEntity.ok(products);
	}
	
	
	@GetMapping("/reviews/{productId}")
	public ResponseEntity<Object> getReviews(@PathVariable Long productId){
			List<Review> list=productService.getReviews(productId);
			return ResponseEntity.ok(list);
	}
	
	@PostMapping("/reviews")
	public ResponseEntity<String> addReview(@RequestBody AddReviewRequest request,Principal principal){
		productService.addReview(request,principal);
		return ResponseEntity.ok("Review successfully added!");
	}
	
	@GetMapping("/{productId}")
	public ResponseEntity<Map<String, Object>> getProduct(@PathVariable Long productId,Principal principal){
		List<Product> recommended=productService.getSimilarProducts(productId);
		Product product=productService.getProductById(productId,principal);
		return ResponseEntity.ok(Map.of("product",product,"recommended",recommended));
	}
	
	@GetMapping("/getPictureRequest/{picId}")
	public ResponseEntity<ProductImage> getPicture(@PathVariable Long picId){
		return ResponseEntity.ok(productService.getImage(picId));
	}
	
	@GetMapping("/getUser")
	public ResponseEntity<String> getUser(Principal principal){
		return ResponseEntity.ok(principal.getName());
	}
	
	@GetMapping("/getUser1")
	public ResponseEntity<User> getUser1(Principal principal){
		return ResponseEntity.ok(productService.getUser(principal));
	}
	
	@GetMapping("/userId")
	public ResponseEntity<Long> getUserId(Principal principal){
		return ResponseEntity.ok(productService.getUser(principal).getId());
	}
	
	@GetMapping("categories")
	public ResponseEntity<List<Category>> getCategories() {
		return ResponseEntity.ok(productService.getCategories());
	}

	@PostMapping("/filter")
	public ResponseEntity<List<Product>> filterProducts(@RequestBody Filter filter,Principal principal) {
	    return ResponseEntity.ok(productService.filterProducts(filter,principal));
	}

//	@PostMapping("/click")
//	public ResponseEntity<String> saveClick(Principal principal,@RequestBody Map<String,Long> req){
//		productService.saveClick(principal, req.get("productId"));
//		return ResponseEntity.ok("Click saved!");
//	}
	
	@GetMapping("/recommended")
	public ResponseEntity<List<Product>> getRecommended(Principal principal){
		return ResponseEntity.ok(productService.getRecommended(principal));
	}
}

