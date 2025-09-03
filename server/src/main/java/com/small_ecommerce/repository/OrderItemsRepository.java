package com.small_ecommerce.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.small_ecommerce.model.OrderItems;

public interface OrderItemsRepository extends JpaRepository<OrderItems, UUID> {

}
