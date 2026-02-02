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

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:3000" })
public class UserController {

    private final DestinationService destinationService;
    private final CustomUserDetailsService customUserDetailsService;

     
    @GetMapping("/want-to-visit")
    public ResponseEntity<Page<DestinationDto>> getWantToVisitList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = customUserDetailsService.getUserByUsername(userDetails.getUsername());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(destinationService.getWantToVisitList(user.getId(), pageable));
    }
}
