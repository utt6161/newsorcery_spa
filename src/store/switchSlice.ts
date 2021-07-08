import { createSlice } from '@reduxjs/toolkit';
import {RootState} from "./store";

interface ISwitchSliceInitState{
    status: boolean
}

export const switchSlice = createSlice({
    name: 'switch',
    initialState: {
        status: true,
    } as ISwitchSliceInitState,
    reducers: {
        toggleSwitch: (state) => {
            state.status = !state.status
        },
        setSwitch: (state, action) => {
            state.status = action.payload
        },
    },
});

export const selectSwitch = (state: RootState) => state.switch.status

export const {toggleSwitch, setSwitch} = switchSlice.actions;

export type setSwitchType = typeof setSwitch

export default switchSlice.reducer;
