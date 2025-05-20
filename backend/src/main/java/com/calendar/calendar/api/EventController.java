package com.calendar.calendar.api;

import com.calendar.calendar.db.EventModel;
import com.calendar.calendar.db.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    /**
     * Creates a new event.
     */
    @PostMapping
    public EventModel createEvent(@RequestBody EventModel event) {
        System.out.println("Create event: " + event);

        return eventRepository.save(event);
    }

    /**
     * Returns a list of events that overlap with the specified date range.
     * @param start ISO 8601 start date string
     * @param end ISO 8601 end date string
     * @return List of events overlapping the date range
     */
    @GetMapping
    public List<EventModel> getEvents(@RequestParam String start, @RequestParam String end) {
        OffsetDateTime startDateTime = OffsetDateTime.parse(start);
        OffsetDateTime endDateTime = OffsetDateTime.parse(end);

        // Fetch events overlapping the given range
        return eventRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(endDateTime, startDateTime);
    }

    /**
     * Deletes an event by ID.
     * @param id the ID of the event to delete
     * @return 204 No Content if successful, 404 Not Found if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
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

        return eventRepository.findById(id)
                .map(existingEvent -> {
                    updatedEvent.setId(id); // Ensure ID stays the same
                    return ResponseEntity.ok(eventRepository.save(updatedEvent));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
