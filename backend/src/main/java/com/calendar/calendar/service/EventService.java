package com.calendar.calendar.service;

import com.calendar.calendar.models.EventDTO;
import com.calendar.calendar.models.EventModel;
import com.calendar.calendar.models.Users;
import com.calendar.calendar.repository.UserRepository;
import com.calendar.calendar.repository.EventRepository;

import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;

@Service
public class EventService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    // Constructor
    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public EventModel createEvent(EventModel event) {
        return eventRepository.save(event);
    }

    // Get event by id
    /*
    public List<EventModel> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    */

    public List<EventDTO> getEventsBetween(OffsetDateTime start, OffsetDateTime end) {
        List<EventModel> events = eventRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(end, start);

        return events.stream().map(event -> {
            EventDTO dto = new EventDTO();
            dto.setId(event.getId());
            dto.setTitle(event.getTitle());
            dto.setDescription(event.getDescription());
            dto.setParticipantLimit(event.getParticipantLimit());
            dto.setPrice(event.getPrice());
            dto.setStartDate(event.getStartDate());
            dto.setEndDate(event.getEndDate());

            List<String> usernames = event.getParticipants().stream()
                    .map(Users::getUsername)
                    .toList();

            dto.setParticipants(usernames);

            return dto;
        }).toList();
    }


    public Optional<EventModel> updateEvent(Long id, EventModel updatedEvent) {
        return eventRepository.findById(id).map(existing -> {
            updatedEvent.setId(id);
            return eventRepository.save(updatedEvent);
        });
    }

    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public EventModel updateParticipation(Long eventId, Long userId) {
        Optional<EventModel> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return null;
        }

        EventModel event = eventOpt.get();

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Set<Users> participants = event.getParticipants();

        if (participants.contains(user)) {
            participants.remove(user);
        } else {
            if (event.getParticipantLimit() > 0 && participants.size() >= event.getParticipantLimit()) {
                throw new IllegalStateException("Participant limit reached");
            }
            participants.add(user);
        }

        event.setParticipants(participants);
        return eventRepository.save(event);
    }
}
