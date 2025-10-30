package com.online.shop.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.online.shop.configurations.ResourceNotFoundException;
import com.online.shop.dtos.AddProductRequest;
import com.online.shop.entities.Category;
import com.online.shop.entities.Order;
import com.online.shop.entities.OrderProduct;
import com.online.shop.entities.Product;
import com.online.shop.entities.ProductImage;
import com.online.shop.entities.User;
import com.online.shop.repositories.CategoryRepository;
import com.online.shop.repositories.ImageRepo;
import com.online.shop.repositories.OrderProductRepository;
import com.online.shop.repositories.OrderRepository;
import com.online.shop.repositories.ProductRepository;
import com.online.shop.repositories.ReviewRepository;
import com.online.shop.repositories.UserRepository;
import com.online.shop.repositories.WishListRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
	
	private final ProductRepository productRepo;
	private final ReviewRepository reviewRepo;
	private final UserRepository userRepo;
	private final WishListRepository wishRepo;
	private final CloudinaryService cloudinaryService;
	private final OrderProductRepository orderProdRepo;
	private final OrderRepository orderRepo;
	private final NotificationsService notifService;
	private final CategoryRepository categoryRepo;
	private final ImageRepo imageRepo;
	
	
	public Category getExistentCategory(String name,Product product) {
		Category category= categoryRepo.findByName(name).orElseThrow(()->new ResourceNotFoundException("Category not found!"));
		category.getProducts().add(product);
		categoryRepo.save(category);
		return category;
	}
	
	public Category createNewCategory(String name,Product product) {
		Optional<Category> category=categoryRepo.findByName(name);
		if(!category.isEmpty()) {
			return getExistentCategory(name,product);
		}
		Category newCategory=new Category(name,Collections.singletonList(product));
		categoryRepo.save(newCategory);
		return newCategory;
	}
	
	
	public Product addNewProduct(AddProductRequest request) throws IOException {		int savingOption=request.getSavingOption();
		Product product=new Product(request.getName(),request.getDescription(),request.getPrice(),request.getStock(),LocalDateTime.now());
		
		String newCategory=request.getNewCategory();
		String productCategory=request.getProductCategory();
		
		if(newCategory!=null  && !newCategory.isBlank()) 
			product.setCategory(createNewCategory(newCategory,product));
		else 
			product.setCategory(getExistentCategory(productCategory,product));
		
		List<ProductImage> images=new ArrayList<>();
		List<MultipartFile> files=request.getFiles();
		
		if(files!=null) {
			for(MultipartFile file:files) {
				ProductImage image=new ProductImage();
				image.setSavingOption(savingOption);
				image.setName(file.getOriginalFilename());
				image.setProduct(product);
				if(savingOption==0) {
					List<String> result=cloudinaryService.uploadFile(file,"products");
					String url=result.get(0);
					String publicId=result.get(1);
					if(url!=null) {
						image.setUrl(url);
						image.setPublic_id(publicId);
					}
				}
				else {
					image.setData(file.getBytes());
				}
				images.add(image);
			}
			product.setImages(images);
		}
		productRepo.save(product);
		notifService.notifyAboutNewArrival(product);
		return product;
	}
	
	public List<Product> getAllProducts(){
		return productRepo.findAll();
	}
	
	public Product getProductById(Long productId) {
		return productRepo.findById(productId).orElseThrow(()->new ResourceNotFoundException("Product not found!"));
	}
	
	public void deleteProductFromCategory(Product product) {
		Category category=product.getCategory();
		category.getProducts().remove(product);
		categoryRepo.save(category);
	}
	
	public void deleteProduct(Long productId) {
		Product product=productRepo.findById(productId).orElseThrow(()->new ResourceNotFoundException("Product not found!"));
		//la category rupem legatura pt ca nu vreau sa se stearga category cand dispare product
		deleteProductFromCategory(product);
		
		//fiecare review pointeaza la un product,deci teoretic acea legatura trebuie rupta inainte sa pot sterge product
		//dar cum am orphan removal si cascade,pot sterge direct si vor fi sterse si review-urile corespunzatoare
		
		for(ProductImage img:product.getImages()) {
			if (img.getSavingOption() == 0) 
		        cloudinaryService.deleteFile(img.getPublic_id()); // ștergi din Cloudinary dacă e cazul
		}
		
//		Iterator<ProductImage> iterator=product.getImages().iterator();
//		while(iterator.hasNext()) {
//
//			if (img.getSavingOption() == 0) 
//		        cloudinaryService.deleteFile(img.getPublic_id()); // ștergi din Cloudinary dacă e cazul
//		    iterator.remove(); 
//		}
		
		List<OrderProduct> orderProducts=orderProdRepo.findByProductId(productId);
		Iterator<OrderProduct> it=orderProducts.iterator();
		while(it.hasNext()) {
			it.next().setProductId(null);
		}
		productRepo.deleteById(productId);
	}
	
	public void deleteImage(Long imageId,Long productId) {
		//image pointeaza la product deci pot sa o sterg direct fara probleme,la fel ca la review
		//lista lui product cu images se va actualiza singura 
		ProductImage img=imageRepo.findById(imageId).orElseThrow(()->new ResourceNotFoundException("Image not found!"));
		if(img.getSavingOption()==0) cloudinaryService.deleteFile(img.getPublic_id());
		imageRepo.deleteById(imageId);
		
//		Product product=productRepo.findById(productId).orElseThrow(()->new ResourceNotFoundException("Product not found!"));
//		Iterator<ProductImage> iterator=product.getImages().iterator();
//		while(iterator.hasNext()) {
//			ProductImage img=iterator.next();
//			if(img.getId().equals(imageId)) {
//				if(img.getSavingOption()==0) cloudinaryService.deleteFile(img.getPublic_id());
//				iterator.remove();
//				productRepo.save(product);
//				return;
//			}
//		}
	}

	
	public Product editProduct(Long productId,AddProductRequest request) throws IOException {
		//System.out.println("\n\n\n!!!!!!Saving option is "+request.getSavingOption()+" !!!!!!\n\n\n\n");
		Product product=productRepo.findById(productId).orElseThrow(()->new ResourceNotFoundException("Product not found!"));
		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setStock(request.getStock());
		product.setDiscount(request.getDiscount());
		
		if(request.getNewCategory()!=null && !request.getNewCategory().isBlank()) product.setCategory(createNewCategory(request.getNewCategory(),product));
		else product.setCategory(getExistentCategory(request.getProductCategory(),product));
		
		List<ProductImage> images=new ArrayList<>();
		List<MultipartFile> files=request.getFiles();
		
		if(files!=null) {
			int savingOption=request.getSavingOption();
			for(MultipartFile file:files) {
				ProductImage image=new ProductImage();
				image.setSavingOption(savingOption);
				image.setName(file.getOriginalFilename());
				image.setProduct(product);
				if(savingOption==0) {
					List<String> result=cloudinaryService.uploadFile(file,"products");
					if(result!=null) {
						String url=result.get(0);
						String publicId=result.get(1);
						if(url!=null) {
							image.setUrl(url);
							image.setPublic_id(publicId);
						}
					}
				}
				else {
					image.setData(file.getBytes());
				}
				images.add(image);
			}
		}
		if(product.getImages()==null) product.setImages(images);
		else product.getImages().addAll(images);
		productRepo.save(product);
		
		if(product.getDiscount()>0) {
			notifService.notifyAboutOffer(product);
		}
		return product;
		
	}
	
	
	public void deleteReview(Long reviewId) {
		//OneToMany inseamna ca multi pointeaza la el
		//fiecare review pointeaza catre un user si un product,deci pot sterge direct review-ul ,nu afecteaza nimic
		//regula era ca nu pot sterge un rand daca in alta parte cineva pointeaza la el
		//dupa ce se termina aceasta cerere http,se incheie si contextul tranzactional
		//deci la urm cerere listele lui user si prosuct vor fi actualizate,adica acel review e sters automat
		reviewRepo.deleteById(reviewId);
	}
	
	public List<User> getAllUsers(){
		return userRepo.findAll();
	}
	
	
	public void deleteUser(Long userId) {
	    User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

	    //rupem legatura ca orders sa ramana acolo pt admin
	    for (Order order : user.getOrders()) {
	        order.setUser(null);
	        orderRepo.save(order);
	    }

	    userRepo.deleteById(userId);
	}
	
	public void changeRole(Long userId) {
		User user=userRepo.findById(userId).orElseThrow(()->new ResourceNotFoundException("user not found"));
		if(user.getRole().equals("ROLE_USER")) {
			user.setRole("ROLE_ADMIN");
		}
		else {
			user.setRole("ROLE_USER");
		}
		userRepo.save(user);
	}

	
	public Map<String,Object> getOverview() {
		List<Order> orders=orderRepo.findAll();
		Double total=0.0;
		Long paidOrdersCnt=0L;
		Long soldProductsCnt=0L;
		for(Order order:orders) {
			if(order.getStatus().equals("PAID")) {
				paidOrdersCnt++;
				total+=order.getTotal();
				for(OrderProduct orderProduct:order.getProducts())
					soldProductsCnt+=orderProduct.getQuantity();
			}
		}
		
		Map<String,Object> result=Map.of("total",String.format("%.2f", total),
				"soldProducts", soldProductsCnt,
				"placedOrders",paidOrdersCnt,
				"bestSellers", getBestSellers(),
				"dailyRevenue",orderRepo.findDailyRevenue(),
				"weeklyRevenue",orderRepo.findWeeklyRevenue(),
				"monthlyRevenue",orderRepo.findMonthlyRevenue());
				;
		return result;
	}
	
	public List<Product> getBestSellers() {
		Sort sort=Sort.by("sales");
		sort=sort.descending();
		List<Product> products=productRepo.findAll(sort);
		return products.subList(0, 5);
	}
	
	public List<Order> getAllOrders() {
		List<Order> orders=orderRepo.findAll();
		return orders;
	}
	
}
