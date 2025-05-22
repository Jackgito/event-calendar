import { useState, useEffect } from 'react';
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
import { useAuthentication } from '@/context/AuthenticationContext';
import { useSnackbar } from '@/context/SnackbarContext';
import { updateParticipation } from '@/API/eventService';

interface ViewEventModalProps {
  open: boolean;
  event: Event | null;
  onClose: () => void;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({ open, event, onClose }) => {
  
  const { user } = useAuthentication();
  const { showSnackbar } = useSnackbar();
  const [localEvent, setLocalEvent] = useState<Event | null>(event);


  useEffect(() => {
    setLocalEvent(event);
  }, [event]);

  const handleEventParticipation = async () => {
    if (user && localEvent) {
      try {
        const updated = await updateParticipation(localEvent.id!, user.id!);
        setLocalEvent(updated);
        showSnackbar("Participation updated!", "success");
      } catch (err) {
        console.error(err);
      }
    } else {
      showSnackbar("Login to participate!");
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {localEvent?.title + ": "}
        {localEvent && dayjs(localEvent.startDate).format('DD-MM-YYYY')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Typography variant="body1">{localEvent?.description}</Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>
              🕒 Time: {localEvent && dayjs(localEvent.startDate).format('HH:mm')} - {localEvent && dayjs(localEvent.endDate).format('HH:mm')}
            </Typography>
            <Typography>💰 Price: €{localEvent?.price}</Typography>
          </Box>

          <Typography>
            👥 Participants: {(localEvent?.participants?.length ?? 0) + " / " + (localEvent?.participantLimit ?? 0)}
          </Typography>
          {localEvent?.participants && localEvent.participants.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {localEvent.participants.map((name: string, idx: number) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleEventParticipation}>
          Participate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewEventModal;
