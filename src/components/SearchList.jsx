import {connect, useDispatch} from 'react-redux';
import React, {
    useEffect, useRef, useState
} from 'react';
import {nanoid} from "@reduxjs/toolkit";
import {SearchListItem} from "./SearchListItem";
import {fetchSearchResults, incrementPage} from "../store/articlesSlice";
import {useInfiniteScroll} from "../customHooks/InfiniteScroll";
import {useLocation, useParams} from "react-router";

const checkIfEq = (left, right) => {
    return JSON.stringify(left) !== JSON.stringify(right)
}


const mapStateToProps = state => {
    return {
        articlesData: state.articles.articlesData,
        currentPage: state.articles.currentPage,
        totalPages: state.articles.totalPages,
        sectionSelected: state.section.sectionSelected,
        sectionInfo: state.section.sectionInfo,
        searchText: state.search.searchText,
    }
}

export function SearchList(props) {
    const dispatch = useDispatch();
    const [toRender, setToRender] = useState([])
    const location = useLocation()
    const queryParser = new URLSearchParams(location.search)
    const sectionId = queryParser.get("sectionId")
    const q = queryParser.get("q")
    useEffect(() => {
        let sectionIdToFetch
        if (props.sectionSelected || sectionId){
            // check for undefined might be redundant, but anyway, cant be too careful
            if (props.sectionInfo.sectionId !== "" && props.sectionInfo.sectionId !== undefined){
                sectionIdToFetch = props.sectionInfo.sectionId
            } else {
                sectionIdToFetch = sectionId
            }
        }
        let searchTextToFetch
        if (props.searchText || q){
            // check for undefined might be redundant, but anyway, cant be too careful
            if(props.searchText !== "" && props.searchText !== undefined){
                searchTextToFetch = props.searchText
            } else {
                searchTextToFetch = q
            }
        }
        dispatch(fetchSearchResults({
            currentPage: props.currentPage ?? 1,
            sectionSelected: props.sectionSelected ?? false,
            sectionInfo: {
                sectionId: sectionIdToFetch
            },
            searchText: searchTextToFetch
        }))
    }, [dispatch, props.currentPage, props.sectionInfo.sectionId])

    useEffect(() => {
        let toRenderBuffer = []
        for (let i in props.articlesData) {
            toRenderBuffer.push(
                <SearchListItem key={props.articlesData[i].id} data={props.articlesData[i]}/>
            );
        }
        if (props.totalPages !== undefined && props.totalPages === 0) {
            toRenderBuffer.push(
                <div key = {nanoid()}>
                    <h1 className="px-4 pt-4 text-center">Couldn&apos;t find anything</h1>
                    <h5 className="text-center">try again, perhaps?</h5>
                </div>
            )
        }
        setToRender(toRenderBuffer)
    },
    [props.articlesData])

    let bottomBoundaryRef = useRef(null)
    useInfiniteScroll(bottomBoundaryRef, dispatch, incrementPage)
    return (
        <>
            {toRender}
            <div id='page-bottom-boundary' className="boundary-div-news" ref={bottomBoundaryRef}/>
        </>
    );
}

export default connect(mapStateToProps)(SearchList)
