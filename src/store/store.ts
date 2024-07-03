import { configureStore } from '@reduxjs/toolkit';
import todoSlice from './todoSlice';
import groupSlice from './groupSlice';

export const store = configureStore({
    reducer: {
        todos: todoSlice,
        groupSwitch: groupSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
