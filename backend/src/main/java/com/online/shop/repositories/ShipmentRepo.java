package com.online.shop.repositories;

import com.online.shop.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.online.shop.entities.Shipment;

import java.util.List;

@Repository
public interface ShipmentRepo extends JpaRepository<Shipment,Long>{
}
