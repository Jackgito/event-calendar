import { useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';         // Month view
import timeGridPlugin from '@fullcalendar/timegrid';       // Week and day views
import listPlugin from '@fullcalendar/list';              // List view
import interactionPlugin from '@fullcalendar/interaction'; // For clicks, selections, etc.


import AdminEventModal from './EventModals/AdminEventModal';
import ViewEventModal from './EventModals/ViewEventModal'; // <-- Create this
import type { EventInput, DatesSetArg } from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';
import dayjs, { Dayjs } from 'dayjs';
import type { Event } from "../../types/globalTypes"
import { saveEvent, getEvents, deleteEvent, updateEvent } from '@/API/eventService';
import { useSnackbar } from '@context/SnackbarContext';
import type { AxiosError } from 'axios';
import type { EventClickArg } from '@fullcalendar/core';
import { useAuthentication } from '@/context/AuthenticationContext';

import './Calendar.css';

export default function EventCalendar () {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentStart, setCurrentStart] = useState<Dayjs | null>(null);
  const [currentEnd, setCurrentEnd] = useState<Dayjs | null>(null);
  const [currentView, setCurrentView] = useState<string>('dayGridMonth'); // <== Add this
  const { isAdmin } = useAuthentication();
  const { showSnackbar } = useSnackbar();

  const fetchEvents = async (startDate: Dayjs, endDate: Dayjs) => {
    try {
      const data = await getEvents(startDate, endDate);

      const mappedEvents = data.map(evt => ({
        id: evt.id,
        title: evt.title,
        start: dayjs(evt.startDate).toISOString(),
        end: dayjs(evt.endDate).toISOString(),
        extendedProps: {
          description: evt.description,
          participantLimit: evt.participantLimit,
          price: evt.price,
          participants: evt.participants
        },
      }));

      setEvents(mappedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      showSnackbar('Failed to load events', 'error');
    }
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    const start = dayjs(arg.start);
    const end = dayjs(arg.end);
    setCurrentView(arg.view.type);
    setCurrentStart(start);
    setCurrentEnd(end);
    fetchEvents(start, end);
  };

  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = dayjs(arg.dateStr);
    const hour = clickedDate.hour(); // This extracts the hour (0-23)

    setStartDate(clickedDate);
    setEndDate(clickedDate);
    setSelectedEvent(null); // reset selected event for create mode
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const ext = clickInfo.event.extendedProps;

    const eventData: Event = {
      id: clickInfo.event.id ?? '',
      title: clickInfo.event.title,
      description: ext.description,
      startDate: dayjs(clickInfo.event.start),
      endDate: dayjs(clickInfo.event.end),
      participantLimit: ext.participantLimit,
      participants: ext.participants,
      price: ext.price,
    };

    if (isAdmin) {
      // Edit mode
      setSelectedEvent(eventData);
      setModalOpen(true);
    } else {
      // View-only mode
      setSelectedEvent(eventData);
      setViewModalOpen(true);
    }
  };

  const handleSaveEvent = async (eventData: Event): Promise<void> => {
    try {
      await saveEvent(eventData);
      showSnackbar(
        'Event created successfully!',
        'success'
      );
      handleCloseModal();

      await refreshCalendar();

    } catch (error) {
      const axiosError = error as AxiosError;
      const message = axiosError.message ?? 'Failed to save event. Please try again.';
      showSnackbar(message, 'error');
    }
  };

  const handleUpdateEvent = async (eventId: string, eventData: Event): Promise<void> => {
    try {
      await updateEvent(eventId, eventData);
      showSnackbar(
        'Event updated successfully!',
        'success'
      );
      handleCloseModal();

      await refreshCalendar();

    } catch (error) {
      const axiosError = error as AxiosError;
      const message = axiosError.message ?? 'Failed to update event. Please try again.';
      showSnackbar(message, 'error');
    }
  };

  const handleDeleteEvent = async (eventId: string): Promise<void> => {
    try {
      await deleteEvent(eventId);
      showSnackbar("Event deleted successfully!", 'success');
      handleCloseModal();

      await refreshCalendar();

    } catch (error) {
      const axiosError = error as AxiosError;
      const message = axiosError.message ?? 'Failed to delete event. Please try again.';
      showSnackbar(message, 'error');
    }
  };

  const handleDateSelection = (selectInfo: { start: Date; end: Date }) => {
    setStartDate(dayjs(selectInfo.start));

    if (currentView === 'dayGridMonth') {
      setEndDate(dayjs(selectInfo.end).subtract(1, 'second'));
    } else {
      setEndDate(dayjs(selectInfo.end));
    }

    setModalOpen(true);
  };

  const refreshCalendar = async () => {
    if (currentStart && currentEnd) {
      await fetchEvents(currentStart, currentEnd);
    }
  };


  const handleCloseModal = () => {
    setModalOpen(false);
    setStartDate(null);
    setEndDate(null);
    setSelectedEvent(null);
  };

  return (
    <div className='calendarContainer'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        firstDay={1}
        initialView="dayGridMonth"
        events={events}
        datesSet={handleDatesSet}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        select={handleDateSelection} // Is called with multi selection as well
        selectable={true}
        height="auto"
        aspectRatio={1.9}
        expandRows={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        }}
        // displayEventTime={false}
      />

      {isAdmin && (
        <AdminEventModal
          open={modalOpen}
          startDate={startDate}
          endDate={endDate}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onUpdate={handleUpdateEvent}
          eventToEdit={selectedEvent}
        />
      )}

      {!isAdmin && (
        <ViewEventModal
          open={viewModalOpen}
          event={selectedEvent}
          onClose={() => setViewModalOpen(false)}
        />
      )}
    </div>
  );
}
