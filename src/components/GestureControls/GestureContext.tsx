import * as React from 'react';
//@ts-ignore
import * as fp from 'fingerpose';

type GestureContextProviderProps = { children: React.ReactNode };

interface IGestureContext {
  availableGestures: any[];
  currentGestureName: any;
  setCurrentGestureName?: React.Dispatch<any>;
  setAvailableGestures?: React.Dispatch<any[]>;
}

const GestureContext = React.createContext<IGestureContext>({
  availableGestures: [],
  currentGestureName: null,
});

export const useGestures = () => {
  const context = React.useContext(GestureContext);

  if (!context) {
    throw new Error('useGestures has to be used within <GestureContext.Provider>');
  }

  return context;
};

export const GestureContextProvider = ({ children }: GestureContextProviderProps) => {
  const [availableGestures, setAvailableGestures] = React.useState<any>([
    fp.Gestures.VictoryGesture,
    fp.Gestures.ThumbsUpGesture,
  ]);
  const [currentGestureName, setCurrentGestureName] = React.useState<any>(null);

  console.log(currentGestureName);
  const gesturesWithMemo = React.useMemo(
    () => ({
      currentGestureName,
      setCurrentGestureName,
      availableGestures,
      setAvailableGestures,
    }),
    [availableGestures, setAvailableGestures, currentGestureName, setCurrentGestureName],
  );

  return <GestureContext.Provider value={gesturesWithMemo}>{children}</GestureContext.Provider>;
};

export function getGestureEstimator(gesturesToEstimate: any) {
  return new fp.GestureEstimator(gesturesToEstimate);
}

export function getGestureDescription(name: string) {
  return new fp.GestureDescription(name);
}
