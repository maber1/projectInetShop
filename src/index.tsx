import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider, rootStore } from './store';
import './styles/index.module.scss';
import { ThemeProvider } from './providers/ThemeProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider value={rootStore}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
