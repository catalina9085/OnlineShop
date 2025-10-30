package com.online.shop.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ProductClick {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	private Long userId;
	private Long productId;
	private LocalDateTime clickedAt;

	public ProductClick() {}

    public ProductClick(Long userId, Long productId, LocalDateTime clickedAt) {
        this.userId = userId;
        this.productId = productId;
        this.clickedAt = clickedAt;
    }
}
