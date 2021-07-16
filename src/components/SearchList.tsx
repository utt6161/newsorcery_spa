import {useDispatch, useSelector} from 'react-redux';
import React, {
    useEffect, useRef, useState
} from 'react';
import {nanoid} from "@reduxjs/toolkit";
import {SearchListItem} from "./SearchListItem";
import {
    fetchSearchResults,
    incrementPage, restoreArticlesState,
    selectArticlesData,
    selectCurrentPage, selectIsErrored, selectIsPending, selectSectionId, selectSectionSelected,
    selectTotalPages
} from "../store/articlesSlice";
import {useInfiniteScroll} from "../customHooks/InfiniteScroll";
import {useLocation} from "react-router";
import {selectSearchText} from "../store/searchSlice";
import Loading from "./Loading";
import {Transition, animated, useSpring} from 'react-spring'
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
    const sectionId = useSelector(selectSectionId)
    const articlesData = useSelector(selectArticlesData)
    const isPending = useSelector(selectIsPending)
    const isErrored = useSelector(selectIsErrored)
    const [toRender, setToRender] = useState<React.ReactNode[] | React.ReactNode>()
    const [loadOrErrorRender, setLoadOrErrorRender] = useState<React.ReactNode>()
    const location = useLocation()
    const queryParser = new URLSearchParams(location.search)
    const q = queryParser.get("q")
    const urlSectionId = queryParser.get("sectionId")
    const sectionPickedGottaSkip = useRef(urlSectionId !== null)
    useEffect(() => {
        let searchTextToFetch
        if (searchText || q) {
            // check for undefined might be redundant, but anyway, cant be too careful
            if (searchText !== "" && searchText !== undefined) {
                searchTextToFetch = searchText
            } else {
                searchTextToFetch = q
            }
        }
        dispatch(fetchSearchResults({
            currentPage: currentPage ?? 1,
            sectionInfo: {
                sectionId: sectionId
            },
            searchText: searchTextToFetch
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, sectionId])

    useEffect(() => {
        if (articlesData.length !== 0) {
            let toRenderBuffer = []
            for (let i in articlesData) {
                toRenderBuffer.push(
                    <SearchListItem key={articlesData[i].id} data={articlesData[i]}/>
                );
            }
            setToRender(toRenderBuffer)
        }
        if (isErrored) {
            setLoadOrErrorRender(
                <>
                    <h1 style={{color: "#1f8afe"}} className="px-4 pt-4 text-center">Now that&apos;s really strange,
                        something&apos;s broken</h1>
                    <h5 style={{color: "#1f8afe"}} className="text-center">you shouldn&apos;t be here in a first
                        place</h5>
                </>
            )
        }
        if (isPending) {
            setLoadOrErrorRender(
                <>
                    <Loading/>
                </>
            )
        }
    }, [articlesData, isPending, isErrored])

    let bottomBoundaryRef = useRef(null)

    // magic so we dont fuck up sections
    // its been 5 hours and i already forgot
    // wtf i did here, anyway
    useInfiniteScroll(bottomBoundaryRef, dispatch, incrementPage)
    const prevSectionRef = useRef("");
    useEffect(() => {
        prevSectionRef.current = sectionId;
    });
    const prevSection = prevSectionRef.current;
    const [show, toggle] = useState(false)
    useEffect(() => {
        if (sectionId !== prevSection) {
            toggle(false)
        }
    },)

    return (
        <>
            {!isPending && !isErrored &&
            <Transition
                items={show}
                from={{opacity: 0}}
                enter={{opacity: 1}}
                config={{duration: 200}}
                onRest={() =>
                    toggle(true)
                }

            >{(styles, item) =>
                item && <animated.div style={styles}>
                    {toRender}
                    <div data-cy="infinitescroll-boundary" id='page-bottom-boundary' className="boundary-div-news"
                         ref={bottomBoundaryRef}/>
                </animated.div>
            }
            </Transition>
            }
            {isErrored || isPending &&
                loadOrErrorRender
            }
        </>
    );
}

// export default connect(mapStateToProps)(SearchList)
export default SearchList
