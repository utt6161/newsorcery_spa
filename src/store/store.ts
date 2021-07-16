import {combineReducers, configureStore} from '@reduxjs/toolkit'
import searchReducer from "./searchSlice"
import articlesReducer from "./articlesSlice"
import switchReducer from "./switchSlice";
import singleReducer from "./singleSlice"

const rootReducer = combineReducers({
    search: searchReducer,
    articles: articlesReducer,
    switch: switchReducer,
    single: singleReducer
})

// export const testStore = configureStore({
//     reducer: rootReducer
// });

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['articles/fetchNews/fulfilled', 'articles/fetchSearchResults/fulfilled','single/fetchSingleArticle/fulfilled'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.headers', 'payload.request', 'payload.data.content.fields.body'],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type dispatchType = typeof store.dispatch

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

