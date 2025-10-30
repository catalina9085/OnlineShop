package com.online.shop.dtos;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RevenueDTO {
	private String period;
	private Double revenue;
	
	 public RevenueDTO(String period, Double revenue) {
	        this.period = period;
	        this.revenue = revenue;
	 }
	 
	 public RevenueDTO(LocalDate date, Double revenue) {
	        this.period = date.toString(); // conversie simplă
	        this.revenue = revenue;
	    }
	 
	 public RevenueDTO() {}
}
