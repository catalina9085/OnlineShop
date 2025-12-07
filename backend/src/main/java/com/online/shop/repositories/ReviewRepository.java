package com.online.shop.repositories;

import com.online.shop.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.online.shop.entities.Review;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review ,Long>{
    List<Review> findAllByProduct(Product product);
}
