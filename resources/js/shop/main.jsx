import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

const root = document.getElementById('shop-root');

if (root) {
    createRoot(root).render(
        <React.StrictMode>
            <BrowserRouter basename="/shop">
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
}
