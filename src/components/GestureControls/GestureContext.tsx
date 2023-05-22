import * as React from 'react';
//@ts-ignore
import * as fp from 'fingerpose';

type GestureContextProviderProps = { children: React.ReactNode };

interface IGestureContext {
  availableGestures: any[];
  currentGestureName: any;
  detectedPose: any;
  setDetectedPose?: React.Dispatch<any>;
  setCurrentGestureName?: React.Dispatch<any>;
  setAvailableGestures?: React.Dispatch<any[]>;
}

const GestureContext = React.createContext<IGestureContext>({
  availableGestures: [],
  currentGestureName: null,
  detectedPose: null,
});

export const useGestures = () => {
  const context = React.useContext(GestureContext);

  if (!context) {
    throw new Error('useGestures has to be used within <GestureContext.Provider>');
  }

  return context;
};

export const GestureContextProvider = ({ children }: GestureContextProviderProps) => {
  const [availableGestures, setAvailableGestures] = React.useState<any[]>([
    fp.Gestures.VictoryGesture,
    fp.Gestures.ThumbsUpGesture,
  ]);
  const [currentGestureName, setCurrentGestureName] = React.useState<any>(null);
  const [detectedPose, setDetectedPose] = React.useState<any>(null);

  React.useEffect(() => {
    if (currentGestureName === 'victory') {
      sendCalculatorRequest();
    }
  }, [currentGestureName]);

  const gesturesWithMemo = React.useMemo(
    () => ({
      detectedPose,
      setDetectedPose,
      currentGestureName,
      setCurrentGestureName,
      availableGestures,
      setAvailableGestures,
    }),
    [detectedPose, setDetectedPose, availableGestures, setAvailableGestures, currentGestureName, setCurrentGestureName],
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

async function sendCalculatorRequest() {
  const response = await fetch('http://127.0.0.1:8002/', {
    method: 'POST',
    headers: {
      'Content-Type': 'raw',
    },
    mode: 'no-cors',
    body: 'calc',
  });
  if (response.ok) {
    const responseData = await response.json();
    console.log(responseData);
  } else {
    console.log(response);
    console.error(`Failed to add gesture: ${response.status}`);
  }
}
