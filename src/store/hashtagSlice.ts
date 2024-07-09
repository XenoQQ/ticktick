import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: string[] = [];

const hashtagSlice = createSlice({
    name: 'hashtags',
    initialState,
    reducers: {
        addTag: (state, action: PayloadAction<string[]>) => {
            const tags = action.payload;
            tags.forEach((tag) => {
                if (!state.includes(tag)) {
                    state.push(tag);
                }
            });
        },
    },
});

export const { addTag } = hashtagSlice.actions;
export default hashtagSlice.reducer;
