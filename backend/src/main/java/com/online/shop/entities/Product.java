package com.online.shop.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Product {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	private String name;
	private String description;
	private double price;
	private int stock;
	private double rating;
	private int discount;
	private LocalDateTime createdAt;
	private Long sales;
	private boolean inWishlist;

	@Lob
	@Column(columnDefinition = "LONGTEXT")
	private String reviewSummary;

	@OneToMany(mappedBy="product", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Review> reviews=new ArrayList<>();
	
	@ManyToOne
	private Category category;
	
	@OneToMany(mappedBy="product", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<CartItem> items=new ArrayList<>();
	
	@ManyToMany(mappedBy="products", cascade = CascadeType.ALL)
	@JsonIgnore
	private Set<WishList> wishList=new HashSet<>();
	
	@OneToMany(mappedBy="product",cascade = CascadeType.ALL,orphanRemoval = true)
	private List<ProductImage> images=new ArrayList<>();
	
	@JsonProperty("finalPrice") 
    public double getFinalPrice() {
        return price - (price * discount / 100);
    }

	public Product() {
		this.sales=0L;
	}
	
	public Product(String name,String description,double price,int stock,LocalDateTime createdAt) {
		this.name=name;
		this.description=description;
		this.price=price;
		this.stock=stock;
		this.createdAt=createdAt;
		this.sales=0L;
	}
}

