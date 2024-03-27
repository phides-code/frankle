import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface FetchReponseType {
    data?: string;
    error?: string;
}
interface WordState {
    wordObject: FetchReponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: WordState = {
    wordObject: {},
    status: 'idle',
};

export const fetchWord = createAsyncThunk('word/fetchWord', async () => {
    const WORDS_SERVICE_URL = process.env.REACT_APP_WORDS_SERVICE_URL as string;

    const rawFetchResponse = await fetch(`${WORDS_SERVICE_URL}/random`);
    const fetchResponse: FetchReponseType = await rawFetchResponse.json();

    return fetchResponse;
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
                state.wordObject = action.payload as FetchReponseType;
            })
            .addCase(fetchWord.rejected, (state, action) => {
                state.status = 'failed';
                state.wordObject = action.payload as FetchReponseType;
            });
    },
});

export const selectWord = (state: RootState) => state.word;

export default wordSlice.reducer;
