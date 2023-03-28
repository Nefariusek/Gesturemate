import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeContext } from './contexts/ColorModeContext';
import { ColorModeToggle } from './components/ColorModeToggle';

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
        <ColorModeToggle />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
