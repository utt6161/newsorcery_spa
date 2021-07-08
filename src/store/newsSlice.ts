// import {createAsyncThunk, createSlice, current} from '@reduxjs/toolkit'
// import axios from "axios";
// import {newsAPI} from "./crucialData";
//
// export const fetchNews = createAsyncThunk(
//     'users/fetchNews',
//     async (paramObj, thunkAPI) => {
//         const response = await axios.get(`${newsAPI}&page=${paramObj.currentPage ? paramObj.currentPage : 1}${paramObj.sectionSelected ? `&section=${paramObj.sectionInfo.sectionId}` : ''}`)
//         return response.data.response.results
//     })
//
// export const newsSlice = createSlice({
//     name: "news",
//     initialState: {
//         isErrored: false,
//         isFetching: false,
//         newsData: [],
//         currentPage: 1
//     },
//     reducers: {
//
//         incrementPage: (state) => {
//             //console.log("incrementing the page")
//             state.currentPage++
//         },
//
//         restoreNewsState: state => {
//             state.currentPage = 1
//             state.newsData = []
//         },
//
//         unsetNewsData: state => {
//             state.newsData = []
//         }
//     },
//     extraReducers: {
//
//         [fetchNews.fulfilled]: (state, action) => {
//             //console.log("now.. WHERE THE FUCK IS MY STATE????")
//             let news = state.newsData !== undefined ? [...state.newsData, ...action.payload] : action.payload
//             state.newsData = news
//                 .filter((value, index, self) =>             // and after concat we make this array like a set, u n i q u e
//                     self.findIndex(v => v.id === value.id) === index)
//         },
//     }
//
// })
// //
// // export const selectIsFetching = state => state.isFetching
// // export const selectIsErrored = state => state.isErrored
// export const selectNewsData = state => state.newsData
// export const selectCurrentPage = state => state.currentPage
//
// export const {unsetNewsData, incrementPage, restoreNewsState} = newsSlice.actions
//
// export default newsSlice.reducer

export {}
