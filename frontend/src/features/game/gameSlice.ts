import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface GameState {
    gameOver: boolean;
    gameResult: 'win' | 'loss' | null;
}

const initialState: GameState = {
    gameOver: false,
    gameResult: null,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        endGame: (state, action) => {
            state.gameOver = true;
            state.gameResult = action.payload;
        },
        resetGameState: () => {
            return initialState;
        },
    },
});

export const selectGameStatus = (state: RootState) => state.game;
export const { endGame, resetGameState } = gameSlice.actions;

export default gameSlice.reducer;
