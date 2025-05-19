package com.calendar.calendar.api;

import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @ElementCollection
    private List<OffsetDateTime> dates;

    @ElementCollection
    private List<Integer> participantLimits;

    private double price;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<OffsetDateTime> getDates() {
        return dates;
    }

    public void setDates(List<OffsetDateTime> dates) {
        this.dates = dates;
    }

    public List<Integer> getParticipantLimits() {
        return participantLimits;
    }

    public void setParticipantLimits(List<Integer> participantLimits) {
        this.participantLimits = participantLimits;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}