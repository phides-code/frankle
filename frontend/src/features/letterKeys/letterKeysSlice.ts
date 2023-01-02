import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface LetterKeysState {
    colors: {
        A: { bgColor: string; fgColor: string };
        B: { bgColor: string; fgColor: string };
        C: { bgColor: string; fgColor: string };
        D: { bgColor: string; fgColor: string };
        E: { bgColor: string; fgColor: string };
        F: { bgColor: string; fgColor: string };
        G: { bgColor: string; fgColor: string };
        H: { bgColor: string; fgColor: string };
        I: { bgColor: string; fgColor: string };
        J: { bgColor: string; fgColor: string };
        K: { bgColor: string; fgColor: string };
        L: { bgColor: string; fgColor: string };
        M: { bgColor: string; fgColor: string };
        N: { bgColor: string; fgColor: string };
        O: { bgColor: string; fgColor: string };
        P: { bgColor: string; fgColor: string };
        Q: { bgColor: string; fgColor: string };
        R: { bgColor: string; fgColor: string };
        S: { bgColor: string; fgColor: string };
        T: { bgColor: string; fgColor: string };
        U: { bgColor: string; fgColor: string };
        V: { bgColor: string; fgColor: string };
        W: { bgColor: string; fgColor: string };
        X: { bgColor: string; fgColor: string };
        Y: { bgColor: string; fgColor: string };
        Z: { bgColor: string; fgColor: string };
    };
}

const initialState: LetterKeysState = {
    colors: {
        A: { bgColor: '', fgColor: '' },
        B: { bgColor: '', fgColor: '' },
        C: { bgColor: '', fgColor: '' },
        D: { bgColor: '', fgColor: '' },
        E: { bgColor: '', fgColor: '' },
        F: { bgColor: '', fgColor: '' },
        G: { bgColor: '', fgColor: '' },
        H: { bgColor: '', fgColor: '' },
        I: { bgColor: '', fgColor: '' },
        J: { bgColor: '', fgColor: '' },
        K: { bgColor: '', fgColor: '' },
        L: { bgColor: '', fgColor: '' },
        M: { bgColor: '', fgColor: '' },
        N: { bgColor: '', fgColor: '' },
        O: { bgColor: '', fgColor: '' },
        P: { bgColor: '', fgColor: '' },
        Q: { bgColor: '', fgColor: '' },
        R: { bgColor: '', fgColor: '' },
        S: { bgColor: '', fgColor: '' },
        T: { bgColor: '', fgColor: '' },
        U: { bgColor: '', fgColor: '' },
        V: { bgColor: '', fgColor: '' },
        W: { bgColor: '', fgColor: '' },
        X: { bgColor: '', fgColor: '' },
        Y: { bgColor: '', fgColor: '' },
        Z: { bgColor: '', fgColor: '' },
    },
};

const letterKeysSlice = createSlice({
    name: 'letterKeys',
    initialState,
    reducers: {
        colorizeLetterkey: (
            state,
            action: {
                payload: {
                    letterKey: keyof LetterKeysState['colors'];
                    bgColor: string;
                };
            }
        ) => {
            const { letterKey, bgColor } = action.payload;
            if (state.colors[letterKey].bgColor !== 'green') {
                state.colors[letterKey].bgColor = bgColor;
                state.colors[letterKey].fgColor = 'white';
            }
        },
        resetLetterKeysState: () => {
            return initialState;
        },
    },
});

export const selectLetterKeyStatus = (state: RootState) => state.letterKeys;

export const { colorizeLetterkey, resetLetterKeysState } =
    letterKeysSlice.actions;

export default letterKeysSlice.reducer;
