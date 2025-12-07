package com.online.shop.components;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductSearchItem {
    private Long id;
    private String name;
    private String description;
    private String category;

    public ProductSearchItem(Long id, String name, String description, String category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
    }
}
