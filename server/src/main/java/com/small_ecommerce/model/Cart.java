package com.small_ecommerce.model;

import jakarta.persistence.*;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();


    public Cart() {}

    public Cart(User user) {
        this.user = user;
    }

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }

    public void clearCart() {
        // Simply clear the items list - database deletion should be handled separately
        items.clear();
    }

    public boolean haveOutOfStockItems() {
        return items.stream().anyMatch(item -> item.getProduct().isOutOfStock());
    }

    public CartItem hasItem(Product product) {
        return items.stream().filter(item -> item.getProduct().equals(product)).findFirst().orElse(null);
    }
}
