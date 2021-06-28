import { createSlice } from '@reduxjs/toolkit';

export const switchSlice = createSlice({
    name: 'switch',
    initialState: {
        status: true,
    },
    reducers: {
        toggleSwitch: (state) => {
            state.status = !state.status
        },
        setSwitch: (state, action) => {
            state.status = action.payload
        },
    },
});

export const selectSwitch = (state) => state.switch.status

export const {toggleSwitch, setSwitch} = switchSlice.actions;

export default switchSlice.reducer;
