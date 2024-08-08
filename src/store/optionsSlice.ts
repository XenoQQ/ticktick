import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SortCase, GroupCase, Options } from '../controls/types';

const initialState: Options = { groupOption: 'none', sortOption: 'none', showTags: false };

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
        switchShow: (state) => {
            state.showTags = !state.showTags;
        },
    },
});

export const { switchGroupCase, switchSortCase, switchShow } = optionsSlice.actions;
export default optionsSlice.reducer;
