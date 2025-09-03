package com.small_ecommerce.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.small_ecommerce.model.Cart;
import com.small_ecommerce.model.CartItem;
import com.small_ecommerce.model.Product;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    CartItem findByCartAndProduct(Cart cart, Product product);
}

