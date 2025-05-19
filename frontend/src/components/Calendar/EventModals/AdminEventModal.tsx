import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Slider,
  Typography
} from '@mui/material';
import { TimeRangePicker } from './TimeRangePicker/TimeRangePicker';
import { PriceSelector } from './PriceSelector/PriceSelector';
import { Dayjs } from 'dayjs';
import { useSnackbar } from '@context/SnackbarContext';
import type { Event } from "../../../types/globalTypes"
import dayjs from 'dayjs';

interface CreateEventModalProps {
  open: boolean;
  startDate: Dayjs | null,
  endDate: Dayjs | null,
  onClose: () => void;
  onSave: (eventData: Event) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
  eventToEdit?: Event | null;
}

const AdminEventModal: React.FC<CreateEventModalProps> = ({
  open,
  startDate,
  endDate,
  onClose,
  onSave,
  onDelete,
  eventToEdit = null
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [participantLimits, setParticipantLimits] = useState<number[]>([4, 20]);
  const [price, setPrice] = useState(0);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const { showSnackbar } = useSnackbar();

  // Populate fields on open/edit
  useEffect(() => {
    if (open) {
      if (eventToEdit) {
        setName(eventToEdit.title);
        setDescription(eventToEdit.description || '');
        setParticipantLimits(eventToEdit.participantLimits || [4, 20]);
        setPrice(eventToEdit.price ?? 0);
        setStartTime(dayjs(eventToEdit.startDate).format("HH:mm"));
        setEndTime(dayjs(eventToEdit.endDate).format("HH:mm"));
      } else {
        setName('');
        setDescription('');
        setParticipantLimits([4, 20]);
        setPrice(0);
        setStartTime('09:00');
        setEndTime('10:00');
      }
    }
  }, [open, eventToEdit]);

  const handleParticipantChange = (_event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    setParticipantLimits(Array.isArray(newValue) ? newValue : [newValue, newValue]);
  };

  const handleSave = async () => {
    if (!name || name.trim().length < 3) {
      showSnackbar('Event name must be at least 3 characters.', 'warning');
      return;
    }

    if (startTime >= endTime) {
      showSnackbar('Start time must be before end time.', 'warning');
      return;
    }

    if (price < 0 || price > 1000) {
      showSnackbar('Price must be between 0 and 1000.', 'warning');
      return;
    }

    if (participantLimits[0] > participantLimits[1]) {
      showSnackbar('Minimum participants cannot exceed maximum.', 'warning');
      return;
    }

    // Ensure startDate and endDate are present
    const resolvedStartDate = startDate ?? eventToEdit?.startDate;
    const resolvedEndDate = endDate ?? eventToEdit?.endDate;

    const eventData: Event = {
      title: name,
      description,
      participantLimits,
      price,
      startDate: resolvedStartDate!,
      endDate: resolvedEndDate!,
    };

    try {
      await onSave(eventData);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

   const handleDeletion = async () => {

    const eventId = eventToEdit?.id
    if (eventId == null) return;

    try {
      await onDelete(eventId);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      {eventToEdit
        ? `Edit Event: ${
            eventToEdit.startDate && eventToEdit.endDate
              ? dayjs(eventToEdit.startDate).isSame(dayjs(eventToEdit.endDate), 'day')
                ? dayjs(eventToEdit.startDate).format('DD-MM-YY')
                : `${dayjs(eventToEdit.startDate).format('DD-MM-YY')} - ${dayjs(eventToEdit.endDate).format('DD-MM-YY')}`
              : eventToEdit.startDate
                ? dayjs(eventToEdit.startDate).format('DD-MM-YY')
                : ''
          }`
        : `Create Event: ${
            startDate && endDate
              ? dayjs(startDate).isSame(dayjs(endDate), 'day')
                ? dayjs(startDate).format('DD-MM-YY')
                : `${dayjs(startDate).format('DD-MM-YY')} - ${dayjs(endDate).format('DD-MM-YY')}`
              : startDate
                ? dayjs(startDate).format('DD-MM-YY')
                : ''
          }`
      }
</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <TimeRangePicker
              initialStartTime={startTime}
              initialEndTime={endTime}
              onTimeChange={(start, end) => {
                setStartTime(start);
                setEndTime(end);
              }}
            />

            <PriceSelector
              initialPrice={price}
              onPriceChange={setPrice}
              minPrice={0}
              maxPrice={1000}
            />
          </Box>

          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              Participant Limits: {participantLimits[0]} - {participantLimits[1]}
            </Typography>
            <Slider
              getAriaLabel={() => 'Participant range'}
              value={participantLimits}
              onChangeCommitted={handleParticipantChange}
              valueLabelDisplay="auto"
              sx={{ flex: 1 }}
              min={1}
              max={100}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSave}>
          {eventToEdit ? 'Update Event' : 'Create Event'}
        </Button>
        {eventToEdit &&
        <Button variant="contained" color="warning" onClick={handleDeletion}>
          Delete Event
        </Button>
        }
      </DialogActions>
    </Dialog>
  );
};


export default AdminEventModal;
