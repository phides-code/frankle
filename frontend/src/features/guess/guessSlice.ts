import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface FetchReponseType {
    httpStatus: number;
    data: boolean | null;
}

interface GuessState {
    currentRow: number;
    currentLetterPosition: number;
    invalidGuessObject: FetchReponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: GuessState = {
    currentRow: 0,
    currentLetterPosition: 0,
    invalidGuessObject: {
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
            state.invalidGuessObject.data = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchValidity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchValidity.fulfilled, (state, action) => {
                state.status = 'idle';
                state.invalidGuessObject = action.payload;
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
} = guessSlice.actions;

export default guessSlice.reducer;
