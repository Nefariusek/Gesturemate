import * as React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeContext } from './contexts/ColorModeContext';
import { ColorModeToggle } from './components/ColorModeToggle';
import Box from '@mui/material/Box';
import { WebcamHandler } from './components/WebcamHandler/WebcamHandler';
import { GestureContextProvider } from './components/GestureControls/GestureContext';
import { GesturesInspector } from './components/GestureControls/GesturesInspector';
// import { GestureAdder } from './components/GestureControls/GestureAdder';
import { AddGestureDialog } from './components/GestureControls/AddGestureDialog';

export const App = (): JSX.Element => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <GestureContextProvider>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default',
              color: 'text.primary',
              borderRadius: 1,
              p: 3,
            }}
          >
            <div style={{ display: 'flex' }}>
              <ColorModeToggle />
              <GesturesInspector />
            </div>
            <WebcamHandler />
            <div>
              {/* <GestureAdder /> */}
              <AddGestureDialog />
            </div>
          </Box>
        </GestureContextProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
