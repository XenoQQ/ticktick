import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import todoSlice from './todoSlice';
import groupSlice from './groupSlice';
import hashtagSlice from './hashtagSlice';
import showSlice from './showSlice';

export const store = configureStore({
    reducer: {
        todos: todoSlice,
        groupSwitch: groupSlice,
        hashtags: hashtagSlice,
        showSub: showSlice,
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
