package com.calendar.calendar.models;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private int participantLimit;
    private double price;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private List<String> participants;

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

    public List<String> getParticipants() { return participants; }
    public void setParticipants(List<String> participants) { this.participants = participants; }

    public static EventDTO from(EventModel model) {
        EventDTO dto = new EventDTO();
        dto.setId(model.getId());
        dto.setTitle(model.getTitle());
        dto.setDescription(model.getDescription());
        dto.setParticipantLimit(model.getParticipantLimit());
        dto.setPrice(model.getPrice());
        dto.setStartDate(model.getStartDate());
        dto.setEndDate(model.getEndDate());
        dto.setParticipants(
                model.getParticipants().stream()
                        .map(Users::getUsername)
                        .collect(Collectors.toList())
        );
        return dto;
    }

}
