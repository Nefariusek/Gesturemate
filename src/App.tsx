import * as React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeContext } from './contexts/ColorModeContext';
import { ColorModeToggle } from './components/ColorModeToggle';
import { WebcamHandler } from './components/WebcamHandler';
import Box from '@mui/material/Box';

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
          <ColorModeToggle />
          <WebcamHandler />
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
