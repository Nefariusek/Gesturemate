import { Container, Typography, Box, Paper } from '@mui/material';
import { useGestures } from './GestureContext';

export const GesturesInspector = (): JSX.Element => {
  const gestureController = useGestures();

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Available gestures:
      </Typography>
      {gestureController.availableGestures?.map((gesture) => (
        <Box key={gesture.pose.name} component={Paper} padding={2} marginY={1}>
          <Typography variant="body1">
            {gestureController.currentGestureName === gesture.pose.name && <strong>CURRENT</strong>}
            {gesture.pose.name} - {gesture.command || 'N/A'}
          </Typography>
        </Box>
      ))}
    </Container>
  );
};
