import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { NUM_OF_GUESSES, WORD_LENGTH } from '../../constants';

interface FetchReponseType {
    httpStatus: number;
    data: boolean | null;
}

interface LetterBox {
    letter: string;
    color: string;
}

interface GuessState {
    board: LetterBox[][];
    currentRow: number;
    currentLetterPosition: number;
    guessValidityObject: FetchReponseType;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: GuessState = {
    board: Array.from({ length: NUM_OF_GUESSES }, () =>
        Array(WORD_LENGTH).fill({ letter: '', color: '' })
    ),
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
        updateBoard: (state, action) => {
            // put one letter in a square
            const { row, letterPosition, value } = action.payload;
            state.board[row][letterPosition].letter = value;
        },
        colorizeAndAdvance: (state, action) => {
            const { guess, word } = action.payload;

            console.log('comparing answer: ' + word);
            console.log(' and guess: ');
            console.log(guess);

            // call this when OK is pressed
            // check each letter with the answer word and colorize
            // increment row
            // reset letter position
            // reset guess validity
        },
        /////////////////////
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
        resetGuessState: () => {
            return initialState;
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
    // addGuess,
    resetGuessState,
    updateBoard,
    colorizeAndAdvance,
} = guessSlice.actions;

export default guessSlice.reducer;
