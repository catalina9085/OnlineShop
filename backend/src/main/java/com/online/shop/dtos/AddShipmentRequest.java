package com.online.shop.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddShipmentRequest {
	private String firstName;
	private String lastName;
	private String country;
	private String province;
	private String town;
	private String addressLine1;
	private String addressLine2;
	private String postalCode;
	private String phoneNumber;
}
