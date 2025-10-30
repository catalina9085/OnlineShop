package com.online.shop.services;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.online.shop.configurations.ResourceNotFoundException;
import com.online.shop.dtos.AddReviewRequest;
import com.online.shop.dtos.Filter;
import com.online.shop.entities.Category;
import com.online.shop.entities.Product;
import com.online.shop.entities.ProductClick;
import com.online.shop.entities.ProductImage;
import com.online.shop.entities.Review;
import com.online.shop.entities.User;
import com.online.shop.repositories.CategoryRepository;
import com.online.shop.repositories.ImageRepo;
import com.online.shop.repositories.ProductClickRepo;
import com.online.shop.repositories.ProductRepository;
import com.online.shop.repositories.ReviewRepository;
import com.online.shop.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class ProductService {
	private final ProductRepository productRepo;
	private final CategoryRepository categoryRepo;
	private final UserRepository userRepo;
	private final ImageRepo imageRepo;
	private final ProductClickRepo clickRepo;
	private final RestTemplate restTemplate;
	private final ReviewRepository reviewRepo;
	private final String AI_API_URL = "http://127.0.0.1:8000/";
	
	//public ProductService(RestTemplate restTemplate,ProductRepository productRepo,CategoryRepository categoryRepo, UserRepository userRepo,ImageRepo imageRepo,ProductClickRepo clickRepo,ReviewRepository reviewRepo) { this.productRepo=productRepo; this.categoryRepo=categoryRepo; this.userRepo=userRepo; this.imageRepo=imageRepo; this.restTemplate=restTemplate; this.clickRepo=clickRepo; this.reviewRepo=reviewRepo; }
	public User getUser(Principal principal) {
		return userRepo.findByUsername(principal.getName()).orElseThrow(()->new ResourceNotFoundException("User not found!"));
	}
	
	private Product getProductOrThrow(Long productId) {
	    return productRepo.findById(productId)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
	}
	
	public List<Product> getAllProducts(Principal principal) {
		User user=getUser(principal);
		List<Product> products=productRepo.findAll();
		return products.stream()
			.peek(product->product.setInWishlist(user.getWishList().getProducts().contains(product)))
			.collect(Collectors.toList());
	}
	
	
	public List<Product> filterProducts(Filter filter,Principal principal) {
		List<Product> products;
		
		if(Objects.equals(filter.getRecommendationType(),"for me"))
			products=getRecommended(principal);
		else
			products = getAllProducts(principal);
		
	    return products.stream()
	        .filter(p -> filter.getCategories() == null || filter.getCategories().isEmpty()
	            || filter.getCategories().contains(p.getCategory().getName()))
	        .filter(p -> {
	            String keyword = filter.getSearchKeyword();
	            return keyword == null ||
	                   p.getName().toLowerCase().contains(keyword.toLowerCase()) ||
	                   p.getDescription().toLowerCase().contains(keyword.toLowerCase());
	        })
	        .sorted(getComparator(filter))
	        .collect(Collectors.toList());
	}
	
	private Comparator<Product> getComparator(Filter filter) {
	    Comparator<Product> comparator=(p1, p2) -> 0;

	    if ("new arrivals".equalsIgnoreCase(filter.getRecommendationType())) {
	        comparator = Comparator.comparing(Product::getCreatedAt).reversed();
	    } else if ("top rated".equalsIgnoreCase(filter.getRecommendationType())) {
	        comparator = Comparator.comparing(Product::getRating).reversed();
	    }

	    if ("asc".equalsIgnoreCase(filter.getPriceDirection())) {
	    	comparator = Comparator.comparing(Product::getPrice);
	    } else if ("desc".equalsIgnoreCase(filter.getPriceDirection())) {
	        comparator = Comparator.comparing(Product::getPrice, Comparator.reverseOrder());
	    }
	    
	    return comparator;
	}

	public List<Product> getRecommended(Principal principal){
		Long userId=getUser(principal).getId();
		Map<String, Object> response;
		try {
			response = restTemplate.getForObject(AI_API_URL + "recommend/"+userId, Map.class);
			if(response==null) response=new HashMap<>();
		}catch(RestClientException e) {
			response=new HashMap<>();
		}
        List<Long> ids = ((List<Long>) response.getOrDefault("recommendations",Collections.EMPTY_LIST));
        return productRepo.findAllById(ids);
	}
	
	public Product getProductById(Long id,Principal principal) {
		saveClick(principal, id);
		return getProductOrThrow(id);
	}
	
	public void addReview(AddReviewRequest request,Principal principal) {
		User user=getUser(principal);
		Long productId=request.getProductId();
		Product product=getProductOrThrow(productId);
		
		Review newReview=new Review(request.getText(),user.getUsername(),request.getRating(),product,user,LocalDateTime.now());
		reviewRepo.save(newReview);
		
		if(product.getReviews().size()>0) {
			double productRating=request.getRating();
			for(Review review:product.getReviews())
				productRating+=review.getRating();
			productRating/=(product.getReviews().size());
			product.setRating(productRating);
			productRepo.save(product);
		}
		//product.getReviews().add(newReview);
		//userRepo.save(user);
		//productRepo.save(product);
		
	}
	
	public List<Review> getReviews(Long productId) {
		Product product=getProductOrThrow(productId);
		return product.getReviews();
	}
	
	
	public ProductImage getImage(Long picId) {
		return imageRepo.findById(picId).orElseThrow(()->new ResourceNotFoundException("Image not found!"));
	}
	
	public List<Category> getCategories(){
		return categoryRepo.findAll();
	}
	
	public List<Product> getSimilarProducts(Long productId){
        Map<String, Object> response;
        try {
        	response = restTemplate.getForObject(AI_API_URL +"similar/"+ productId, Map.class);
        	if(response==null) response=new HashMap<>();
        }catch(RestClientException e) {
        	response=new HashMap<>();
        }
		List<Integer> recommendedInts = (List<Integer>) response.getOrDefault("similar",Collections.EMPTY_LIST);
		List<Long> recommended = recommendedInts.stream()
			    .map(Integer::longValue)
			    .toList();
		return recommended.stream().map(id->getProductOrThrow(productId)).toList();
	}
	
	public void saveClick(Principal principal,Long productId) {
		Long userId=getUser(principal).getId();
		ProductClick click=new ProductClick(userId,productId,LocalDateTime.now());
		this.clickRepo.save(click);
	}
	
	
	@EventListener(ApplicationReadyEvent.class)
	@Transactional
	 public void cleanupOldClicks() {
		 LocalDateTime threshold = LocalDateTime.now().minusMinutes(30);
	     clickRepo.deleteByClickedAtBefore(threshold);
	 }
	 
}

