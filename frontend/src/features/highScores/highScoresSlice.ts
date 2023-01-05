import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface FetchReponseType {
    httpStatus: number;
    data: HighScore[] | null;
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
        data: null,
    },
    status: 'idle',
};

// set up 'addHighScore'
// hide path in .env
/*
        example:

        Populate .env as follows:

        REACT_APP_AUTH0_DOMAIN=
        REACT_APP_AUTH0_CLIENT_ID=

        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENTID}
        */

export const fetchHighScores = createAsyncThunk(
    'highScores/fetchHighScores',
    async () => {
        const rawFetchResponse = await fetch('/api/gethighscores');
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
            });
    },
});

export const selectHighScores = (state: RootState) => state.highScores;

export default highScoresSlice.reducer;
