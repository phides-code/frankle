import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface GuessState {
    currentRow: number;
    currentLetterPosition: number;
}

const initialState: GuessState = {
    currentRow: 0,
    currentLetterPosition: 0,
};

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
    },
});

export const selectGuessStatus = (state: RootState) => state.guess;
export const {
    incrementLetterPosition,
    decrementLetterPosition,
    resetLetterPosition,
    incrementRow,
} = guessSlice.actions;

export default guessSlice.reducer;
