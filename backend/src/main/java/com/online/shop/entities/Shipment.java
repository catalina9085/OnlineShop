package com.online.shop.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.online.shop.dtos.AddShipmentRequest;

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
public class Shipment {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@JsonIgnore
	private Long id;
	
	@OneToOne
	@JsonIgnore
	private User user;
	
	private String firstName;
	private String lastName;
	private String country;
	private String province;
	private String town;
	private String addressLine1;
	private String addressLine2;
	private String postalCode;
	private String phoneNumber;
	
	
	public void updateDetails(AddShipmentRequest request) {
		this.setFirstName(request.getFirstName());
		this.setLastName(request.getLastName());
		this.setCountry(request.getCountry());
		this.setProvince(request.getProvince());
		this.setPhoneNumber(request.getPhoneNumber());
		this.setTown(request.getTown());
		this.setPostalCode(request.getPostalCode());
		this.setAddressLine1(request.getAddressLine1());
		this.setAddressLine2(request.getAddressLine2());
	}
	
}
