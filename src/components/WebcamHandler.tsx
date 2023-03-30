import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import * as React from 'react';
import Webcam from 'react-webcam';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import { useHandDetection } from './WebcamHandler.hooks';

const WEBCAM_WIDTH = 1280;
const WEBCAM_HEIGHT = 720;

const VIDEO_CONSTRAINTS = {
  width: WEBCAM_WIDTH,
  height: WEBCAM_HEIGHT,
  facingMode: 'user',
};

const WEBCAM_CANVAS_STYLE: React.CSSProperties = {
  position: 'absolute',
  marginLeft: 'auto',
  marginRight: 'auto',
  left: 0,
  right: 0,
  textAlign: 'center',
  zIndex: 9,
  width: WEBCAM_WIDTH,
  height: WEBCAM_HEIGHT,
};

export const WebcamHandler = (): JSX.Element => {
  const detectionController = useHandDetection();

  return (
    <Container>
      <Button
        disabled={!detectionController.model}
        onClick={detectionController.isRunning ? detectionController.stopDetection : detectionController.startDetection}
      >
        {detectionController.isRunning ? 'Stop' : 'Start'}
      </Button>
      <Container style={{ height: '750px' }}>
        <Webcam
          ref={detectionController.webcamRef}
          audio={false}
          height={WEBCAM_HEIGHT}
          screenshotFormat="image/jpeg"
          width={WEBCAM_WIDTH}
          videoConstraints={VIDEO_CONSTRAINTS}
          style={WEBCAM_CANVAS_STYLE}
        ></Webcam>
        <canvas ref={detectionController.canvasRef} style={WEBCAM_CANVAS_STYLE} />
      </Container>
    </Container>
  );
};
