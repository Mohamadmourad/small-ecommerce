package com.small_ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.small_ecommerce.model.Product;
import com.small_ecommerce.repository.ProductsRepository;

@Service
public class ProductService {
    @Autowired
    private ProductsRepository productsRepository;

    public UUID createProduct(Product product) {
        productsRepository.save(product);
        return product.getId();
    }

    public List<Product> getAllProducts() {
        return productsRepository.findAll();
    }

    public List<Product> getLowStockProducts() {
        return productsRepository.findByStockLessThan(5);
    }

    public Product updateProduct(UUID productId, Product updatedProduct) {
        Product existingProduct = productsRepository.findById(productId).orElse(null);
        if (existingProduct == null) {
            throw new IllegalArgumentException("Product not found");
        }
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStock(updatedProduct.getStock());
        productsRepository.save(existingProduct);
        return existingProduct;
    }

}
