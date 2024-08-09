import { createRoot } from 'react-dom/client'
import './index.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme.ts'
import AppRoutes from './routes.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* This applies the default MUI baseline styles */}
    <AppRoutes />
  </ThemeProvider>
)
