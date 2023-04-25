import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button } from '@mui/material';
import { getGestureDescription, useGestures } from './GestureContext';

//@ts-ignore
import * as fp from 'fingerpose';

export const GestureAdder = (): JSX.Element => {
  const [value, setValue] = React.useState('');
  const gestureController = useGestures();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newGesture = getGestureDescription(value);
    // newGesture.addCurl(fp.Finger.Pinky, fp.FingerDirection.NoCurl, 0.76);
    // newGesture.addDirection(fp.Finger.Pinky, fp.FingerDirection.VerticalUp, 0.25);

    // for (let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    //   newGesture.addCurl(finger, fp.FingerCurl.NoCurl, 0.75);
    //   newGesture.addDirection(finger, fp.FingerDirection.VerticalUp, 0.25);
    // }

    for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky, fp.Finger.Thumb]) {
      newGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
      newGesture.addDirection(finger, fp.FingerDirection.HorizontalLeft, 1.0);
      newGesture.addDirection(finger, fp.FingerDirection.HorizontalRight, 1.0);
    }

    gestureController.setAvailableGestures!([...gestureController.availableGestures, newGesture]);
    console.log(gestureController.availableGestures);
    console.log(newGesture);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel id="radio-buttons-group-label">Extended Fingers</FormLabel>
        <RadioGroup
          row
          aria-labelledby="radio-buttons-group-label"
          defaultValue="thumb"
          name="radio-buttons-group"
          onChange={handleRadioChange}
        >
          <FormControlLabel value="Thumb" control={<Radio />} label="Thumb" />
          <FormControlLabel value="Index" control={<Radio />} label="Index Finger" />
          <FormControlLabel value="Middle" control={<Radio />} label="Middle Finger" />
          <FormControlLabel value="Ring" control={<Radio />} label="Ring Finger" />
          <FormControlLabel value="Pinky" control={<Radio />} label="Pinky" />
          <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
            Add gesture
          </Button>
        </RadioGroup>
      </FormControl>
    </form>
  );
};
