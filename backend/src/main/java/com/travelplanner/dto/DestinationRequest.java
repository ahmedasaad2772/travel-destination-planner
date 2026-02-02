package com.travelplanner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationRequest {

    @NotBlank(message = "Country name is required")
    private String countryName;

    private String capital;
    private String region;
    private Long population;
    private String currency;
    private String flagUrl;
}
