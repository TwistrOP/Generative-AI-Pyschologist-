// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { MantineProvider } from '@mantine/core';
import '@mantine/carousel/styles.css';

// Import Mantine's CSS
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* You just need to wrap the application with MantineProvider */}
    <MantineProvider>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);