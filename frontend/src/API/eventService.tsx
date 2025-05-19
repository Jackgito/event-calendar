import type { Dayjs } from 'dayjs';
import type { Event } from '../types/globalTypes';

import api from './axiosConfig';

export const saveEvent = async (eventData: Event): Promise<void> => {
  const response = await api.post('/events', eventData);

  if (response.data?.success === false) {
    throw new Error(response.data.message || 'Failed to save event');
  }
};

export const editEvent = async (eventData: Event): Promise<void> => {
  const response = await api.put(`/events/${eventData.id}`, eventData);

  if (response.data?.success === false) {
    throw new Error(response.data.message || 'Failed to edit event');
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const response = await api.delete(`/events/${eventId}`);
  if (response.data?.success === false) {
    throw new Error(response.data.message || 'Failed to delete event');
  }
};

export const getEvents = async (start: Dayjs, end: Dayjs): Promise<Event[]> => {
  const response = await api.get<Event[]>(`/events`, {
    params: {
      start: start.toISOString(),  // Correct format
      end: end.toISOString(),      // Correct format
    },
  });
  return response.data;
};


