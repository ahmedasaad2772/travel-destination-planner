package com.travelplanner.client;

import com.travelplanner.dto.RestCountryDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class RestCountriesClient {

    private static final String REST_COUNTRIES_API = "https://restcountries.com/v3.1";
    private final RestTemplate restTemplate;

    public RestCountriesClient() {
        this.restTemplate = new RestTemplate();
    }

     
    public List<RestCountryDto> fetchAllCountries() {
        try {
            String url = REST_COUNTRIES_API + "/all?fields=name,capital,region,population,currencies,flags";
            RestCountryDto[] countries = restTemplate.getForObject(url, RestCountryDto[].class);
            return countries != null ? Arrays.asList(countries) : Collections.emptyList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch countries from REST Countries API: " + e.getMessage(), e);
        }
    }

     
    public List<RestCountryDto> fetchByRegion(String region) {
        try {
            String url = REST_COUNTRIES_API + "/region/" + region
                    + "?fields=name,capital,region,population,currencies,flags";
            RestCountryDto[] countries = restTemplate.getForObject(url, RestCountryDto[].class);
            return countries != null ? Arrays.asList(countries) : Collections.emptyList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch countries by region: " + e.getMessage(), e);
        }
    }

     
    public List<RestCountryDto> searchByName(String name) {
        try {
            String url = REST_COUNTRIES_API + "/name/" + name
                    + "?fields=name,capital,region,population,currencies,flags";
            RestCountryDto[] countries = restTemplate.getForObject(url, RestCountryDto[].class);
            return countries != null ? Arrays.asList(countries) : Collections.emptyList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
