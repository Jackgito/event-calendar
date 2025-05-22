package com.calendar.calendar.service;

import com.calendar.calendar.models.EventModel;
import com.calendar.calendar.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public EventModel createEvent(EventModel event) {
        return eventRepository.save(event);
    }

    public List<EventModel> getEventsBetween(OffsetDateTime start, OffsetDateTime end) {
        return eventRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(end, start);
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

    public boolean updateParticipation(Long eventId, Long userId) {
        Optional<EventModel> updatedEventOpt = eventRepository.findById(eventId).map(event -> {
            int[] currentParticipants = event.getParticipants();
            List<Integer> participantList = Arrays.stream(currentParticipants)
                    .boxed()
                    .collect(Collectors.toList());

            int userIdInt = userId.intValue();
            if (participantList.contains(userIdInt)) {
                participantList.remove(Integer.valueOf(userIdInt));
            } else {
                if (participantList.size() >= event.getParticipantLimits()[1]) {
                    throw new IllegalStateException("Participant limit reached");
                }
                participantList.add(userIdInt);
            }

            event.setParticipants(participantList.stream()
                    .mapToInt(Integer::intValue)
                    .toArray());

            return eventRepository.save(event);
        });

        return updatedEventOpt.isPresent();
    }
}
