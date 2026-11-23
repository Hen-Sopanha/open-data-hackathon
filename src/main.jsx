import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './styles/global.css';
import App from './App.jsx';
import { I18nProvider } from './i18n/I18nContext.jsx';
import { SelectionProvider } from './state/SelectionContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      <SelectionProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SelectionProvider>
    </I18nProvider>
  </React.StrictMode>
);
