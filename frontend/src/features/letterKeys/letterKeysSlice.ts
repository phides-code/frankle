import { createSlice } from '@reduxjs/toolkit';

interface LetterKeysState {
    colors: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
        F: string;
        G: string;
        H: string;
        I: string;
        J: string;
        K: string;
        L: string;
        M: string;
        N: string;
        O: string;
        P: string;
        Q: string;
        R: string;
        S: string;
        T: string;
        U: string;
        V: string;
        W: string;
        X: string;
        Y: string;
        Z: string;
    }    
}

const initialState: LetterKeysState = {
    colors: {
        A: '',
        B: '',
        C: '',
        D: '',
        E: '',
        F: '',
        G: '',
        H: '',
        I: '',
        J: '',
        K: '',
        L: '',
        M: '',
        N: '',
        O: '',
        P: '',
        Q: '',
        R: '',
        S: '',
        T: '',
        U: '',
        V: '',
        W: '',
        X: '',
        Y: '',
        Z: '',    
    }
}

const letterKeysSlice = createSlice({
    name: 'letterKeys',
    initialState,
    reducers: {
        
    }
})

export default letterKeysSlice.reducer