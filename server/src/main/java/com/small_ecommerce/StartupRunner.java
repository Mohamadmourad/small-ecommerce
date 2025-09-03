package com.small_ecommerce;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.small_ecommerce.service.UserService;

@Component
public class StartupRunner implements ApplicationRunner {

    private final UserService userService;

    public StartupRunner(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        userService.createDefaultAdminAccount();
        System.out.println("Default admin account created/verified on startup");
    }
}
