import {useDispatch, useSelector} from 'react-redux';
import React, {
    memo,
    useEffect, useRef, useState
} from 'react';
import {Masonry, MasonryItem} from "./Masonry"
import NewsListItem from './NewsListItem';
import {
    fetchNews,
    selectArticlesData,
    selectCurrentPage, selectIsErrored, selectIsIncrementable, selectIsPending, setSectionId
} from "../store/articlesSlice";
import {InfiniteScrollDiv} from "./InfiniteScroll"
import {nanoid} from "@reduxjs/toolkit";
import {selectSwitch} from "../store/switchSlice";
import {selectSectionId, selectSectionSelected} from "../store/articlesSlice";
import {Transition, animated, useSpring} from 'react-spring'
import Loading from "./Loading";
import deepEqual from "deep-equal"

// const checkIfEq = (left, right) => {
//     return JSON.stringify(left) !== JSON.stringify(right)
// }

// interface INewsProps {
//     newsData:
// }
//
// const mapStateToProps = state => {
//     return {
//         newsData: state.articles.articlesData,
//         currentPage: state.articles.currentPage,
//         sectionSelected: state.section.sectionSelected,
//         sectionInfo: state.section.sectionInfo,
//         searchText: state.search.searchText
//     }
// }

const NewsList = () => {

    //console.log('NewsList are rerendered');

    // const isFetching = useSelector(selectIsFetching);
    // const isErrored = useSelector(state => state.isErrored);
    const newsData = useSelector(selectArticlesData, deepEqual)
    const currentPage = useSelector(selectCurrentPage)
    const sectionSelected = useSelector(selectSectionSelected)
    const sectionId = useSelector(selectSectionId)
    const isPending = useSelector(selectIsPending)
    const isErrored = useSelector(selectIsErrored)
    const isIncrementable = useSelector(selectIsIncrementable)
    // const searchText = useSelector(selectSearchText)

    const dispatch = useDispatch();
    const [toRender, setToRender] = useState(new Array<MasonryItem>())
    const [loadOrErrorRender, setLoadOrErrorRender] = useState<React.ReactNode>()
    const skipNewsOnce = useRef(true);
    const settingsSwitch = useSelector(selectSwitch)
    // const skipSectionOnce = useRef(true)


    const queryParser = new URLSearchParams(window.location.search)
    const urlSectionId = queryParser.get("sectionId")


    // in case we actually have sectionId in url
    // (which usually means we enter the site already having it there, like manual typing or from history)
    // we skip one render so we can
    // catch up with the section data from redux store
    // that will get dispatched later on "stack"
    // since we are going from bottom to the top (at least it seems so)
    // actually i could dispatch it from here, but i like the idea
    // of having section related stuff in section component
    // plus i'd still have to wait for it to get here upon rerender
    // idk, its so fucking stupid, yet i cant think of any other way with how
    // everything works right now...
    // that name below tho.. bruh
    const sectionPickedGottaSkip = useRef(urlSectionId !== null)
    
    useEffect(()=>{
        if (urlSectionId !== null && sectionId === "") {
            dispatch(setSectionId({
                sectionId: urlSectionId
            }))
        }
    })


    useEffect(() => {
        console.log("time to fetch")
        let sectionIdToFetch = ""
        if(sectionId || urlSectionId){
            if(sectionId !== "" && urlSectionId === sectionId){
                sectionIdToFetch = sectionId
            } else {
                sectionIdToFetch = urlSectionId!
            }
        }
        dispatch(fetchNews({
            currentPage: currentPage,
            sectionInfo: {
                sectionId: sectionIdToFetch
            }
        }))
    }, [currentPage, sectionId])

    useEffect(() => {
        if (newsData.length !== 0) {
            let toRenderBuffer: MasonryItem[] = []
            for (let i in newsData) {
                toRenderBuffer.push({
                    key: nanoid(),
                    node: <NewsListItem data={newsData[i]}/>
                });
            }
            setToRender(toRenderBuffer)
        }

        if (isErrored) {
            console.log("here we dispatch an error message")
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
    },
    [newsData, isPending, isErrored])

    // magic so we dont fuck up sections
    // its been 5 hours and i already forgot
    // wtf i did here, anyway

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

    const mainPiece = <Masonry
        items={toRender}
        gap={16}
        equalHeight={!settingsSwitch}
        minColumnWidth={254}
    />
    return (
        <>
            {(!isPending && !isErrored && !isIncrementable) &&
            <>
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
                        {mainPiece}
                    </animated.div>
                }
                </Transition>
            </>
            }
            {isIncrementable &&
                mainPiece
            }
            <InfiniteScrollDiv/>
            {(isErrored || isPending) &&
                loadOrErrorRender
            }
        </>

    );
}

// export const TestNewsList = NewsList

// export default connect(mapStateToProps)(NewsList)
NewsList.whyDidYouRender = true

const checkForEqual = (prev: any, current: any) => {
    return prev === current
}

export default memo(NewsList, checkForEqual)
