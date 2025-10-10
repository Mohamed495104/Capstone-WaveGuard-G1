import { createTheme } from '@mui/material/styles';
import palette from './palette';
import typography from './typography';
import components from './components';

const theme = createTheme({
    palette,
    typography,
    shape: { borderRadius: 12 },
    components,
});

export default theme;
