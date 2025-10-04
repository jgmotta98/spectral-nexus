import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import i18next from 'i18next';
import translation_en from './translations/en.json';
import translation_pt from './translations/pt.json';
import { I18nextProvider } from 'react-i18next';

const enResource = translation_en.default || translation_en;
const ptResource = translation_pt.default || translation_pt;

i18next.init({
  interpolation: {escapeValue: false},
  lng: "pt",
  resources:{
    en:{
      global: enResource
    },
    pt:{
      global: ptResource
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </StrictMode>,
)
