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
  onUpdate: (eventId: string, eventData: Event) => Promise<void>;
  eventToEdit?: Event | null;
}

const AdminEventModal: React.FC<CreateEventModalProps> = ({
  open,
  startDate,
  endDate,
  onClose,
  onSave,
  onDelete,
  onUpdate,
  eventToEdit = null
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [participantLimit, setParticipantLimit] = useState<number>(4);
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
        setParticipantLimit(eventToEdit.participantLimit || 4);
        setPrice(eventToEdit.price ?? 0);
        setStartTime(dayjs(eventToEdit.startDate).format("HH:mm"));
        setEndTime(dayjs(eventToEdit.endDate).format("HH:mm"));

      } else {
        setName('');
        setDescription('');
        setParticipantLimit(4);
        setPrice(0);
        setStartTime('09:00');
        setEndTime('10:00');
      }
    }
  }, [open, eventToEdit]);

  const handleUpdate = async () => {
    if (!name || name.trim().length < 3) {
      showSnackbar('Event name must be at least 3 characters.', 'warning');
      return;
    }

    const resolvedStartDate = (startDate ?? dayjs(eventToEdit?.startDate)).hour(Number(startTime.split(":")[0])).minute(Number(startTime.split(":")[1]));
    const resolvedEndDate = (endDate ?? dayjs(eventToEdit?.endDate)).hour(Number(endTime.split(":")[0])).minute(Number(endTime.split(":")[1]));

    const eventData: Event = {
      ...eventToEdit,
      title: name,
      description,
      participantLimit,
      price,
      startDate: resolvedStartDate,
      endDate: resolvedEndDate,
    };

    try {
      if (eventToEdit?.id) {
        await onUpdate(eventToEdit.id, eventData);
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!name || name.trim().length < 3) {
      showSnackbar('Event name must be at least 3 characters.', 'warning');
      return;
    }

    const resolvedStartDate = (startDate ?? dayjs()).hour(Number(startTime.split(":")[0])).minute(Number(startTime.split(":")[1]));
    const resolvedEndDate = (endDate ?? dayjs()).hour(Number(endTime.split(":")[0])).minute(Number(endTime.split(":")[1]));

    const eventData: Event = {
      title: name,
      description,
      participantLimit,
      price,
      startDate: resolvedStartDate,
      endDate: resolvedEndDate,
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
                : `${dayjs(eventToEdit.startDate).format('DD-MM-YY')} — ${dayjs(eventToEdit.endDate).format('DD-MM-YY')}`
              : eventToEdit.startDate
                ? dayjs(eventToEdit.startDate).format('DD-MM-YY')
                : ''
          }`
        : `Create Event: ${
            startDate && endDate
              ? dayjs(startDate).isSame(dayjs(endDate), 'day')
                ? dayjs(startDate).format('DD-MM-YY')
                : `${dayjs(startDate).format('DD-MM-YY')} — ${dayjs(endDate).format('DD-MM-YY')}`
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
              Participant Limit: {participantLimit}
            </Typography>
            <Slider
              getAriaLabel={() => 'Participant range'}
              value={participantLimit} 
              onChange={(_event, newLimit) => setParticipantLimit(newLimit as number)}
              valueLabelDisplay="auto"
              sx={{ flex: 1 }}
              min={1}
              max={100}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {!eventToEdit ? (
          <Button variant="contained" onClick={handleSave}>
            Create Event
          </Button>
        ) : (
          <>
            <Button variant="contained" onClick={handleUpdate}>
              Update Event
            </Button>
            <Button variant="contained" color="warning" onClick={handleDeletion}>
              Delete Event
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};


export default AdminEventModal;
