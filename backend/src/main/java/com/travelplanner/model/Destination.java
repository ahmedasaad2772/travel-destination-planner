package com.travelplanner.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "destinations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "country_name", nullable = false, length = 100)
    private String countryName;

    @Column(length = 100)
    private String capital;

    @Column(length = 100)
    private String region;

    private Long population;

    @Column(length = 50)
    private String currency;

    @Column(name = "flag_url", length = 500)
    private String flagUrl;

    @Builder.Default
    private Boolean approved = true;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
