package com.small_ecommerce.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.small_ecommerce.dtos.cartDtos.CartItemDto;
import com.small_ecommerce.model.Cart;
import com.small_ecommerce.model.CartItem;
import com.small_ecommerce.model.Product;
import com.small_ecommerce.model.User;
import com.small_ecommerce.repository.CartItemRepository;
import com.small_ecommerce.repository.CartRepository;
import com.small_ecommerce.repository.ProductsRepository;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductsRepository productsRepository;

    public void addItemToCart(UUID productId, User currentUser) {
        Cart cart = cartRepository.findByUser(currentUser);
        if(cart == null) {
            cart = new Cart(currentUser);
            cartRepository.save(cart);
        }
        Product product = productsRepository.findById(productId).orElse(null);
        if(product == null) {
            throw new IllegalArgumentException("Product not found");
        }
        if(product.isOutOfStock()){
            throw new IllegalArgumentException("Product is out of the stock");
        }
        CartItem existItem = cart.hasItem(product);
        if(existItem != null) {
            existItem.incrementQuantity(); 
            cartItemRepository.save(existItem);
            return;
        }
        CartItem newCartItem = new CartItem(cart, product);
        cartItemRepository.save(newCartItem);
    }

    public List<CartItem> getCartItems(User currentUser) {
        Cart cart = cartRepository.findByUser(currentUser);
        if(cart == null) {
            throw new IllegalArgumentException("Cart not found");
        }
        return cart.getItems();
    }

    public List<CartItemDto> getCartItemsDto(User currentUser) {
        Cart cart = cartRepository.findByUser(currentUser);
        if(cart == null) {
            return List.of(); 
        }
        return cart.getItems().stream()
            .map(item -> new CartItemDto(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getPrice(),
                item.getProduct().getStock(),
                item.getProduct().isOutOfStock(),
                item.getQuantity()
            ))
            .collect(Collectors.toList());
    }

    public void removeFromCart(User currentUser, UUID productId){
        Cart cart = cartRepository.findByUser(currentUser);
        if(cart == null) {
            throw new IllegalArgumentException("Cart not found");
        }
        Product product = productsRepository.findById(productId).orElse(null);
        if(product == null) {
            throw new IllegalArgumentException("Product not found");
        }
         CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product);
        if(cartItem == null) {
            throw new IllegalArgumentException("Product not found in cart");
        }
        cartItemRepository.delete(cartItem);
    }

    public void emptyCart(User currentUser){
        Cart cart = cartRepository.findByUser(currentUser);
        if (cart != null) {
            cart.clearCart();
            cartRepository.save(cart); 
        }
    }

    public void incrementQuantity(User currentUser, UUID productId) {
        Cart cart = cartRepository.findByUser(currentUser);
        if(cart == null) {
            throw new IllegalArgumentException("Cart not found");
        }
        Product product = productsRepository.findById(productId).orElse(null);
        if(product == null) {
            throw new IllegalArgumentException("Product not found");
        }
        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product);
        if(cartItem == null) {
            throw new IllegalArgumentException("Product not found in cart");
        }
        cartItem.incrementQuantity();
        cartItemRepository.save(cartItem);
    }

    public void decrementQuantity(User currentUser, UUID productId) {
        Cart cart = cartRepository.findByUser(currentUser);
        if(cart == null) {
            throw new IllegalArgumentException("Cart not found");
        }
        Product product = productsRepository.findById(productId).orElse(null);
        if(product == null) {
            throw new IllegalArgumentException("Product not found");
        }
        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product);
        if(cartItem == null) {
            throw new IllegalArgumentException("Product not found in cart");
        }
        cartItem.decrementQuantity();
        cartItemRepository.save(cartItem);
    }

}
