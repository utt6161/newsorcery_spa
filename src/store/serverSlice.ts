// import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {HYDRATE} from 'next-redux-wrapper';
// import {ParsedUrlQuery} from 'querystring';
// /* eslint-disable no-param-reassign */
//
// const serverSlice = createSlice({
//     name: 'server',
//     initialState: {pathName: '', req: '', query: {}},
//     reducers: {
//         setPathAndQuery(state, action) {
//             state.pathName = action.payload.pathName ?? state.pathName;
//             state.query = action.payload.query ?? state.query;
//             state.req = action.payload.req ?? state.req;
//         },
//         // setPath(state, action) {
//         //     state.pathName = action.payload.pathName ?? state.pathName;
//         // },
//         // setQuery(state, action) {
//         //     state.query = action.payload.query ?? state.query;
//         // }
//         setServerStateClear(state){
//             state.pathName = ""
//             state.query = {}
//         }
//     },
//     extraReducers: (builder) => {
//         builder.addCase(
//             HYDRATE,
//             (_, action) => {
//                 return action.payload.server
//             }
//         );
//     },
// });
//
// export const selectQuery = state => state.server.query
// export const selectPathName = state => state.server.pathName
// export const selectOrigin = state => state.server.req
// export default serverSlice.reducer;
// export {HYDRATE};
// export const {setPathAndQuery, setQuery, setPath, setServerStateClear} = serverSlice.actions;

export {}
