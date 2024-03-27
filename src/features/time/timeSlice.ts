import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface TimeState {
    startTime: number;
    endTime: number;
}

const initialState: TimeState = {
    startTime: 0,
    endTime: 0,
};

const timeSlice = createSlice({
    name: 'time',
    initialState,
    reducers: {
        setStartTime: (state, action) => {
            state.startTime = action.payload;
        },
        setEndTime: (state, action) => {
            state.endTime = action.payload;
        },
        resetTimes: () => {
            return initialState;
        },
    },
});

export const selectTimeStatus = (state: RootState) => state.time;
export const { setStartTime, setEndTime, resetTimes } = timeSlice.actions;

export default timeSlice.reducer;
