import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SortCase, GroupCase } from '../controls/types';

const initialState = { groupOption: 'none', sortOption: 'none' };

const optionsSlice = createSlice({
    name: 'options',
    initialState,
    reducers: {
        switchGroupCase: (state, action: PayloadAction<GroupCase>) => {
            state.groupOption = action.payload;
        },
        switchSortCase: (state, action: PayloadAction<SortCase>) => {
            state.sortOption = action.payload;
        },
    },
});

export const { switchGroupCase, switchSortCase } = optionsSlice.actions;
export default optionsSlice.reducer;
