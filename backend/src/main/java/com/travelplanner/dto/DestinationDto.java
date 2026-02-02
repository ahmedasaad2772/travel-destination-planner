package com.travelplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationDto {

    private Long id;
    private String countryName;
    private String capital;
    private String region;
    private Long population;
    private String currency;
    private String flagUrl;
    private Boolean approved;
    private Boolean wantToVisit;
}
