import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface FetchReponseType {
    httpStatus: number;
    data: string;
}
interface WordState {
    wordObject: FetchReponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: WordState = {
    wordObject: {
        httpStatus: 0,
        data: '',
    },
    status: 'idle',
};

export const fetchWord = createAsyncThunk('word/fetchWord', async () => {
    const rawFetchResponse = await fetch('/api/getword');
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
                state.wordObject = action.payload;
            })
            .addCase(fetchWord.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const selectWord = (state: RootState) => state.word;

export default wordSlice.reducer;
