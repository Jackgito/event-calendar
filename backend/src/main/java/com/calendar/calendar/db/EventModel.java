package com.calendar.calendar.db;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "events") // make sure the table is named "events"
public class EventModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private int[] participantLimits;  // You may need to adjust how this is stored depending on DB

    private double price;

    private OffsetDateTime startDate;

    private OffsetDateTime endDate;

    // Getters and setters for all fields

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

    public int[] getParticipantLimits() {
        return participantLimits;
    }

    public void setParticipantLimits(int[] participantLimits) {
        this.participantLimits = participantLimits;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public OffsetDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(OffsetDateTime startDate) {
        this.startDate = startDate;
    }

    public OffsetDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(OffsetDateTime endDate) {
        this.endDate = endDate;
    }
}
