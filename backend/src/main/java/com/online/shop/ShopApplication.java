package com.online.shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShopApplication.class, args);
	}

}

/*
 spring.datasource.url=jdbc:mysql://y2w3wxldca8enczv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/e1nw91z08chrry6r
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=kotvyzyil5lxoqd5
spring.datasource.password=nfnj577ymirwv5do*/
