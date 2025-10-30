 package com.online.shop.entities;

import java.util.Base64;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class OrderProduct {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
    private String productName;
    private Double price;
    private Integer quantity;
    private Long productId;
    
    //pentru imagine
   // private String name;
    
	//generate de cloudinary
	private String url;
	private String public_id;
	
	//baza de date
	
	private String imageBase64;
	private int savingOption;
	
	@ManyToOne
	@JsonIgnore
	private Order order;

	public OrderProduct() {}
	
	public OrderProduct(Product product, Integer quantity,Order order) {
        this.productId = product.getId();
        this.productName = product.getName();
        this.price = product.getPrice();
        this.quantity = quantity;
        this.order=order;
        
        if (!product.getImages().isEmpty()) {
            ProductImage image = product.getImages().get(0);
            this.savingOption=image.getSavingOption();
            if(savingOption==0) {
            	public_id=image.getPublic_id();
            	url=image.getUrl();
            }
            else
				imageBase64=Base64.getEncoder().encodeToString(image.getData());
        }
        
        
    }
}
