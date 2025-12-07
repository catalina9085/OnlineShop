package com.online.shop.components;

import com.online.shop.entities.Product;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SemanticSearchRequest {
    private String query;
    private List<ProductSearchItem> products;

    public SemanticSearchRequest(String query, List<ProductSearchItem> products) {
        this.query = query;
        this.products = products;
    }
}
