package com.online.shop.services;

import java.security.Principal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.online.shop.configurations.ResourceNotFoundException;
import com.online.shop.entities.CartItem;
import com.online.shop.entities.Product;
import com.online.shop.entities.Shipment;
import com.online.shop.entities.ShoppingCart;
import com.online.shop.entities.User;
import com.online.shop.repositories.CartItemRepo;
import com.online.shop.repositories.CartRepository;
import com.online.shop.repositories.ProductRepository;
import com.online.shop.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class CartService {
	private final ProductRepository productRepo;
	private final CartRepository cartRepo;
	private final UserRepository userRepo;
	private final CartItemRepo cartItemRepo;
	
//	public CartService(ProductRepository productRepo,CartRepository cartRepo,UserRepository userRepo,CartItemRepo cartItemRepo) {
//		this.productRepo=productRepo;
//		this.cartRepo=cartRepo;
//		this.userRepo=userRepo;
//		this.cartItemRepo=cartItemRepo;
//	}
	public User getUser(Principal principal) {
		return userRepo.findByUsername(principal.getName()).orElseThrow(()->new ResourceNotFoundException("User not found!"));
	}
	
	public List<CartItem> getCartItems(Principal principal) {
		List<CartItem> list=getUser(principal).getCart().getItems();
		return list;
	}
	
	public void addProductToCart(Long productId,Principal principal) {
		User user=getUser(principal);
		CartItem item=cartItemRepo.findByCartIdAndProductId(user.getCart().getId(), productId).orElse(null);
		Product product=productRepo.findById(productId).orElseThrow(()->new ResourceNotFoundException("Product not found!"));
		if(item!=null) {
			int newQuantity=item.getQuantity()+1;
			if(newQuantity<=product.getStock()) {
				item.setQuantity(newQuantity);
				cartItemRepo.save(item);
			}
			else {
	            throw new IllegalArgumentException("Quantity exceeds available stock");
			}
		}
		else {
			CartItem newItem=new CartItem(product,1,user.getCart());
			cartItemRepo.save(newItem);
		}
	}
	
	public void deleteItemFromCart(Principal principal,Long itemId) {
		User user=getUser(principal);
		ShoppingCart cart=user.getCart();
		cartItemRepo.deleteById(itemId);
	}
	
	
//	public Double getCartTotal(Principal principal) {
//		ShoppingCart cart=cartRepo.findByUser(getUser(principal)).get();
//		double rez=0;
//		for(CartItem item: cart.getItems()) {
//			Product product=item.getProduct();
//			double price=product.getFinalPrice();
//			rez += price* item.getQuantity();
//		}
//		if(rez==0) return 0.0;
//		if(rez<300) rez+=15;
//		return Double.valueOf(rez);
//	}
//	
	
	public void updateProductQuantity(Principal principal,Long itemId,int quantity) {
		CartItem item=cartItemRepo.findById(itemId).orElseThrow(()->new ResourceNotFoundException("Item not found!"));
		if(quantity>=1 && quantity<=item.getProduct().getStock()) {
			item.setQuantity(quantity);
			cartItemRepo.save(item);
		}
		else {
			throw new IllegalArgumentException("Quantity exceeds available stock");
		}
	}
	
	
	public Shipment getShipmentDetails(Principal principal) {
		User user=getUser(principal);
		return user.getShipment();
	}
	
	
//	public double getItemTotalPrice(Long itemId) {
//		CartItem item=cartItemRepo.findById(itemId).orElseThrow(()->new ResourceNotFoundException("Item not found!"));
//		return item.getQuantity()*item.getProduct().getFinalPrice();
//	}
	
	
}