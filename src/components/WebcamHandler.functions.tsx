import * as hp from '@tensorflow-models/handpose';

interface IFingerLandmarks {
  thumb: number[];
  indexFinger: number[];
  middleFinger: number[];
  ringFinger: number[];
  pinky: number[];
}

const fingerLandmarks: IFingerLandmarks = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

export function drawLandmarks(predictions: hp.AnnotatedPrediction[], ctx: CanvasRenderingContext2D) {
  if (predictions.length > 0) {
    predictions.forEach((p) => {
      const landmarks = p.landmarks;

      // Loop through fingers
      for (let j = 0; j < Object.keys(fingerLandmarks).length; j++) {
        let finger = Object.keys(fingerLandmarks)[j] as keyof IFingerLandmarks;
        //  Loop through pairs of joints
        for (let k = 0; k < fingerLandmarks[finger].length - 1; k++) {
          // Get pairs of joints
          const firstJointIndex = fingerLandmarks[finger][k];
          const secondJointIndex = fingerLandmarks[finger][k + 1];

          // Draw path
          ctx.beginPath();
          ctx.moveTo(landmarks[firstJointIndex][0], landmarks[firstJointIndex][1]);
          ctx.lineTo(landmarks[secondJointIndex][0], landmarks[secondJointIndex][1]);
          ctx.strokeStyle = 'green';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      landmarks.forEach(([xCoord, yCoord]) => {
        ctx.beginPath();
        ctx.arc(xCoord, yCoord, 5, 0, 3 * Math.PI);

        ctx.fillStyle = 'red';
        ctx.fill();
      });
    });
  }
}
