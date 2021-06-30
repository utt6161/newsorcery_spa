import {createAsyncThunk, createSlice, current} from '@reduxjs/toolkit'
import axios from "axios";
import {newsAPI} from "./crucialData";

export const fetchSearchResults = createAsyncThunk(
    'articles/fetchSearchResults',
    async (paramObj, thunkAPI) => {
        const assebledURL = `${newsAPI}${paramObj.searchText && paramObj.searchText !== "undefined" ? ("&q=" + paramObj.searchText) : ""}&page=${paramObj.currentPage ? paramObj.currentPage : 1}${paramObj.sectionInfo.sectionId ? `&section=${paramObj.sectionInfo.sectionId}` : ''}`
        const response = await axios.get(assebledURL).catch((e)=>{
            console.log("something went wrong")
        })
        return response.data.response
    })

export const fetchNews = createAsyncThunk(
    'articles/fetchNews',
    async (paramObj, thunkAPI) => {
        const response = await axios.get(`${newsAPI}&page=${paramObj.currentPage ? paramObj.currentPage : 1}${paramObj.sectionSelected ? `&section=${paramObj.sectionInfo.sectionId}` : ''}`)
        return response.data.response
    })

export const articlesSlice = createSlice({
    name: "articles",
    initialState: {
        isErrored: false,
        isFetching: false,
        articlesData: [],
        currentPage: 1,
    },
    reducers: {

        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },

        incrementPage: (state) => {
            if (state.currentPage < state.totalPages) {
                state.currentPage++
            } else {
            }
        },

        restoreArticlesState: state => {
            state.currentPage = 1
            state.articlesData = []
            state.totalPages = undefined
        },

    },
    extraReducers: {
        [fetchSearchResults.fulfilled]: (state, action) => {
            let articles = state.articlesData !== undefined ? [...state.articlesData,
                ...action.payload.results] : action.payload.results
            state.totalPages = action.payload.pages
            state.articlesData = articles
                .filter((value, index, self) =>             // and after concat we make this array like a set, u n i q u e
                    self.findIndex(v => v.id === value.id) === index)
        },
        [fetchNews.fulfilled]: (state, action) => {
            let news = state.articlesData !== undefined ? [...state.articlesData,
                ...action.payload.results] : action.payload.results
            state.totalPages = action.payload.pages
            state.articlesData = news
                .filter((value, index, self) =>             // same thing here
                    self.findIndex(v => v.id === value.id) === index)
        },
    }

})

export const selectArticlesData = state => state.articlesData
export const selectCurrentPage = state => state.currentPage
export const selectTotalPages = state => state.totalPages

export const {unsetArticlesData, incrementPage, restoreArticlesState, setCurrentPage} = articlesSlice.actions

export default articlesSlice.reducer
