// Types used in multiple files should be created here

import type { Dayjs } from 'dayjs';

export interface Event {
  id?: string;
  title: string;
  
  startDate: Dayjs;
  endDate: Dayjs;

  description: string;
  participantLimit: number;
  price: number;
  participants?: string[];

  repetition?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval?: number;
    count?: number;
    until?: Dayjs;
    daysOfWeek?: number[];
  };
}
