package com.online.shop.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.online.shop.dtos.AddNotificationsRequest;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Notifications {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private boolean offers;
    private boolean orderStatus;
    private boolean newArrivals;
    private boolean viaEmail;
    private boolean viaPush;

    @OneToOne
    @JsonIgnore
    private User user;
    
    public void updateDetails(AddNotificationsRequest request) {
    	this.setOffers(request.isOffers());
    	this.setNewArrivals(request.isNewArrivals());
    	this.setOrderStatus(request.isOrderStatus());
    	this.setViaEmail(request.isViaEmail());
    	this.setViaPush(request.isViaPush())	;
    }
}
