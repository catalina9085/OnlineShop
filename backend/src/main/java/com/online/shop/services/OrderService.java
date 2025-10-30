package com.online.shop.services;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.online.shop.components.Amount;
import com.online.shop.components.OrderDTO;
import com.online.shop.components.OrderResponseDTO;
import com.online.shop.components.OrderResponseDTO.Link;
import com.online.shop.components.PayPalAppContextDTO;
import com.online.shop.components.PayPalHttpClient;
import com.online.shop.components.PurchaseUnit;
import com.online.shop.configurations.ResourceNotFoundException;
import com.online.shop.entities.CartItem;
import com.online.shop.entities.Order;
import com.online.shop.entities.OrderProduct;
import com.online.shop.entities.Product;
import com.online.shop.entities.ShoppingCart;
import com.online.shop.entities.User;
import com.online.shop.repositories.CartItemRepo;
import com.online.shop.repositories.CartRepository;
import com.online.shop.repositories.OrderRepository;
import com.online.shop.repositories.ProductRepository;
import com.online.shop.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
	private final ProductRepository productRepo;
	private final CartRepository cartRepo;
	private final UserRepository userRepo;
	private final CartItemRepo cartItemRepo;
	private final PayPalHttpClient client;
	private final OrderRepository orderRepo;
	private final NotificationsService notifService;
	
	/*public OrderService(ProductRepository productRepo,CartRepository cartRepo,UserRepository userRepo,CartItemRepo cartItemRepo,PayPalHttpClient client,OrderRepository orderRepo,NotificationsService notifService) {
		this.productRepo=productRepo;
		this.cartRepo=cartRepo;
		this.userRepo=userRepo;
		this.cartItemRepo=cartItemRepo;
		this.client=client;
		this.orderRepo=orderRepo;
		this.notifService=notifService;
	}*/
	
	public User getUserOrThrow(Principal principal) {
		return userRepo.findByUsername(principal.getName()).orElseThrow(()->new ResourceNotFoundException("User not found!"));
	}
	
	private Product getProductOrThrow(Long productId) {
	    return productRepo.findById(productId)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
	}
	
	private Order getOrderOrThrow(Long orderId) {
	    return orderRepo.findById(orderId)
	            .orElseThrow(() -> new ResourceNotFoundException("Order not found!"));
	}
	
	public List<Order> getOrders(Principal principal){
		User user=getUserOrThrow(principal);
		return user.getOrders();
	}
	
	public Order getOrderById(Long orderId) {
		 return getOrderOrThrow(orderId);
	}
	
//	private void setOrderProductImage(OrderProduct ordProd, Product product) {
//	    if (product.getImages() != null && !product.getImages().isEmpty()) {
//	        var image = product.getImages().get(0);
//	        ordProd.setSavingOption(image.getSavingOption());
//	        ordProd.setName(image.getName());
//	        if (image.getSavingOption() == 0) {
//	            ordProd.setPublic_id(image.getPublic_id());
//	            ordProd.setUrl(image.getUrl());
//	        } else {
//	        	ordProd.setImageBase64(Base64.getEncoder().encodeToString(image.getData()));
//	        }
//	    }
//	}
	
	public Long createOrder(Principal principal) {
		User user=getUserOrThrow(principal);
		ShoppingCart cart=user.getCart();
		
		if(cart.getItems().isEmpty()) {
	        throw new IllegalStateException("Cannot create order: cart is empty");
	    }
		
		Order order=new Order(user,getCartTotal(principal),"PENDING",LocalDate.now());
		
		cart.getItems().forEach(item->order.addProduct(new OrderProduct(item.getProduct(), item.getQuantity(), order)));
		
		orderRepo.save(order);
		//nu e nevoie sa adaugam manual in lista de la user,pt ca order are foreign key la user iar in urmatoarea sesiune va face parte din acea lista
		//user.getOrders().add(order);
		//userRepo.save(user);
		//Long id=user.getOrders().get(user.getOrders().size()-1).getId();  //id-ul order-ului creat
		updateProductsQuantity(order.getId());
		return order.getId();
	}
	
	public String placeOrder(Principal principal,Long orderId) throws Exception {
		Order order=getOrderOrThrow(orderId);
		
		Amount amount=new Amount("EUR",String.format("%.2f",order.getTotal()*0.201));
		PurchaseUnit unit=new PurchaseUnit(amount);
			
		PayPalAppContextDTO context=new PayPalAppContextDTO(
				"OnlineShop",
				"BILLING",
				"http://localhost:4200/cart/payment-success/"+orderId,
				"http://localhost:4200/cart/payment-cancelled/"+orderId
		);
		//PayPalAppContextDTO context=new PayPalAppContextDTO("OnlineShop","BILLING","https://online--shop-485507e5e9cf.herokuapp.com/user/cart/successfulPayment/"+orderId+"/","https://online--shop-485507e5e9cf.herokuapp.com/user/cart/canceledPayment/"+orderId+"/");

		OrderDTO orderDTO=new OrderDTO("CAPTURE",Collections.singletonList(unit),context);
		OrderResponseDTO response=client.createOrder(orderDTO);
		//log.info("PayPal Response: {}", response);
		
		List<Link> links=response.getLinks();
		return links.stream()
				.filter(link->"approve".equals(link.getRel()))
				.map(Link::getHref)
				.findFirst()
				.orElseThrow(() -> new IllegalStateException("Approval link not found from PayPal"));
	}
	
	//comanda anulata
	@Transactional
	public void removeOrder(Principal principal,Long orderId) {
		Order order = getOrderOrThrow(orderId);
		User user=order.getUser();
		if(order.getStatus().equals("PENDING")) {
			List<Product> productsToUpdate=order.getProducts().stream()
					.map(op -> {
						Product p = getProductOrThrow(op.getProductId());
			            p.setStock(p.getStock() + op.getQuantity());
			            p.setSales((p.getSales() != null ? p.getSales()-op.getQuantity() : 0L) - op.getQuantity());
			            return p;
			        })
					.toList();
			productRepo.saveAll(productsToUpdate);
			orderRepo.delete(order);
			
			//se va actualiza singura lista
//			user.getOrders().remove(order);
//			userRepo.save(user);
		}
	}
	
	public void notifyAboutPendingOrder(Principal principal,Long orderId) {
		notifService.notifyAboutPendingOrder(principal,orderId);
	}
	
	public void updateOrderToPaid(Long orderId,Principal principal) {
		Order order = getOrderOrThrow(orderId);
		User user=order.getUser();
		
		order.setStatus("PAID");
		orderRepo.save(order);
		
		ShoppingCart cart = user.getCart();
		cartItemRepo.deleteAll(cart.getItems());
	   
	    increaseProductsSales(order.getProducts());
		notifService.notifyAboutPaidOrder(principal, orderId);	
	}
	
