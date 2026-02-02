package com.travelplanner.config;

import com.travelplanner.model.User;
import com.travelplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository) {
        return args -> {
             
            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .email("admin@travelplanner.com")
                        .role(User.Role.ADMIN)
                        .build();
                userRepository.save(admin);
                System.out.println("Created admin user: admin/admin");
            }

             
            if (!userRepository.existsByUsername("user")) {
                User user = User.builder()
                        .username("user")
                        .password(passwordEncoder.encode("user123"))
                        .email("user@travelplanner.com")
                        .role(User.Role.USER)
                        .build();
                userRepository.save(user);
                System.out.println("Created test user: user/user123");
            }
        };
    }
}
