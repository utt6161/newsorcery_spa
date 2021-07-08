import { createSlice } from '@reduxjs/toolkit';
import {RootState} from "./store";

interface ISearchSliceInitState{
    searchText: string,
    currentPath: string
}

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchText: "",
        currentPath: ""
    } as ISearchSliceInitState,
    reducers: {
        setSearch: (state, action) => {
            state.searchText = action.payload.searchText
            state.currentPath = action.payload.currentPath
        },
        setSearchText: (state, action) => {
            state.searchText = action.payload
        },
        setCurrentPath: (state, action) => {
            state.currentPath = action.payload
        }


    },
});

export const selectSearchText = (state: RootState) => state.search.searchText;
export const selectCurrentPath = (state: RootState) => state.search.currentPath
export const { setSearch, setSearchText, setCurrentPath } = searchSlice.actions;

export default searchSlice.reducer;
