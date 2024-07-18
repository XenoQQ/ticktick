import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import todoSlice from './todoSlice';
import hashtagSlice from './hashtagSlice';
import showSlice from './showSlice';
import optionsSlice from './optionsSlice';

export const store = configureStore({
    reducer: {
        todos: todoSlice,
        hashtags: hashtagSlice,
        showSub: showSlice,
        options: optionsSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
            serializableCheck: false,
        }),
});

export const useAppDispatch = () => useDispatch<AppDispatch>();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export default store;
