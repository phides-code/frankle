import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import CryptoJS from 'crypto-js';

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
        httpStatus: 200,
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

export const selectDecryptedWord = (state: RootState) => {
    const WORD_SECRET_KEY = process.env.REACT_APP_WORD_SECRET_KEY as string;
    const decryptedWord = CryptoJS.AES.decrypt(
        state.word.wordObject.data,
        WORD_SECRET_KEY
    );

    return decryptedWord.toString(CryptoJS.enc.Utf8);
};

export default wordSlice.reducer;
