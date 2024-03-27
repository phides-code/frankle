import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface FetchReponseType {
    error?: string;
    data?: HighScore[];
}

export interface HighScore {
    playername: string;
    wintime: number;
    word: string;
}

interface HighScoresState {
    highScores: FetchReponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: HighScoresState = {
    highScores: {
        data: [],
    },
    status: 'idle',
};

const HIGHSCORES_SERVICE_URL = process.env
    .REACT_APP_HIGHSCORES_SERVICE_URL as string;

export const fetchHighScores = createAsyncThunk(
    'highScores/fetchHighScores',
    async () => {
        const rawFetchResponse = await fetch(HIGHSCORES_SERVICE_URL);
        const fetchResponse: FetchReponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

export const addHighScore = createAsyncThunk(
    'highScores/addHighScore',

    async (highScore: HighScore) => {
        const rawFetchResponse = await fetch(HIGHSCORES_SERVICE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(highScore),
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
                state.highScores = {
                    data: action.payload.data?.sort(
                        (a, b) => a.wintime - b.wintime
                    ),
                };
            })
            .addCase(fetchHighScores.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(addHighScore.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addHighScore.fulfilled, (state) => {
                state.status = 'idle';
            })
            .addCase(addHighScore.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const selectHighScores = (state: RootState) => state.highScores;

export default highScoresSlice.reducer;
