import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import type { Event } from '../../../types/globalTypes';
import dayjs from 'dayjs';

interface ViewEventModalProps {
  open: boolean;
  event: Event | null;
  onClose: () => void;
}

function handleEventRegistration()  {
  console.log("placeholder");
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({ open, event, onClose }) => {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event.title + ": "}{event.startDate.format('DD-MM-YYYY')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Typography variant="body1">{event.description}</Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>
              🕒 Time: {dayjs(event.startDate).format('HH:mm')} - {dayjs(event.endDate).format('HH:mm')}
            </Typography>
            <Typography>💰 Price: €{event.price}</Typography>
          </Box>

          <Typography>
            👥 Participants: {event.participantLimits[0]} - {event.participantLimits[1]}
          </Typography>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleEventRegistration}>
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewEventModal;
