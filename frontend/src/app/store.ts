import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import wordReducer from '../features/word/wordSlice';
import guessReducer from '../features/guess/guessSlice';
import gameReducer from '../features/game/gameSlice';
import letterKeysReducer from '../features/letterKeys/letterKeysSlice';
import timeReducer from '../features/time/timeSlice';
import highScoresReducer from '../features/highScores/highScoresSlice';

export const store = configureStore({
    reducer: {
        word: wordReducer,
        guess: guessReducer,
        game: gameReducer,
        letterKeys: letterKeysReducer,
        time: timeReducer,
        highScores: highScoresReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
