package com.small_ecommerce.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;


    public CartItem() {}

    public CartItem(Cart cart, Product product) {
        this.cart = cart;
        this.product = product;
        this.quantity = 1;
    }

    public UUID getId() {
        return id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public double getPrice() {
        return product.getPrice() * quantity;
    }

    
    public int getQuantity() {
        return quantity;
    }

    public void incrementQuantity() {
        quantity++;
    }
    public void decrementQuantity() {
        if (quantity > 0) {
            quantity--;
        }
    }

}
