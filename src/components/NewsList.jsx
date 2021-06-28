import {connect, useDispatch, useSelector} from 'react-redux';
import React, {
    useEffect, useRef, useState
} from 'react';
import {Masonry} from "./Masonry"
import NewsListItem from './NewsListItem';
import {fetchNews, incrementPage} from "../store/articlesSlice";
import {useInfiniteScroll} from "../customHooks/InfiniteScroll"
import {nanoid} from "@reduxjs/toolkit";
import {selectSwitch} from "../store/switchSlice";

// const checkIfEq = (left, right) => {
//     return JSON.stringify(left) !== JSON.stringify(right)
// }

const mapStateToProps = state => {
    return {
        newsData: state.articles.articlesData,
        currentPage: state.articles.currentPage,
        sectionSelected: state.section.sectionSelected,
        sectionInfo: state.section.sectionInfo,
        searchText: state.search.searchText
    }
}

export function NewsList(props) {

    //console.log('NewsList are rerendered');

    // const isFetching = useSelector(selectIsFetching);
    // const isErrored = useSelector(state => state.isErrored);
    // const newsData = useSelector(selectNewsData, checkIfEq)
    // const currentPage = useSelector(selectCurrentPage)
    const dispatch = useDispatch();
    const [toRender, setToRender] = useState([])
    const skipNewsOnce = useRef(true);
    const settingsSwitch = useSelector(selectSwitch)
    // const skipSectionOnce = useRef(true)
    let bottomBoundaryRef = useRef(null)

    useInfiniteScroll(bottomBoundaryRef, dispatch, incrementPage)


    useEffect(() => {
        if (!skipNewsOnce.current) {
            let toRenderBuffer = []

            for (let i in props.newsData) {
                toRenderBuffer.push({
                    key: nanoid(),
                    node: <NewsListItem data={props.newsData[i]}/>
                });
            }
            setToRender(toRenderBuffer)
            if(toRenderBuffer.length === 0){
                setToRender(
                    <>
                        <h1 style={{color: "#1f8afe"}} className="px-4 pt-4 text-center">Now that&apos;s really strange, something&apos;s broken</h1>
                        <h5 style={{color: "#1f8afe"}} className="text-center">you shouldn&apos;t be here in a first place</h5>
                    </>
                )
            }
        } else {
            skipNewsOnce.current = false;
        }
    },
    [props.newsData])

    useEffect(() => {
        //console.log("fetching news")
        dispatch(fetchNews({
            currentPage: props.currentPage ?? 1,
            sectionSelected: props.sectionSelected ?? false,
            sectionInfo: {
                sectionId: props.sectionInfo ? props.sectionInfo.sectionId : ""
            }
        }))
    }, [props.currentPage, props.sectionInfo])

    return (
        <>
            <Masonry
                items={toRender}
                gap={16}
                equalHeight = {!settingsSwitch}
                minColumnWidth={254}
            />
            <div data-cy = "infinitescroll-boundary" id='page-bottom-boundary' className="boundary-div-news" ref={bottomBoundaryRef}/>
        </>
    );
}

export const TestNewsList = NewsList

export default connect(mapStateToProps)(NewsList)
