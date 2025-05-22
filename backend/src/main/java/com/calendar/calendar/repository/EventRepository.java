package com.calendar.calendar.repository;

import com.calendar.calendar.models.EventModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventModel, Long> {

    // Find events where the event's date range overlaps with the given range
    List<EventModel> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(OffsetDateTime end, OffsetDateTime start);
}
