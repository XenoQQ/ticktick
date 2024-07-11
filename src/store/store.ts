import { configureStore } from '@reduxjs/toolkit';
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
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
