package com.online.shop.dtos;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Filter {
	private List<String> categories=new ArrayList<>();
	private String priceDirection;
	private String recommendationType;
	private String searchKeyword;
	
}
