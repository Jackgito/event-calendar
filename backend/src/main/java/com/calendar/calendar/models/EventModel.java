package com.calendar.calendar.models;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
public class EventModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private int participantLimit;

    private double price;

    private OffsetDateTime startDate;
    private OffsetDateTime endDate;

    @ManyToMany
    @JoinTable(
            name = "event_participants",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<Users> participants = new HashSet<>();

    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getParticipantLimit() { return participantLimit; }
    public void setParticipantLimit(int participantLimit) { this.participantLimit = participantLimit; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public OffsetDateTime getStartDate() { return startDate; }
    public void setStartDate(OffsetDateTime startDate) { this.startDate = startDate; }

    public OffsetDateTime getEndDate() { return endDate; }
    public void setEndDate(OffsetDateTime endDate) { this.endDate = endDate; }

    public Set<Users> getParticipants() { return participants; }
    public void setParticipants(Set<Users> participants) { this.participants = participants; }

    @Override
    public String toString() {
        return "EventModel{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", participantLimit=" + participantLimit +
                ", price=" + price +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", participants=" + participants +
                '}';
    }
}
