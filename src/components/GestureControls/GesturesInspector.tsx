import { Container } from '@mui/system';
import { useGestures } from './GestureContext';

export const GesturesInspector = (): JSX.Element => {
  const gestureController = useGestures();

  return (
    <Container>
      {gestureController.availableGestures?.map((gesture) => (
        <div key={gesture.name}>
          {gestureController.currentGestureName === gesture.name ? 'IS CURRENT => ' : ''}
          {gesture.name}
        </div>
      ))}
    </Container>
  );
};
