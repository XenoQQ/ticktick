import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../index';
import { collection, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { Hashtags } from '../controls/types';

const initialState: Hashtags = {
    tags: [],
    loading: false,
    error: null,
};

export const fetchHashtagsFromFirebase = createAsyncThunk<string[], void, { rejectValue: string }>(
    'hashtags/fetchHashtagsFromFirebase',
    async (_, { rejectWithValue }) => {
        try {
            const tagsCollection = collection(db, 'hashtags');
            const tagsSnapshot = await getDocs(tagsCollection);
            const tags = tagsSnapshot.docs.map((doc) => doc.data().content as string);
            return tags;
        } catch (error) {
            console.error('Error fetching tags from Firebase', error);
            return rejectWithValue('Failed to fetch tags');
        }
    },
);

export const syncHashtagsWithFirebase = createAsyncThunk<void, string[], { rejectValue: string }>(
    'hashtags/syncHashtagsWithFirebase',
    async (tags, { rejectWithValue }) => {
        try {
            const tagsCollection = collection(db, 'hashtags');
            for (const tag of tags) {
                const tagDoc = doc(tagsCollection, tag);
                await setDoc(tagDoc, { content: tag });
            }
        } catch (error) {
            console.error('Error syncing tags with Firebase: ', error);
            return rejectWithValue('Failed to sync tags');
        }
    },
);

export const deleteHashTagFromFirebase = createAsyncThunk<void, string, { rejectValue: string }>(
    'hashtags/deleteHashTagFromFirebase',
    async (tag, { rejectWithValue }) => {
        try {
            const tagsCollection = collection(db, 'hashtags');
            const tagDoc = doc(tagsCollection, tag);
            await deleteDoc(tagDoc);
        } catch (error) {
            console.error('Error deleting tag from Firebase: ', error);
            return rejectWithValue('Failed to delete tag');
        }
    },
);

const hashtagSlice = createSlice({
    name: 'hashtags',
    initialState,
    reducers: {
        addTag: (state, action: PayloadAction<string[]>) => {
            const tags = action.payload;
            tags.forEach((tag) => {
                if (!state.tags.includes(tag)) {
                    state.tags.push(tag);
                }
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(syncHashtagsWithFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(syncHashtagsWithFirebase.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(syncHashtagsWithFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchHashtagsFromFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHashtagsFromFirebase.fulfilled, (state, action) => {
                state.tags = action.payload;
                state.loading = false;
            })
            .addCase(fetchHashtagsFromFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteHashTagFromFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteHashTagFromFirebase.fulfilled, (state, action) => {
                const tagToDelete = action.meta.arg;

                state.tags = state.tags.filter((tag) => tag !== tagToDelete);
                state.loading = false;
            })
            .addCase(deleteHashTagFromFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addTag } = hashtagSlice.actions;
export default hashtagSlice.reducer;
