import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '#utils/auth';
import { App } from '#src/App.tsx';

import '#src/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
