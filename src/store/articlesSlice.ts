import {
    createAsyncThunk,
    createSlice
} from '@reduxjs/toolkit'
import axios from "axios";
import {
    newsAPI,
    sectionsList
} from "./crucialData";
import {
    IArticleMinified,
    IFetchArticlesResult,
    IFetchNews,
    IFetchSearchResults
} from "../utils/fetchInterfaces";
import {
    RootState
} from "./store";

interface IArticlesSliceInitState {
    isErrored: boolean,
    isPending: boolean,
    articlesData: IArticleMinified[],
    isIncrementable: boolean,
    sectionData: {
        sectionId: string,
        sectionText: string,
        sectionSelected: boolean
    },
    currentPage: number,
    totalPages: number
}

export const fetchSearchResults = createAsyncThunk(
    'articles/fetchSearchResults',
    async (paramObj: IFetchSearchResults, thunkAPI) => {
        const assebledURL = `${newsAPI}${paramObj.searchText && paramObj.searchText !== "undefined" ? ("&q=" + paramObj.searchText) : ""}&page=${paramObj.currentPage ? paramObj.currentPage : 1}${paramObj.sectionInfo.sectionId ? `&section=${paramObj.sectionInfo.sectionId}` : ''}`
        return await axios.get < IFetchArticlesResult > (assebledURL)
    }, {
        condition: (paramObj, {
            getState,
            extra
        }) => {
            if(paramObj.sectionInfo.sectionId !== "" && !Object.keys(sectionsList).includes(paramObj.sectionInfo.sectionId)){
                return false
            }
        }, dispatchConditionRejection: true
    })


export const fetchNews = createAsyncThunk(
    'articles/fetchNews',
    async (paramObj: IFetchNews, thunkAPI) => {
        return await axios.get < IFetchArticlesResult > (`${newsAPI}&page=${paramObj.currentPage ? paramObj.currentPage : 1}${paramObj.sectionInfo.sectionId ? `&section=${paramObj.sectionInfo.sectionId}` : ''}`)
    // })
    }, {
        condition: (paramObj, {
            getState,
            extra
        }) => {
            if(paramObj.sectionInfo.sectionId !== "" && !Object.keys(sectionsList).includes(paramObj.sectionInfo.sectionId)){
                return false
            }
        }, dispatchConditionRejection: true
    })


export const articlesSlice = createSlice({
    name: "articles",
    initialState: {
        isErrored: false,
        isPending: false,
        articlesData: [],
        isIncrementable: false,
        sectionData: {
            sectionId: "",
            sectionText: "",
            sectionSelected: false
        },
        currentPage: 1,
        totalPages: 0
    } as IArticlesSliceInitState,

    reducers: {

        setSectionId: (state, action) => {
            if (action.payload.sectionId !== "" && Object.keys(sectionsList).includes(action.payload.sectionId)) {
                state.isErrored = false
                state.isPending = false
                state.isIncrementable = false
                state.articlesData = []
                state.currentPage = 1
                state.totalPages = 0
                state.sectionData = {
                    ...action.payload,
                    sectionText: sectionsList[action.payload.sectionId],
                    sectionSelected: true
                };
            }
        },

        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },

        incrementPage: (state) => {
            if (!state.isIncrementable) {
                state.isIncrementable = true
            }
            if ((state.currentPage < state.totalPages) && (state.articlesData.length !== 0)) {
                state.currentPage++
            } else {}
        },

        restoreArticlesState: state => {
            state.isErrored = false
            state.isPending = false
            state.isIncrementable = false
            state.currentPage = 1
            state.articlesData = []
            state.totalPages = 0
            state.sectionData = {
                sectionId: "",
                sectionText: "",
                sectionSelected: false
            }
        },
        newSearchFetch: state => {
            state.currentPage = 1
            state.articlesData = []
            state.totalPages = 0
        }

    },

    extraReducers: builder => {
        builder
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                let articles = state.articlesData !== undefined ? [...state.articlesData,
                    ...action.payload.data.response.results
                ] : action.payload.data.response.results
                state.isPending = false
                state.totalPages = action.payload.data.response.pages
                state.articlesData = articles
                    .filter((value, index, self) => // and after concat we make this array like a set, u n i q u e
                        self.findIndex(v => v.id === value.id) === index)

            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                let news = state.articlesData !== undefined ? [...state.articlesData,
                    ...action.payload.data.response.results
                ] : action.payload.data.response.results
                state.isPending = false
                state.totalPages = action.payload.data.response.pages
                state.articlesData = news
                    .filter((value, index, self) => // same thing here
                        self.findIndex(v => v.id === value.id) === index)
            })

            .addCase(fetchNews.pending, (state, action) => {
                state.isPending = true
                state.isErrored = false
            })
            .addCase(fetchSearchResults.pending, (state, action) => {
                state.isPending = true
                state.isErrored = false
            })

            .addCase(fetchNews.rejected, (state, action) => {
                console.log("WE GOT AN ERROR WITH NEWS")
                state.isPending = false
                state.isErrored = true
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.isPending = false
                state.isErrored = true
            })
    }

})


export const selectArticlesData = (state: RootState) => state.articles.articlesData
export const selectCurrentPage = (state: RootState) => state.articles.currentPage
export const selectTotalPages = (state: RootState) => state.articles.totalPages
export const selectSectionId = (state: RootState) => state.articles.sectionData.sectionId
export const selectSectionSelected = (state: RootState) => state.articles.sectionData.sectionSelected
export const selectIsPending = (state: RootState) => state.articles.isPending
export const selectIsErrored = (state: RootState) => state.articles.isErrored
export const selectIsIncrementable = (state: RootState) => state.articles.isIncrementable

export const {
    incrementPage,
    restoreArticlesState,
    setCurrentPage,
    setSectionId,
    newSearchFetch
} = articlesSlice.actions

export type incrementPageType = typeof incrementPage

export default articlesSlice.reducer