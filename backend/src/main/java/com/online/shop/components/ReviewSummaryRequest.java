package com.online.shop.components;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReviewSummaryRequest {
    private String productName;
    private List<String> reviews;

    public ReviewSummaryRequest(String productName, List<String> reviews) {
        this.productName = productName;
        this.reviews = reviews;
    }


}
