package com.travelplanner.service;

import com.travelplanner.client.RestCountriesClient;
import com.travelplanner.dto.DestinationDto;
import com.travelplanner.dto.DestinationRequest;
import com.travelplanner.dto.RestCountryDto;
import com.travelplanner.model.Destination;
import com.travelplanner.model.WantToVisit;
import com.travelplanner.model.WantToVisitId;
import com.travelplanner.model.User;
import com.travelplanner.repository.DestinationRepository;
import com.travelplanner.repository.WantToVisitRepository;
import com.travelplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final WantToVisitRepository wantToVisitRepository;
    private final UserRepository userRepository;
    private final RestCountriesClient restCountriesClient;

     

     
    public List<RestCountryDto> fetchCountriesFromApi() {
        return restCountriesClient.fetchAllCountries();
    }

     
    public List<RestCountryDto> fetchCountriesByRegion(String region) {
        return restCountriesClient.fetchByRegion(region);
    }

     
    @Transactional
    public Destination addDestination(DestinationRequest request) {
        Destination destination = Destination.builder()
                .countryName(request.getCountryName())
                .capital(request.getCapital())
                .region(request.getRegion())
                .population(request.getPopulation())
                .currency(request.getCurrency())
                .flagUrl(request.getFlagUrl())
                .approved(true)
                .build();
        return destinationRepository.save(destination);
    }

     
    @Transactional
    public Destination addFromApiData(RestCountryDto countryDto) {
         
        if (destinationRepository.existsByCountryNameIgnoreCase(countryDto.getCommonName())) {
            throw new RuntimeException("Destination already exists: " + countryDto.getCommonName());
        }

        Destination destination = Destination.builder()
                .countryName(countryDto.getCommonName())
                .capital(countryDto.getFirstCapital())
                .region(countryDto.getRegion())
                .population(countryDto.getPopulation())
                .currency(countryDto.getFirstCurrency())
                .flagUrl(countryDto.getFlagPng())
                .approved(true)
                .build();
        return destinationRepository.save(destination);
    }

     
    @Transactional
    public List<Destination> bulkAddFromApiData(List<RestCountryDto> countries) {
        return countries.stream()
                .filter(c -> !destinationRepository.existsByCountryNameIgnoreCase(c.getCommonName()))
                .map(this::addFromApiData)
                .collect(Collectors.toList());
    }

     
    @Transactional
    public List<Destination> bulkAddDestinations(List<DestinationRequest> destinations) {
        return destinations.stream()
                .filter(d -> !destinationRepository.existsByCountryNameIgnoreCase(d.getCountryName()))
                .map(this::addDestination)
                .collect(Collectors.toList());
    }

     
    @Transactional
    public void removeDestination(Long id) {
        if (!destinationRepository.existsById(id)) {
            throw new RuntimeException("Destination not found with id: " + id);
        }
        destinationRepository.deleteById(id);
    }

     
    public Page<Destination> getAllDestinations(Pageable pageable) {
        return destinationRepository.findAll(pageable);
    }

     

     
    public Page<DestinationDto> getApprovedDestinations(Long userId, Pageable pageable) {
        Page<Destination> destinations = destinationRepository.findByApprovedTrue(pageable);
        Set<Long> wantToVisitIds = getWantToVisitDestinationIds(userId);

        return destinations.map(d -> toDto(d, wantToVisitIds.contains(d.getId())));
    }

     
    public Page<DestinationDto> searchDestinations(String query, Long userId, Pageable pageable) {
        Page<Destination> destinations = destinationRepository.searchApprovedDestinations(query, pageable);
        Set<Long> wantToVisitIds = getWantToVisitDestinationIds(userId);

        return destinations.map(d -> toDto(d, wantToVisitIds.contains(d.getId())));
    }

     
    public DestinationDto getDestinationById(Long id, Long userId) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));

        boolean wantToVisit = wantToVisitRepository.existsById(new WantToVisitId(userId, id));
        return toDto(destination, wantToVisit);
    }

     
    @Transactional
    public void addToWantToVisit(Long userId, Long destinationId) {
        WantToVisitId id = new WantToVisitId(userId, destinationId);

        if (wantToVisitRepository.existsById(id)) {
            throw new RuntimeException("Already in want to visit list");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        WantToVisit wantToVisit = WantToVisit.builder()
                .id(id)
                .user(user)
                .destination(destination)
                .build();

        wantToVisitRepository.save(wantToVisit);
    }

     
    @Transactional
    public void removeFromWantToVisit(Long userId, Long destinationId) {
        WantToVisitId id = new WantToVisitId(userId, destinationId);

        if (!wantToVisitRepository.existsById(id)) {
            throw new RuntimeException("Not in want to visit list");
        }

        wantToVisitRepository.deleteById(id);
    }

     
    public Page<DestinationDto> getWantToVisitList(Long userId, Pageable pageable) {
        Page<WantToVisit> wantToVisitPage = wantToVisitRepository.findByIdUserId(userId, pageable);
        return wantToVisitPage.map(w -> toDto(w.getDestination(), true));
    }

     

    private Set<Long> getWantToVisitDestinationIds(Long userId) {
        return wantToVisitRepository.findByIdUserId(userId, Pageable.unpaged())
                .stream()
                .map(w -> w.getId().getDestinationId())
                .collect(Collectors.toSet());
    }

    private DestinationDto toDto(Destination destination, boolean wantToVisit) {
        return DestinationDto.builder()
                .id(destination.getId())
                .countryName(destination.getCountryName())
                .capital(destination.getCapital())
                .region(destination.getRegion())
                .population(destination.getPopulation())
                .currency(destination.getCurrency())
                .flagUrl(destination.getFlagUrl())
                .approved(destination.getApproved())
                .wantToVisit(wantToVisit)
                .build();
    }
}
