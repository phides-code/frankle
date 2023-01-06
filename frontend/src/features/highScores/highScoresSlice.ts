import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import CryptoJS from 'crypto-js';

interface FetchReponseType {
    httpStatus: number;
    data: HighScore[];
}

interface HighScore {
    name: string;
    time: number;
    word: string;
}

interface HighScoresState {
    highScores: FetchReponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: HighScoresState = {
    highScores: {
        httpStatus: 200,
        data: [],
    },
    status: 'idle',
};

export const fetchHighScores = createAsyncThunk(
    'highScores/fetchHighScores',
    async () => {
        const rawFetchResponse = await fetch('/api/gethighscores');
        const fetchResponse: FetchReponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

export const addHighScore = createAsyncThunk(
    'highScores/addHighScore',

    async (highScore: HighScore) => {
        const API_KEY = process.env.REACT_APP_HIGHSCORES_API_KEY as string;
        const encryptedHighScore = CryptoJS.AES.encrypt(
            JSON.stringify(highScore),
            API_KEY
        );
        const encryptedHighScoreString = encryptedHighScore.toString();

        const rawFetchResponse = await fetch('/api/addhighscore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ encryptedHighScoreString }),
        });

        const fetchResponse: FetchReponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

const highScoresSlice = createSlice({
    name: 'highScores',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchHighScores.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHighScores.fulfilled, (state, action) => {
                state.status = 'idle';
                state.highScores = action.payload;
            })
            .addCase(fetchHighScores.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(addHighScore.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addHighScore.fulfilled, (state, action) => {
                state.status = 'idle';
            })
            .addCase(addHighScore.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const selectHighScores = (state: RootState) => state.highScores;

export default highScoresSlice.reducer;
