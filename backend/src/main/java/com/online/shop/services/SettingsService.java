package com.online.shop.services;

import java.security.Principal;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.online.shop.configurations.ResourceNotFoundException;
import com.online.shop.dtos.AddNotificationsRequest;
import com.online.shop.dtos.AddShipmentRequest;
import com.online.shop.dtos.ChangePasswordRequest;
import com.online.shop.entities.Notifications;
import com.online.shop.entities.Order;
import com.online.shop.entities.Shipment;
import com.online.shop.entities.User;
import com.online.shop.repositories.NotificationsRepo;
import com.online.shop.repositories.OrderRepository;
import com.online.shop.repositories.ShipmentRepo;
import com.online.shop.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SettingsService {
	private final UserRepository userRepo;
	private final ShipmentRepo shipmentRepo;
	private final PasswordEncoder encoder;
	private final MailService mailService;
	private final OrderRepository orderRepo;
	private final NotificationsRepo notifRepo;
//	public SettingsService(UserRepository userRepo,ShipmentRepo shipmentRepo,PasswordEncoder encoder,MailService mailService) {
//		this.userRepo=userRepo;
//		this.shipmentRepo=shipmentRepo;
//		this.encoder=encoder;
//		this.mailService=mailService;
//	}
	
	public User getUser(Principal principal) {
		return userRepo.findByUsername(principal.getName()).orElseThrow(()->new ResourceNotFoundException("User not found!"));
	}
	
	public void addShipment(AddShipmentRequest request,Principal principal) {
		User user=getUser(principal);
		Shipment current=user.getShipment();
		current.updateDetails(request);
		shipmentRepo.save(current);
	}
	
	public void deleteAccount(Principal principal) {
		User user=getUser(principal);
		List<Order> orders=user.getOrders();
		orders.stream().peek(order->{
			order.setUser(null);
		});
		orderRepo.saveAll(orders);
		userRepo.delete(user);
	}
	
	public void changePassword(Principal principal,ChangePasswordRequest request) {
		User user=getUser(principal);
		if(!encoder.matches(request.getCurrentPassword(), user.getPassword()))
			throw new RuntimeException("Your current password is incorrect!");
		if(!request.getNewPassword().equals(request.getConfirmPassword()))
			throw new RuntimeException("New password and confirm password do not match!");
		user.setPassword(encoder.encode(request.getNewPassword()));
		userRepo.save(user);
	}
	
	public void setNotificationsPreferences(AddNotificationsRequest request,Principal principal) {
		User user=getUser(principal);
		Notifications notif=user.getNotifications();
		notif.updateDetails(request);
		notifRepo.save(notif);
	}
	
	public Notifications getNotificationsPreferences(Principal principal) {
		User user=getUser(principal);
		return user.getNotifications();
	}
	
	public void saveFcmToken(Principal principal,String fcmToken) {
		User user=getUser(principal);
		user.setFcmToken(fcmToken);
		userRepo.save(user);
	}
	
	public void sendVerificationCode(Principal principal) {
		User user=getUser(principal);
		mailService.sendVerificationCode(user.getEmail());
	}
	
	public void verifyCode(String code,Principal principal) {
		User user=getUser(principal);
		mailService.verifyUser(code, user.getEmail());
	}
}
