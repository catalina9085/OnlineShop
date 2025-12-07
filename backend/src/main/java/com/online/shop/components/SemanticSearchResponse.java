package com.online.shop.components;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SemanticSearchResponse {
    private List<Long> productIds;
}
