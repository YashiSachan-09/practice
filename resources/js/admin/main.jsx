import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../../css/app.css';
import App from './App.jsx';

const rootEl = document.getElementById('admin-root');

if (rootEl) {
    createRoot(rootEl).render(
        <StrictMode>
            <BrowserRouter basename="/admin">
                <App />
            </BrowserRouter>
        </StrictMode>,
    );
}
