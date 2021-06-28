import {combineReducers, configureStore} from '@reduxjs/toolkit'
import sectionReducer from "./sectionSlice"
import searchReducer from "./searchSlice"
import articlesReducer from "./articlesSlice"
import switchReducer from "./switchSlice";

const rootReducer = combineReducers({
    section: sectionReducer,
    search: searchReducer,
    articles: articlesReducer,
    switch: switchReducer
})

export const testStore = configureStore({
    reducer: rootReducer
});

export const store = configureStore({
    reducer: rootReducer,
})

// preloadedState :{
//     section: {
//         sectionSelected: false,
//         sectionInfo: {
//             sectionId: "",
//             sectionText: ""
//         }
//     },
//     news: {
//         isErrored: false,
//         isFetching: false,
//         newsData: [],
//         currentPage: 1
//     }
// }

