package com.online.shop.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.online.shop.entities.ProductClick;

public interface ProductClickRepo extends JpaRepository<ProductClick, Long>{
	List<ProductClick> findByUserIdAndClickedAtAfter(Long userId,LocalDateTime after);

	void deleteByClickedAtBefore(LocalDateTime threshold);

}
