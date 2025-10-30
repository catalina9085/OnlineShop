package com.online.shop.services;

import java.security.Principal;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.online.shop.configurations.ResourceNotFoundException;
import com.online.shop.entities.Product;
import com.online.shop.entities.User;
import com.online.shop.entities.WishList;
import com.online.shop.repositories.CategoryRepository;
import com.online.shop.repositories.ProductRepository;
import com.online.shop.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishListService {
	private final ProductRepository productRepo;
	private final CategoryRepository categoryRepo;
	private final UserRepository userRepo;
	
//	public WishListService(ProductRepository productRepo,CategoryRepository categoryRepo, UserRepository userRepo) {
//		this.productRepo=productRepo;
//		this.categoryRepo=categoryRepo;
//		this.userRepo=userRepo;
//	}
	public User getUser(Principal principal) {
		return userRepo.findByUsername(principal.getName()).orElseThrow(()->new ResourceNotFoundException("User not found!"));
	}
	
	private Product getProductOrThrow(Long productId) {
	    return productRepo.findById(productId)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
	}
	
	public void addInWishList(Long productId,Principal principal) {
		User user=getUser(principal);
		Product product=getProductOrThrow(productId);
		//nu mai e nev de verificare daca e deja acolo,ca oricum am folosit Set
		user.getWishList().getProducts().add(product);
		userRepo.save(user);
	}
	
	public Set<Product> getWishListProducts(Principal principal){
		User user=getUser(principal);
		return user.getWishList().getProducts();
	}
	
	public void deleteFromWishList(Long productId,Principal principal) {
		WishList wishlist=getUser(principal).getWishList();
		Product product=getProductOrThrow(productId);
		wishlist.getProducts().remove(product);
		userRepo.save(getUser(principal));
	}
	
	public boolean isInWishlist(Principal principal,Long productId) {
		Product product=getProductOrThrow(productId);
		Set<Product> list=getUser(principal).getWishList().getProducts();
		return list.contains(product);
	}
}
