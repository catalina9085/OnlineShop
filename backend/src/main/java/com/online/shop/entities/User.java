package com.online.shop.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
//@Table(name="users")
@Getter
@Setter
public class User {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	private String username;
	@JsonIgnore
	private String password;
	private String email;
	private String role;
	
	@JsonIgnore
	private String verificationCode;
	private boolean verified;
	
	@JsonIgnore
	private LocalDateTime codeExpiration;
	@JsonIgnore
	private String fcmToken;
	
	@OneToOne(mappedBy="user",cascade=CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private ShoppingCart cart;
	
	
	@OneToOne(mappedBy="user",cascade=CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Notifications notifications;
	
	@OneToOne(mappedBy="user",cascade=CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private WishList wishList;
	
	@OneToMany(mappedBy="user",cascade=CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<Review> reviews=new ArrayList<>();
	
	@OneToOne(mappedBy="user",cascade=CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Shipment shipment;
	
	@OneToOne(mappedBy="user",cascade=CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Transaction transaction;
	
	@OneToMany(mappedBy="user",cascade=CascadeType.ALL)
	@JsonIgnore
	private List<Order> orders=new ArrayList<>();
	
	
	public User() {
        this.cart = new ShoppingCart();
        this.cart.setUser(this); 
        this.wishList = new WishList();
        this.wishList.setUser(this);
        this.notifications=new Notifications(); 
        this.notifications.setUser(this);
        this.shipment=new Shipment();
        shipment.setUser(this);
    }
	
    
}

