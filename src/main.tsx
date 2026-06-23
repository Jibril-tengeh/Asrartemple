import './storage-polyfill';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import { AudioProvider } from './contexts/AudioContext';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <ThemeProvider>
          <AudioProvider>
            <App />
          </AudioProvider>
        </ThemeProvider>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
);
