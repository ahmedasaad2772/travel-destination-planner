package com.travelplanner.controller;

import com.travelplanner.dto.DestinationRequest;
import com.travelplanner.dto.RestCountryDto;
import com.travelplanner.model.Destination;
import com.travelplanner.service.DestinationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:3000" })
public class AdminController {

    private final DestinationService destinationService;

     
    @GetMapping("/countries/fetch")
    public ResponseEntity<List<RestCountryDto>> fetchCountries() {
        List<RestCountryDto> countries = destinationService.fetchCountriesFromApi();
        return ResponseEntity.ok(countries);
    }

     
    @GetMapping("/countries/fetch/{region}")
    public ResponseEntity<List<RestCountryDto>> fetchCountriesByRegion(@PathVariable String region) {
        List<RestCountryDto> countries = destinationService.fetchCountriesByRegion(region);
        return ResponseEntity.ok(countries);
    }

     
    @PostMapping("/destinations")
    public ResponseEntity<Destination> addDestination(@Valid @RequestBody DestinationRequest request) {
        Destination destination = destinationService.addDestination(request);
        return ResponseEntity.ok(destination);
    }

     
    @PostMapping("/destinations/bulk")
    public ResponseEntity<List<Destination>> bulkAddDestinations(@RequestBody List<DestinationRequest> destinations) {
        List<Destination> added = destinationService.bulkAddDestinations(destinations);
        return ResponseEntity.ok(added);
    }

     
    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<?> removeDestination(@PathVariable Long id) {
        try {
            destinationService.removeDestination(id);
            return ResponseEntity.ok(Map.of("message", "Destination removed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

     
    @GetMapping("/destinations")
    public ResponseEntity<Page<Destination>> getAllDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("countryName").ascending());
        return ResponseEntity.ok(destinationService.getAllDestinations(pageable));
    }
}
