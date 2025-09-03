package com.small_ecommerce.model;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "orderId", fetch = FetchType.LAZY)
    private List<OrderItems> items;

    private String paymentStatus;
    private String shippingAddress;
    private String phoneNumber;
    private String fullName;

    public Order() {}

    public Order(User user, String shippingAddress, String phoneNumber, String fullName) {
        this.user = user;
        this.paymentStatus = "PENDING";
        this.shippingAddress = shippingAddress;
        this.phoneNumber = phoneNumber;
        this.fullName = fullName;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<OrderItems> getItems() {
        return items;
    }

    public void setItems(List<OrderItems> items) {
        this.items = items;
    }
    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public double getTotalAmount() {
        return items.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }

    public void decrementProductsStock() {
        items.forEach(item -> item.getProduct().decrementStock(item.getQuantity()));
    }

    public void incrementProductsStock() {
        items.forEach(item -> item.getProduct().incrementStock(item.getQuantity()));
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getFullName() {
        return fullName;
    }

}