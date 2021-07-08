import {useDispatch, useSelector} from 'react-redux';
import React, {
    useEffect, useRef, useState
} from 'react';
import {nanoid} from "@reduxjs/toolkit";
import {SearchListItem} from "./SearchListItem";
import {
    fetchSearchResults,
    incrementPage,
    selectArticlesData,
    selectCurrentPage,
    selectTotalPages
} from "../store/articlesSlice";
import {useInfiniteScroll} from "../customHooks/InfiniteScroll";
import {useLocation} from "react-router";
import {selectSectionInfo, selectSectionSelected} from "../store/sectionSlice";
import {selectSearchText} from "../store/searchSlice";

// const mapStateToProps = state => {
//     return {
//         articlesData: state.articles.articlesData,
//         currentPage: state.articles.currentPage,
//         totalPages: state.articles.totalPages,
//         sectionSelected: state.section.sectionSelected,
//         sectionInfo: state.section.sectionInfo,
//         searchText: state.search.searchText,
//     }
// }

// const eqCheck = () => {
//
// }

const SearchList = () => {
    const dispatch = useDispatch();

    const sectionSelected = useSelector(selectSectionSelected)
    const searchText = useSelector(selectSearchText)
    const totalPages = useSelector(selectTotalPages)
    const currentPage = useSelector(selectCurrentPage)
    const sectionInfo = useSelector(selectSectionInfo)
    const articlesData = useSelector(selectArticlesData)


    const [toRender, setToRender] = useState(new Array<JSX.Element>())
    const location = useLocation()
    const queryParser = new URLSearchParams(location.search)
    const sectionId = queryParser.get("sectionId")
    const q = queryParser.get("q")
    useEffect(() => {
        let sectionIdToFetch
        if (sectionSelected || sectionId){
            // check for undefined might be redundant, but anyway, cant be too careful
            if (sectionInfo.sectionId !== "" && sectionInfo.sectionId !== undefined){
                sectionIdToFetch = sectionInfo.sectionId
            } else {
                sectionIdToFetch = sectionId
            }
        }
        let searchTextToFetch
        if (searchText || q){
            // check for undefined might be redundant, but anyway, cant be too careful
            if(searchText !== "" && searchText !== undefined){
                searchTextToFetch = searchText
            } else {
                searchTextToFetch = q
            }
        }
        dispatch(fetchSearchResults({
            currentPage: currentPage ?? 1,
            sectionInfo: {
                sectionId: sectionIdToFetch
            },
            searchText: searchTextToFetch
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, sectionInfo.sectionId])

    useEffect(() => {
        console.log("attempt to render search results")
        let toRenderBuffer = []
        for (let i in articlesData) {
            toRenderBuffer.push(
                <SearchListItem key={articlesData[i].id} data={articlesData[i]}/>
            );
        }
        console.log(totalPages)
        if (totalPages === undefined) {
            toRenderBuffer.push(
                <div key = {nanoid()}>
                    <h1 className="px-4 pt-4 text-center">Couldn&apos;t find anything</h1>
                    <h5 className="text-center">try again, perhaps?</h5>
                </div>
            )
        }
        console.log(articlesData)
        setToRender(toRenderBuffer)
    },
    [articlesData, totalPages])

    let bottomBoundaryRef = useRef(null)
    useInfiniteScroll(bottomBoundaryRef, dispatch, incrementPage)
    return (
        <>
            {toRender}
            <div id='page-bottom-boundary' className="boundary-div-news" ref={bottomBoundaryRef}/>
        </>
    );
}

// export default connect(mapStateToProps)(SearchList)
export default SearchList
