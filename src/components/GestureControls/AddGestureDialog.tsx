import * as React from 'react';
//@ts-ignore
import * as fp from 'fingerpose';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, TextField } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { PoseDataGrid } from './PoseDataGrid';
import { useGestures } from './GestureContext';

export const AddGestureDialog: React.FC = () => {
  const { detectedPose, availableGestures, setAvailableGestures, setDetectedPose, setIsNewGestureDetectionStarted } =
    useGestures();
  const [open, setOpen] = React.useState(false);
  const [gestureName, setGestureName] = React.useState('');
  const [command, setCommand] = React.useState('');

  const handleOpen = () => {
    setIsNewGestureDetectionStarted(true);
    setOpen(true);
  };

  const handleClose = () => {
    setIsNewGestureDetectionStarted(false);
    setCommand('');
    setGestureName('');
    setOpen(false);
  };

  const handleGestureNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGestureName(event.target.value);
  };

  const handleAddGesture = () => {
    if (detectedPose && gestureName) {
      const newGesture = createGesture(gestureName, command, detectedPose.poseData);
      setAvailableGestures!([...availableGestures, newGesture]);
      handleClose();
    }
  };

  const handleResetButtonClick = () => {
    if (setDetectedPose) {
      setDetectedPose(null);
      setIsNewGestureDetectionStarted(true);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Add new gesture
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Gesture</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="gestureName"
            label="Gesture Name"
            type="text"
            fullWidth
            value={gestureName}
            onChange={handleGestureNameChange}
          />

          <TextField
            margin="dense"
            id="command-to-execute"
            label="Command to execute"
            type="text"
            fullWidth
            value={command}
            onChange={(event) => setCommand(event.target.value)}
          />
          {!detectedPose ? (
            <div>
              <CircularProgress />
              <p>Capturing...</p>
            </div>
          ) : (
            <div>
              <DoneIcon color="success" />
              <p>Captured</p>
            </div>
          )}
          <PoseDataGrid />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleResetButtonClick}>
            Reset
          </Button>
          <Button onClick={handleAddGesture}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

function createGesture(name: string, command: string, poseData: any[]) {
  const newGesture = new fp.GestureDescription(name);
  console.log(poseData);
  for (const fingepose of poseData) {
    // map finger name, curl name, direction name to FingerPose constants here
    const fingerType = getFingerType(fingepose[0]);
    const curlType = getCurlType(fingepose[1]);
    const directionType = getDirectionType(fingepose[2]);

    if (fingerType && curlType && directionType) {
      newGesture.addCurl(fingerType, curlType, 1.0);
      newGesture.addDirection(fingerType, directionType, 1.0);
    }
  }

  return { command: command, pose: newGesture };
}

function getFingerType(finger: string) {
  switch (finger) {
    case 'Thumb':
      return fp.Finger.Thumb;
    case 'Index':
      return fp.Finger.Index;
    case 'Middle':
      return fp.Finger.Middle;
    case 'Ring':
      return fp.Finger.Ring;
    case 'Pinky':
      return fp.Finger.Pinky;
    default:
      console.warn(`Unknown finger type: ${finger}`);
      return null;
  }
}

function getCurlType(curl: string) {
  switch (curl) {
    case 'No Curl':
      return fp.FingerCurl.NoCurl;
    case 'Half Curl':
      return fp.FingerCurl.HalfCurl;
    case 'Full Curl':
      return fp.FingerCurl.FullCurl;
    default:
      console.warn(`Unknown curl type: ${curl}`);
      return null;
  }
}

function getDirectionType(direction: string) {
  switch (direction) {
    case 'Vertical Up':
      return fp.FingerDirection.VerticalUp;
    case 'Vertical Down':
      return fp.FingerDirection.VerticalDown;
    case 'Horizontal Left':
      return fp.FingerDirection.HorizontalLeft;
    case 'Horizontal Right':
      return fp.FingerDirection.HorizontalRight;
    case 'Diagonal Up Left':
      return fp.FingerDirection.DiagonalUpLeft;
    case 'Diagonal Up Right':
      return fp.FingerDirection.DiagonalUpRight;
    case 'Diagonal Down Left':
      return fp.FingerDirection.DiagonalDownLeft;
    case 'Diagonal Down Right':
      return fp.FingerDirection.DiagonalDownRight;
    default:
      console.warn(`Unknown direction type: ${direction}`);
      return null;
  }
}
