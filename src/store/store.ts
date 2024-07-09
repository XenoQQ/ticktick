import { configureStore } from '@reduxjs/toolkit';
import todoSlice from './todoSlice';
import groupSlice from './groupSlice';
import hashtagSlice from './hashtagSlice';

export const store = configureStore({
    reducer: {
        todos: todoSlice,
        groupSwitch: groupSlice,
        hashtags: hashtagSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
