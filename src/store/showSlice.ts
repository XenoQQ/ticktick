import { createSlice } from '@reduxjs/toolkit';

const initialState = false;

const showSlice = createSlice({
    name: 'showTags',
    initialState,
    reducers: {
        switchShow: (state) => {
            return !state;
        },
    },
});

export const { switchShow } = showSlice.actions;
export default showSlice.reducer;
