package com.small_ecommerce.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.small_ecommerce.dtos.userDtos.AuthDto;
import com.small_ecommerce.model.User;
import com.small_ecommerce.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    @Value("${admin.password}")
    private String adminPassword;

    public String createUser(AuthDto user) {
        if( userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        String passwordHashed = passwordEncoder.encode(user.getPassword());
        User newUser = new User(user.getEmail(), passwordHashed); 
        userRepository.save(newUser);
        String jwt = jwtService.generateToken(newUser.getId());
        return jwt;
    }

    public String loginUser(AuthDto user){
        if(!userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("User not found");
        }
        User currentUser = userRepository.findByEmail(user.getEmail());
        boolean isPasswordMatch = passwordEncoder.matches(user.getPassword(), currentUser.getPassword());
        if(currentUser == null || !isPasswordMatch) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        String jwt = jwtService.generateToken(currentUser.getId());
        return jwt;
    }

    public boolean isLoggedIn(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        UUID userId = jwtService.getUserIdFromToken(token);
        return userRepository.existsById(userId);
    }

    public void createDefaultAdminAccount(){
        if(!userRepository.existsByEmail("admin@gmail.com")) {
            String passwordHashed = passwordEncoder.encode(adminPassword);
            User adminUser = new User("admin@gmail.com", passwordHashed, "ADMIN");
            userRepository.save(adminUser);
        }
    }
}
