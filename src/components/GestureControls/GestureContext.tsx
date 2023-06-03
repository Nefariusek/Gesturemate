import * as React from 'react';
//@ts-ignore
import * as fp from 'fingerpose';

type GestureContextProviderProps = { children: React.ReactNode };

interface IGestureContext {
  availableGestures: any[];
  currentGestureName: any;
  detectedPose: any;
  isNewGestureDetectionStarted: boolean;
  setIsNewGestureDetectionStarted: React.Dispatch<any>;
  setDetectedPose?: React.Dispatch<any>;
  setCurrentGestureName?: React.Dispatch<any>;
  setAvailableGestures?: React.Dispatch<any[]>;
}

const GestureContext = React.createContext<IGestureContext | undefined>(undefined);

export const useGestures = () => {
  const context = React.useContext(GestureContext);

  if (!context) {
    throw new Error('useGestures has to be used within <GestureContext.Provider>');
  }

  return context;
};

export const GestureContextProvider = ({ children }: GestureContextProviderProps) => {
  const [availableGestures, setAvailableGestures] = React.useState<any[]>([
    { command: 'calc', pose: fp.Gestures.VictoryGesture },
    // { command: '', pose: fp.Gestures.ThumbsUpGesture },
  ]);
  const [currentGestureName, setCurrentGestureName] = React.useState<any>(null);
  const [detectedPose, setDetectedPose] = React.useState<any>(null);
  const [isNewGestureDetectionStarted, setIsNewGestureDetectionStarted] = React.useState<boolean>(false);
  const [isCooldownActive, setIsCooldownActive] = React.useState<boolean>(false);

  React.useEffect(() => {
    const currentGestureInfo = availableGestures.find((g) => g.pose.name === currentGestureName);

    if (!!currentGestureInfo && currentGestureInfo.command && !isCooldownActive) {
      setIsCooldownActive(true);
      sendRequest(currentGestureInfo.command);
      setTimeout(() => setIsCooldownActive(false), 10000); //
    }
    if (isCooldownActive) {
      console.log('Cooling down!');
    }
  }, [currentGestureName, isCooldownActive]);

  const gesturesWithMemo = React.useMemo(
    () => ({
      detectedPose,
      setDetectedPose,
      currentGestureName,
      setCurrentGestureName,
      availableGestures,
      setAvailableGestures,
      isNewGestureDetectionStarted,
      setIsNewGestureDetectionStarted,
    }),
    [
      detectedPose,
      setDetectedPose,
      availableGestures,
      setAvailableGestures,
      currentGestureName,
      setCurrentGestureName,
      isNewGestureDetectionStarted,
      setIsNewGestureDetectionStarted,
    ],
  );

  React.useEffect(() => {
    console.log('New gesture has been added!');
  }, [availableGestures]);

  return <GestureContext.Provider value={gesturesWithMemo}>{children}</GestureContext.Provider>;
};

export function getGestureEstimator(gesturesToEstimate: any) {
  return new fp.GestureEstimator(gesturesToEstimate);
}

export function getGestureDescription(name: string) {
  return new fp.GestureDescription(name);
}

async function sendRequest(command: string) {
  const response = await fetch('http://127.0.0.1:8002/', {
    method: 'POST',
    headers: {
      'Content-Type': 'raw',
    },
    mode: 'no-cors',
    body: command,
  });
  if (response.ok) {
    const responseData = await response.json();
    console.log(responseData);
  } else {
    console.error(`Failed to add gesture: ${response.status}`);
  }
}
