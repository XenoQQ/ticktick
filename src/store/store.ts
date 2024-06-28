import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./todoSlice.ts";
import groupSlice from "./groupSlice.ts";

export const store = configureStore({
    reducer: {
        todos: todoSlice,
        groupSwitch: groupSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
