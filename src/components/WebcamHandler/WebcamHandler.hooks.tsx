import * as React from 'react';
import * as hp from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';

import { drawLandmarks } from './WebcamHandler.functions';
import { getGestureEstimator, useGestures } from '../GestureControls/GestureContext';

export function useHandDetection() {
  const webcamRef = React.useRef<Webcam>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const gestureController = useGestures();

  const [model, setModel] = React.useState<hp.HandPose | undefined>();
  const [handDetectionInterval, setHandDetectionInterval] = React.useState<NodeJS.Timer>();
  const [poseHistory, setPoseHistory] = React.useState<any[]>([]);

  const loadModel = async () => {
    setModel(await hp.load());
  };

  const ref = React.useRef({ gestureController }).current;
  ref.gestureController = gestureController;

  const detectHandpose = async (model: hp.HandPose) => {
    const video = webcamRef.current?.video;
    if (video && video.readyState === 4) {
      const { videoWidth: width, videoHeight: height } = video;

      video.width = width;
      video.height = height;

      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }

      const hand = await model.estimateHands(video);

      if (hand.length > 0) {
        const estimator = getGestureEstimator(ref.gestureController.availableGestures.map((gesture) => gesture.pose));
        const gesture = await estimator.estimate(hand[0].landmarks, 8);
        gestureController.setCurrentGestureName!(gesture.gestures[0]?.name);

        if (ref.gestureController.isNewGestureDetectionStarted) {
          setPoseHistory((oldPoseHistory) => {
            if (oldPoseHistory.length > 20) {
              oldPoseHistory.shift();
            }
            return [...oldPoseHistory, gesture];
          });
        }
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        drawLandmarks(hand, ctx);
      }
    }
  };

  const startDetection = () => {
    if (model) {
      setHandDetectionInterval(setInterval(() => detectHandpose(model), 100));
    }
  };

  const stopDetection = () => {
    clearInterval(handDetectionInterval);
    setHandDetectionInterval(undefined);
  };

  React.useEffect(() => {
    loadModel();
  }, []);

  React.useEffect(() => {
    if (gestureController.isNewGestureDetectionStarted === true && !gestureController.detectedPose) {
      const mostCommonPose = calculateMostCommonPose(poseHistory);
      console.log(mostCommonPose);
      if (mostCommonPose && gestureController.setDetectedPose) {
        gestureController.setDetectedPose(mostCommonPose);
      }
    }
  }, [poseHistory]);

  React.useEffect(() => {}, [gestureController.availableGestures]);

  return { webcamRef, canvasRef, model, startDetection, stopDetection, isRunning: !!handDetectionInterval };
}

function calculateMostCommonPose(poseHistory: any[]) {
  const frequencyMap: { [pose: string]: number } = {};

  for (const pose of poseHistory) {
    const poseStr = JSON.stringify(pose);
    if (frequencyMap[poseStr]) {
      frequencyMap[poseStr]++;
    } else {
      frequencyMap[poseStr] = 1;
    }
  }

  let mostCommonPose = null;
  let maxCount = 0;
  for (const poseStr in frequencyMap) {
    if (frequencyMap[poseStr] > maxCount) {
      maxCount = frequencyMap[poseStr];
      mostCommonPose = JSON.parse(poseStr);
    }
  }

  return mostCommonPose;
}
