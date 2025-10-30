package com.online.shop.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddNotificationsRequest {
	private boolean offers;
    private boolean orderStatus;
    private boolean newArrivals;
    private boolean viaEmail;
    private boolean viaPush;
}
