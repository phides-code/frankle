import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface WordState {
    word: string;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: WordState = {
    word: '',
    status: 'idle',
};

export const fetchWord = createAsyncThunk('word/fetchWord', async () => {
    const fetchResponse = await fetch('/api/getword');
    return fetchResponse.body as unknown as string;
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

export default wordSlice.reducer;
