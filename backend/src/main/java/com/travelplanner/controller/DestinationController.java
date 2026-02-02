package com.travelplanner.controller;

import com.travelplanner.dto.DestinationDto;
import com.travelplanner.model.User;
import com.travelplanner.security.CustomUserDetailsService;
import com.travelplanner.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:3000" })
public class DestinationController {

    private final DestinationService destinationService;
    private final CustomUserDetailsService customUserDetailsService;

     
    @GetMapping
    public ResponseEntity<Page<DestinationDto>> getDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = customUserDetailsService.getUserByUsername(userDetails.getUsername());
        Pageable pageable = PageRequest.of(page, size, Sort.by("countryName").ascending());
        return ResponseEntity.ok(destinationService.getApprovedDestinations(user.getId(), pageable));
    }

     
    @GetMapping("/search")
    public ResponseEntity<Page<DestinationDto>> searchDestinations(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = customUserDetailsService.getUserByUsername(userDetails.getUsername());
        Pageable pageable = PageRequest.of(page, size, Sort.by("countryName").ascending());
        return ResponseEntity.ok(destinationService.searchDestinations(q, user.getId(), pageable));
    }

     
    @PostMapping("/{id}/want-to-visit")
    public ResponseEntity<?> addToWantToVisit(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            User user = customUserDetailsService.getUserByUsername(userDetails.getUsername());
            destinationService.addToWantToVisit(user.getId(), id);
            return ResponseEntity.ok(Map.of("message", "Added to want to visit list"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

     
    @DeleteMapping("/{id}/want-to-visit")
    public ResponseEntity<?> removeFromWantToVisit(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            User user = customUserDetailsService.getUserByUsername(userDetails.getUsername());
            destinationService.removeFromWantToVisit(user.getId(), id);
            return ResponseEntity.ok(Map.of("message", "Removed from want to visit list"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
