import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import wordReducer from '../features/word/wordSlice';

export const store = configureStore({
    reducer: {
        word: wordReducer,
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
