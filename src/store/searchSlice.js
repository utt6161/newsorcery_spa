import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
    name: 'search',
    initialState: { searchText: ""},
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

export const selectSearchText = (state) => state.search.searchText;
export const selectCurrentPath = (state) => state.search.currentPath
export const { setSearch, setSearchText, setCurrentPath } = searchSlice.actions;

export default searchSlice.reducer;
