package com.travelplanner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RestCountryDto {

    private Name name;
    private List<String> capital;
    private String region;
    private Long population;
    private Map<String, Currency> currencies;
    private Flags flags;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Name {
        private String common;
        private String official;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Currency {
        private String name;
        private String symbol;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Flags {
        private String png;
        private String svg;
    }

    public String getCommonName() {
        return name != null ? name.getCommon() : null;
    }

    public String getFirstCapital() {
        return capital != null && !capital.isEmpty() ? capital.get(0) : null;
    }

    public String getFirstCurrency() {
        if (currencies != null && !currencies.isEmpty()) {
            Currency currency = currencies.values().iterator().next();
            return currency.getName();
        }
        return null;
    }

    public String getFlagPng() {
        return flags != null ? flags.getPng() : null;
    }
}
