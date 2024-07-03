import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type groupCase = 'date' | 'priority' | 'tag' | 'none';

const initialState = 'none';

const groupSlice = createSlice({
    name: 'groupSwitch',
    initialState,
    reducers: {
        switchGroupCase: (state, action: PayloadAction<groupCase>) => {
            return action.payload;
        },
    },
});

export const { switchGroupCase } = groupSlice.actions;
export default groupSlice.reducer;
