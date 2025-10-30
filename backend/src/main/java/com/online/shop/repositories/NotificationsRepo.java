package com.online.shop.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.online.shop.entities.Notifications;


@Repository
public interface NotificationsRepo extends JpaRepository<Notifications, Long>{

}
