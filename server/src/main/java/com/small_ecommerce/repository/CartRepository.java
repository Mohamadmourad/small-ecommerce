package com.small_ecommerce.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.small_ecommerce.model.Cart;
import com.small_ecommerce.model.User;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Cart findByUser(User user);
    
}
