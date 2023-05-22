import { useGestures } from './GestureContext';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export const PoseDataGrid: React.FC = () => {
  const { detectedPose } = useGestures();

  if (!detectedPose || !detectedPose.poseData) return null;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Direction</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {detectedPose.poseData.map((finger: any, index: number) => (
            <TableRow key={index}>
              <TableCell>
                <Typography variant="body1">
                  <b>{finger[0].toUpperCase()}</b>
                </Typography>
              </TableCell>
              <TableCell>{finger[1]}</TableCell>
              <TableCell>{finger[2]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
