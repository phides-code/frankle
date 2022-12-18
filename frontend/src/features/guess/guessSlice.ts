import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface FetchReponseType {
    httpStatus: number;
    data: boolean | null;
}

interface GuessState {
    guesses: string[];
    currentRow: number;
    currentLetterPosition: number;
    guessValidityObject: FetchReponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: GuessState = {
    guesses: [],
    currentRow: 0,
    currentLetterPosition: 0,
    guessValidityObject: {
        httpStatus: 200,
        data: null,
    },
    status: 'idle',
};

export const fetchValidity = createAsyncThunk(
    'guess/fetchValidity',
    async (guess: string) => {
        const rawFetchResponse = await fetch('/api/checkvalidity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guess }),
        });

        const fetchResponse: FetchReponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

const guessSlice = createSlice({
    name: 'guess',
    initialState,
    reducers: {
        incrementLetterPosition: (state) => {
            state.currentLetterPosition += 1;
        },
        decrementLetterPosition: (state) => {
            state.currentLetterPosition -= 1;
        },
        resetLetterPosition: (state) => {
            state.currentLetterPosition = 0;
        },
        incrementRow: (state) => {
            state.currentRow += 1;
        },
        resetGuessValidity: (state) => {
            state.guessValidityObject.data = null;
        },
        addGuess: (state, action) => {
            state.guesses.push(action.payload);
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchValidity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchValidity.fulfilled, (state, action) => {
                state.status = 'idle';
                state.guessValidityObject = action.payload;
            })
            .addCase(fetchValidity.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const selectGuessStatus = (state: RootState) => state.guess;
export const {
    incrementLetterPosition,
    decrementLetterPosition,
    resetLetterPosition,
    incrementRow,
    resetGuessValidity,
    addGuess,
} = guessSlice.actions;

export default guessSlice.reducer;
