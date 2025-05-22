import type { Dayjs } from 'dayjs';
import type { Event } from '../types/globalTypes';
import { AxiosError } from 'axios';

import api from './axiosConfig';

export function handleApiError(error: unknown, fallbackMessage = 'An unexpected error occurred'): never {
  const err = error as AxiosError<{ message?: string }>;
  const message = err.response?.data?.message || fallbackMessage;
  throw new Error(message);
}

export const saveEvent = async (eventData: Event): Promise<void> => {
  try {
    const response = await api.post('/events', eventData);
    if (response.data?.success === false) {
      throw new Error(response.data.message || 'Failed to save event');
    }
  } catch (error) {
    handleApiError(error, 'Failed to save event');
  }
};

export const updateEvent = async (eventId: string, eventData: Event): Promise<void> => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData);
    if (response.data?.success === false) {
      throw new Error(response.data.message || 'Failed to edit event');
    }
  } catch (error) {
    handleApiError(error, 'Failed to edit event');
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    if (response.data?.success === false) {
      throw new Error(response.data.message || 'Failed to delete event');
    }
  } catch (error) {
    handleApiError(error, 'Failed to delete event');
  }
};

// Removes / adds user to participants for the event and returns the updated event
export const updateParticipation = async (
  eventId: string, 
  userId: number, 
): Promise<Event> => {
  try {
    const response = await api.post(`/events/${eventId}/participation`, { userId });
    
    const responseEvent = response.data.event;

    return responseEvent;
  } catch (error) {
    handleApiError(error, 'Failed to update participation');
  }
};



export const getEvents = async (start: Dayjs, end: Dayjs): Promise<Event[]> => {
  const response = await api.get<Event[]>(`/events`, {
    params: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
  });

  return response.data;
};

export const getEventById = async (eventId: string): Promise<Event> => {
  const response = await api.get<Event>(`/events/${eventId}`);
  return response.data;
};
