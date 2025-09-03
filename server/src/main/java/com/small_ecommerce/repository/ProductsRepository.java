package com.small_ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.small_ecommerce.model.Product;

public interface ProductsRepository extends JpaRepository<Product, UUID> {
    List<Product> findByStockLessThan(int threshold);
    
}
