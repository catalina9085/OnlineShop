package com.online.shop.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddReviewRequest {
	private Long productId;
	private String text;
	private Integer rating;
}
