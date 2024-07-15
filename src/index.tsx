import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Normalize } from 'styled-normalize';
import store from './store/store';
import { Provider } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: 'AIzaSyD0AukGZt1UozbjQl-FBR9UO5hbVsGVS5M',
    authDomain: 'todolist-c137.firebaseapp.com',
    projectId: 'todolist-c137',
    storageBucket: 'todolist-c137.appspot.com',
    messagingSenderId: '428077446248',
    appId: '1:428077446248:web:d1535f15b948e18bdc77dd',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
getAnalytics(app);

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement!);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Normalize />
            <App />
        </Provider>
    </React.StrictMode>,
);

export { db };
