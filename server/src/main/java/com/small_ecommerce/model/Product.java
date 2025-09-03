package com.small_ecommerce.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private double price;
    
    private int stock;

    private boolean isOutOfStock;

    public Product() {}

    public Product(String name, double price, int stock) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.isOutOfStock = stock > 0 ? false: true;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public int getStock() {
        return stock;
    }

    public boolean isOutOfStock() {
        return isOutOfStock;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(double price) {
        this.price = price;
    }


    public void setStock(int stock) {
        this.stock = stock;
        this.isOutOfStock = stock <= 0;
    }

    public void setOutOfStock(boolean isOutOfStock) {
        this.isOutOfStock = isOutOfStock;
    }

    public void decrementStock(int quantity) {
        this.stock -= quantity;
        if (this.stock <= 0) {
            this.isOutOfStock = true;
        }
    }

    public void incrementStock(int quantity) {
        this.stock += quantity;
        this.isOutOfStock = false;
    }

}
