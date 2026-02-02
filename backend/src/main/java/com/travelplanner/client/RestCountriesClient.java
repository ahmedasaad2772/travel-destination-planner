package com.travelplanner.client;

import com.travelplanner.dto.RestCountryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "rest-countries", url = "https://restcountries.com/v3.1")
public interface RestCountriesClient {

    @GetMapping("/all?fields=name,capital,region,population,currencies,flags")
    List<RestCountryDto> fetchAllCountries();

    @GetMapping("/region/{region}?fields=name,capital,region,population,currencies,flags")
    List<RestCountryDto> fetchByRegion(@PathVariable("region") String region);

    @GetMapping("/name/{name}?fields=name,capital,region,population,currencies,flags")
    List<RestCountryDto> searchByName(@PathVariable("name") String name);
}
