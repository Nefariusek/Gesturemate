import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import * as React from 'react';
import * as hp from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';

import { drawLandmarks } from './WebcamHandler.functions';
import { getGestureEstimator, useGestures } from '../GestureControls/GestureContext';

export function useHandDetection() {
  const webcamRef = React.useRef<Webcam>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const gestureController = useGestures();

  const [model, setModel] = React.useState<hp.HandPose | undefined>();
  const [handDetectionInterval, setHandDetectionInterval] = React.useState<NodeJS.Timer>();

  const loadModel = async () => {
    const model: hp.HandPose = await hp.load();
    setModel(model);
    console.log('Model loaded');
  };

  const detectHandpose = async (model: hp.HandPose) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      if (canvasRef.current) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
      }

      const hand = await model.estimateHands(video);

      if (hand.length > 0) {
        const estimator = getGestureEstimator(gestureController.availableGestures);
        console.log(gestureController.availableGestures);
        const gesture = await estimator.estimate(hand[0].landmarks, 8);
        console.log(gesture);
        gestureController.setCurrentGestureName!(gesture.gestures[0]?.name);
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        drawLandmarks(hand, ctx);
      }
    }
  };

  const startDetection = () => {
    if (model) {
      const interval = setInterval(() => {
        detectHandpose(model);
      }, 100);

      setHandDetectionInterval(interval);
    }
  };

  const stopDetection = () => {
    if (model) {
      clearInterval(handDetectionInterval);
      setHandDetectionInterval(undefined);
    }
  };

  React.useEffect(() => {
    loadModel();
  }, []);

  return { webcamRef, canvasRef, model, startDetection, stopDetection, isRunning: !!handDetectionInterval };
}