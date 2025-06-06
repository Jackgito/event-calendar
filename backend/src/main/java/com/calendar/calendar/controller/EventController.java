package com.calendar.calendar.controller;

import com.calendar.calendar.models.EventDTO;
import com.calendar.calendar.models.EventModel;
import com.calendar.calendar.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * Creates a new event.
     */
    @PostMapping
    public EventModel createEvent(@RequestBody EventModel event) {
        System.out.println("Create event: " + event);
        return eventService.createEvent(event);
    }

    /**
     * Returns a list of events that overlap with the specified date range,
     * including only usernames of participants.
     */
    @GetMapping
    public List<EventDTO> getEvents(@RequestParam String start, @RequestParam String end) {
        OffsetDateTime startDateTime = OffsetDateTime.parse(start);
        OffsetDateTime endDateTime = OffsetDateTime.parse(end);
        return eventService.getEventsBetween(startDateTime, endDateTime);
    }

    /*
    @GetMapping("/{id}")
    public ResponseEntity<Void> getEventById(@PathVariable Long id) {
        if (eventService.getEventById(id)) {
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.notFound().build(); // 404
        }
    }
    */

    /**
     * Deletes an event by ID.
     * @param id the ID of the event to delete
     * @return 204 No Content if successful, 404 Not Found if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventService.deleteEvent(id)) {
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.notFound().build(); // 404
        }
    }

    /**
     * Updates an existing event.
     * @param id the ID of the event to update
     * @param updatedEvent the updated event data
     * @return the updated event if found, 404 Not Found if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<EventModel> updateEvent(@PathVariable Long id, @RequestBody EventModel updatedEvent) {
        System.out.println("Received update for event ID " + id + ": " + updatedEvent);

        return eventService.updateEvent(id, updatedEvent)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Updates participant amount
    @PostMapping("/{eventId}/participation")
    public ResponseEntity<?> setParticipation(
            @PathVariable Long eventId,
            @RequestBody Map<String, Object> payload
    ) {
        Object userIdObj = payload.get("userId");
        if (!(userIdObj instanceof Number)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid or missing userId"
            ));
        }

        Long userId = ((Number) userIdObj).longValue();

        EventModel updatedEvent;
        try {
            updatedEvent = eventService.updateParticipation(eventId, userId);
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage()
            ));
        }

        if (updatedEvent == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "Event not found"
            ));
        }

        EventDTO eventDTO = EventDTO.from(updatedEvent);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "event", eventDTO
        ));
    }

}
