package com.travelplanner.controller;

import com.travelplanner.dto.AuthResponse;
import com.travelplanner.dto.LoginRequest;
import com.travelplanner.dto.RegisterRequest;
import com.travelplanner.model.User;
import com.travelplanner.security.JwtTokenProvider;
import com.travelplanner.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:3000" })
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            String token = jwtTokenProvider.generateToken(authentication);
            User user = userService.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .role(user.getRole().name())
                    .message("Login successful")
                    .build());
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body(AuthResponse.builder()
                    .message("Invalid username or password")
                    .build());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            String token = jwtTokenProvider.generateToken(user.getUsername());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .role(user.getRole().name())
                    .message("Registration successful")
                    .build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(AuthResponse.builder()
                    .message(e.getMessage())
                    .build());
        }
    }
}
