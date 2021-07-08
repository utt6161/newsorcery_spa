import {createAsyncThunk, createSlice, current} from '@reduxjs/toolkit'
import axios from "axios";
import {newsAPI} from "./crucialData";
import {IArticleMinified, IFetchArticlesResult, IFetchNews, IFetchSearchResults} from "../utils/fetchInterfaces";
import {RootState} from "./store";

interface IArticlesSliceInitState {
    isErrored: boolean,
    isFetching: boolean,
    articlesData: IArticleMinified[],
    currentPage: number,
    totalPages: number
}

export const fetchSearchResults = createAsyncThunk(
    'articles/fetchSearchResults',
    async (paramObj: IFetchSearchResults, thunkAPI) => {
        const assebledURL = `${newsAPI}${paramObj.searchText && paramObj.searchText !== "undefined" ? ("&q=" + paramObj.searchText) : ""}&page=${paramObj.currentPage ? paramObj.currentPage : 1}${paramObj.sectionInfo.sectionId ? `&section=${paramObj.sectionInfo.sectionId}` : ''}`
        const response = await axios.get<IFetchArticlesResult>(assebledURL)
        return response.data.response
    })


export const fetchNews = createAsyncThunk(
    'articles/fetchNews',
    async (paramObj: IFetchNews, thunkAPI) => {
        const response = await axios.get<IFetchArticlesResult>(`${newsAPI}&page=${paramObj.currentPage ? paramObj.currentPage : 1}${paramObj.sectionSelected ? `&section=${paramObj.sectionInfo.sectionId}` : ''}`)
        return response.data.response
    })

export const articlesSlice = createSlice({
    name: "articles",
    initialState: {
        isErrored: false,
        isFetching: false,
        articlesData: [],
        currentPage: 1,
        totalPages: 0
    } as IArticlesSliceInitState,
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
            state.totalPages = 0
        },

    },
    // extraReducers: {
    //     [fetchSearchResults.fulfilled]: (state, action) => {
    //         let articles = state.articlesData !== undefined ? [...state.articlesData,
    //             ...action.payload.results] : action.payload.results
    //         state.totalPages = action.payload.pages
    //         state.articlesData = articles
    //             .filter((value, index, self) =>             // and after concat we make this array like a set, u n i q u e
    //                 self.findIndex(v => v.id === value.id) === index)
    //
    //     },
    //     [fetchNews.fulfilled]: (state, action) => {
    //         let news = state.articlesData !== undefined ? [...state.articlesData,
    //             ...action.payload.results] : action.payload.results
    //         state.totalPages = action.payload.pages
    //         state.articlesData = news
    //             .filter((value, index, self) =>             // same thing here
    //                 self.findIndex(v => v.id === value.id) === index)
    //     },
    // }

    extraReducers: builder => {
        builder
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                let articles = state.articlesData !== undefined ? [...state.articlesData,
                    ...action.payload.results] : action.payload.results
                state.totalPages = action.payload.pages
                state.articlesData = articles
                    .filter((value, index, self) =>             // and after concat we make this array like a set, u n i q u e
                        self.findIndex(v => v.id === value.id) === index)

            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                let news = state.articlesData !== undefined ? [...state.articlesData,
                    ...action.payload.results] : action.payload.results
                state.totalPages = action.payload.pages
                state.articlesData = news
                    .filter((value, index, self) =>             // same thing here
                        self.findIndex(v => v.id === value.id) === index)
            })
    }

})


export const selectArticlesData = (state: RootState) => state.articles.articlesData
export const selectCurrentPage = (state: RootState) => state.articles.currentPage
export const selectTotalPages = (state: RootState) => state.articles.totalPages

export const {incrementPage, restoreArticlesState, setCurrentPage} = articlesSlice.actions

export type incrementPageType = typeof incrementPage

export default articlesSlice.reducer
