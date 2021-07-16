import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";
import {apiKEY, newsAPI, sectionsList} from "./crucialData";
import {IFetchSingleArticle, IFetchSingleArticleResult} from "../utils/fetchInterfaces";
import {RootState} from "./store";

interface ISingleArticleInitState{
    isErrored: boolean,
    isPending: boolean,
    body: string,
}

export const fetchSingleArticle = createAsyncThunk(
    'single/fetchSingleArticle',
    async (paramObj: IFetchSingleArticle, thunkAPI) => {
        return await axios.get<IFetchSingleArticleResult>(`https://content.guardianapis.com/${paramObj.sectionId}?api-key=${apiKEY}&show-fields=headline,body`)
    })


export const singleSlice = createSlice({
    name: "single",
    initialState: {
        isErrored: false,
        isPending: false,
        body: "",
    } as ISingleArticleInitState,

    reducers: {

    },

    extraReducers: builder => {
        builder
            .addCase(fetchSingleArticle.fulfilled, (state, action) => {
                state.isPending = false
                state.isErrored = false
                console.log(action.payload)
                state.body = action.payload.data.response.content.fields.body
            })

            .addCase(fetchSingleArticle.pending, (state, action) =>{
                state.isPending = true
                state.isErrored = false
            })

            .addCase(fetchSingleArticle.rejected, (state, action) => {
                state.isPending = false
                state.isErrored = true
            })
    }

})


export const selectBody = (state: RootState) => state.single.body
export const selectIsPending = (state: RootState) => state.single.isPending
export const selectIsErrored = (state: RootState) => state.single.isErrored

export default singleSlice.reducer
