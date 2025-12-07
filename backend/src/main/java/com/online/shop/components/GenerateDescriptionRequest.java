package com.online.shop.components;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerateDescriptionRequest {
    private String name;
    private String category;
    private Double price;
    private String keywords;

    public GenerateDescriptionRequest(String name, String category, Double price, String keywords) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.keywords = keywords;
    }
}