//	public void updateProductQuantity(Principal principal,Long itemId,int quantity) {
//		CartItem item=cartItemRepo.findById(itemId).orElseThrow(()->new ResourceNotFoundException("Item not found!"));
//		if(quantity>=1 && quantity<=item.getProduct().getStock()) {
//			item.setQuantity(quantity);
//			userRepo.save(getUser(principal));
//		}
//	}
	
//	public void clearCart(Principal principal) {
//		User user=getUserOrThrow(principal);
//		ShoppingCart cart=cartRepo.findByUser(user).get();
//		cart.getItems().clear();
//		userRepo.save(user);
//	}
	
	
	public void increaseProductsSales(List<OrderProduct> orderProducts) {
		for(OrderProduct orderProduct:orderProducts) {
			Product product=productRepo.findById(orderProduct.getProductId()).orElseThrow(()->new ResourceNotFoundException("Product not found!"));
			if(product.getSales()==null) product.setSales(0L);
			product.setSales(product.getSales()+orderProduct.getQuantity());
			productRepo.save(product);
		}
	}
	
//	public void decreaseProductsSales(List<OrderProduct> orderProducts) {
//		for(OrderProduct orderProduct:orderProducts) {
//			Product product=productRepo.findById(orderProduct.getProductId()).orElseThrow(()->new ResourceNotFoundException("Product not found!"));
//			if(product.getSales()==null) {
//				product.setSales(0L);
//				return;
//			}
//			product.setSales(product.getSales()-1);
//			productRepo.save(product);
//		}
//	}
		
	public Double getCartTotal(Principal principal) {
		ShoppingCart cart=cartRepo.findByUser(getUserOrThrow(principal)).get();
		double rez=0;
		for(CartItem item: cart.getItems()) {
			Product product=item.getProduct();
			double price=product.getFinalPrice();
			rez += price* item.getQuantity();
		}
		if(rez==0) return 0.0;
		if(rez<300) rez+=15;
		return Double.valueOf(rez);
	}
		
		
	//cand comanda este plasata,cantitatea produselor cumparate trebuie scazuta
	public void updateProductsQuantity(Long orderId) {
		Order order=orderRepo.findById(orderId).orElseThrow(()->new ResourceNotFoundException("Order not found!"));
		User user=order.getUser();
			
		for(OrderProduct orderProd:order.getProducts()) {
			Product product=productRepo.findById(orderProd.getProductId()).get();
			product.setStock(product.getStock()-orderProd.getQuantity());
			productRepo.save(product);
		}
		userRepo.save(user);
	}
		
	//se sterg dupa o zi
	@Scheduled(fixedRate = 1800000) 
	@Transactional
	public void cleanupPendingOrders() {
		List<Order> pendingOrders = orderRepo.findByStatus("PENDING");
		for (Order order : pendingOrders) {
			if (order.getCreatedAt().isBefore(LocalDate.now())) {
				for(OrderProduct orderProd:order.getProducts()) {
		    		Product product=productRepo.findById(orderProd.getProductId()).get();
		    		product.setStock(product.getStock()+orderProd.getQuantity());
		    		productRepo.save(product);
		    	}
		        order.setStatus("CANCELLED");
		        orderRepo.save(order);
		    }
		}
	}
		
	
}
