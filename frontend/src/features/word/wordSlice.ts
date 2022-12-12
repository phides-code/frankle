import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface WordState {
    word: string;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: WordState = {
    word: '',
    status: 'idle',
};

export const fetchWord = createAsyncThunk('word/fetchWord', async () => {
    const rawFetchResponse = await fetch('/api/getword');
    const fetchResponse = await rawFetchResponse.json();

    return fetchResponse.data as string;
});

const wordSlice = createSlice({
    name: 'word',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchWord.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWord.fulfilled, (state, action) => {
                state.status = 'idle';
                state.word = action.payload;
            })
            .addCase(fetchWord.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const selectWord = (state: RootState) => state.word.word;
export const selectWordStatus = (state: RootState) => state.word.status;

export default wordSlice.reducer;
