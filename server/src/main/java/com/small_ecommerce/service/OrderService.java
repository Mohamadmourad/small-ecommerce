package com.small_ecommerce.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.small_ecommerce.dtos.orderDtos.createOrderDto;
import com.small_ecommerce.dtos.orderDtos.orderDto;
import com.small_ecommerce.model.Cart;
import com.small_ecommerce.model.Order;
import com.small_ecommerce.model.OrderItems;
import com.small_ecommerce.model.User;
import com.small_ecommerce.repository.CartRepository;
import com.small_ecommerce.repository.CartItemRepository;
import com.small_ecommerce.repository.OrderItemsRepository;
import com.small_ecommerce.repository.OrderRepository;
import com.small_ecommerce.repository.ProductsRepository;

import org.springframework.transaction.annotation.Transactional;


@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemsRepository orderItemsRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private ProductsRepository productsRepository;
    @Autowired
    private KafkaProducerService kafkaProducerService; 

    @Transactional
    public UUID createOrder(User user, createOrderDto orderDto){
        Cart cart = cartRepository.findByUser(user);
        if(cart == null || cart.getItems().isEmpty()){
            throw new IllegalArgumentException("Cart is empty");
        }
        if(cart.haveOutOfStockItems()){
            throw new IllegalArgumentException("Cart contains out of stock items");
        }
        String fullName = orderDto.getFullName();
        String shippingAddress = orderDto.getShippingAddress();
        String phoneNumber = orderDto.getPhoneNumber();

        Order newOrder = new Order(user, shippingAddress, phoneNumber, fullName);
        orderRepository.save(newOrder);

        cart.getItems().forEach(item -> {
            if(item.getQuantity() <= item.getProduct().getStock()){
                OrderItems orderItem = new OrderItems(newOrder.getId(),item.getProduct(),item.getQuantity());
                orderItemsRepository.save(orderItem);
                item.getProduct().decrementStock(item.getQuantity());
                productsRepository.save(item.getProduct());
                if(item.getProduct().getStock() < 5){
                    String message = "Product " + item.getProduct().getName() + " is low on stock. Remaining stock: " + item.getProduct().getStock();
                    kafkaProducerService.send("products.low-stock", message);
                }
            }
            else{
                throw new IllegalArgumentException("Stock is not enough");
            }
        });

        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);

        String message = "New order created with ID: " + newOrder.getId() + " at " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        kafkaProducerService.send("orders.created", message);

        return newOrder.getId();
    }

    @Transactional(readOnly = true)
    public List<orderDto> getUserOrders(User user) {
        List<Order> orders = orderRepository.findAllByUser(user);
        if (orders.isEmpty()) {
            throw new IllegalArgumentException("No orders found");
        }
        
        List<orderDto> orderDtos = new ArrayList<>();
        orders.forEach(order -> {
            order.getItems().size();
            orderDtos.add(new orderDto(
                order.getId(),
                order.getTotalAmount(), 
                order.getItems(),
                order.getPaymentStatus(),
                order.getFullName(),
                order.getPhoneNumber(),
                order.getShippingAddress()
            ));
        });
        return orderDtos;
    }

   public void cancelOrder(User user, UUID orderId) {
       Order order = orderRepository.findById(orderId)
           .orElseThrow(() -> new IllegalArgumentException("Order not found"));
       
       if (!order.getUser().equals(user)) {
           throw new IllegalArgumentException("Order does not belong to this user");
       }
       
       order.incrementProductsStock();
       order.setPaymentStatus("CANCELLED");
       orderRepository.save(order);
   }

   public void payOrder(User user, UUID orderId) {
       Order order = orderRepository.findById(orderId)
           .orElseThrow(() -> new IllegalArgumentException("Order not found"));
       if (!order.getUser().getEmail().equals(user.getEmail())) {
           throw new IllegalArgumentException("Order does not belong to this user");
       }
       
       order.setPaymentStatus("PAID");
       orderRepository.save(order);
   }

   @Transactional(readOnly = true)
   public List<orderDto> getAllOrders(){
       List<orderDto> orderDtos = new ArrayList<>();
       List<Order> orders = orderRepository.findAll();
       orders.forEach(order -> {
           order.getItems().size();
           orderDtos.add(new orderDto(
               order.getId(),
               order.getTotalAmount(), 
               order.getItems(),
               order.getPaymentStatus(),
               order.getFullName(),
               order.getPhoneNumber(),
               order.getShippingAddress()
           ));
       });
       return orderDtos;
   }

}