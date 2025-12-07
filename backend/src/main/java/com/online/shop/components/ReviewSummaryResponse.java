package com.online.shop.components;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewSummaryResponse {
    private String summary;

    public ReviewSummaryResponse(String summary) {
        this.summary = summary;
    }

    public ReviewSummaryResponse(){}
}
