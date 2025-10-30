package com.online.shop.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.online.shop.dtos.RevenueDTO;
import com.online.shop.entities.Order;

public interface OrderRepository extends JpaRepository<Order,Long>{
	public List<Order> findByStatus(String status);
	
	// ex: "2025-01-20"
    @Query("SELECT new com.online.shop.dtos.RevenueDTO(" +
           "CAST(FUNCTION('DATE', o.createdAt) AS string), SUM(o.total)) " +
           "FROM Order o " +
           "WHERE o.status = 'PAID' " +
           "GROUP BY CAST(FUNCTION('DATE', o.createdAt) AS string) " +
           "ORDER BY CAST(FUNCTION('DATE', o.createdAt) AS string)")
    public List<RevenueDTO> findDailyRevenue();

    // ex: "Week 33, 2025"
    @Query("SELECT new com.online.shop.dtos.RevenueDTO(" +
           "CONCAT('Week ', FUNCTION('WEEK', o.createdAt), ', ', FUNCTION('YEAR', o.createdAt)), SUM(o.total)) " +
           "FROM Order o " +
           "WHERE o.status = 'PAID' " +
           "GROUP BY CONCAT('Week ', FUNCTION('WEEK', o.createdAt), ', ', FUNCTION('YEAR', o.createdAt)) " +
           "ORDER BY CONCAT('Week ', FUNCTION('WEEK', o.createdAt), ', ', FUNCTION('YEAR', o.createdAt))")
    public List<RevenueDTO> findWeeklyRevenue();
	
	
    // ex: "January 2025"
    @Query("SELECT new com.online.shop.dtos.RevenueDTO(" +
           "CONCAT(FUNCTION('MONTHNAME', o.createdAt), ' ', FUNCTION('YEAR', o.createdAt)), SUM(o.total)) " +
           "FROM Order o " +
           "WHERE o.status = 'PAID' " +
           "GROUP BY CONCAT(FUNCTION('MONTHNAME', o.createdAt), ' ', FUNCTION('YEAR', o.createdAt)) " +
           "ORDER BY CONCAT(FUNCTION('MONTHNAME', o.createdAt), ' ', FUNCTION('YEAR', o.createdAt))")
    public List<RevenueDTO> findMonthlyRevenue();
    
   public List<Order> findAll();
}
