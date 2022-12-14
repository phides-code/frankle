import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import wordReducer from '../features/word/wordSlice';
import guessReducer from '../features/guess/guessSlice';

export const store = configureStore({
    reducer: {
        word: wordReducer,
        guess: guessReducer,
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
