package com.small_ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.small_ecommerce.model.Order;
import com.small_ecommerce.model.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Order findByUser(User user);
    List<Order> findAllByUser(User user);
}
