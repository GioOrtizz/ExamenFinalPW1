import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Asegúrate de que este path sea correcto
import './index.css'; // Asegúrate de que este path sea correcto

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App /> {/* Aquí es donde se renderiza tu componente principal */}
  </React.StrictMode>,
);