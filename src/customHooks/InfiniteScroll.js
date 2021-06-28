import {useEffect, useCallback, useRef} from 'react';
import axios from "axios";
import {newsAPI} from "../store/crucialData";
import {setNewsData, initiateLoading, loadingErrored, incrementPage} from "../store/newsSlice";
import {useDispatch} from "react-redux";

// make API calls and pass the returned data via dispatch
//
// export const useFetch = (dispatch, currentPage, sectionSelected, sectionInfo) => {
//     console.log("fetching shit right here")
//     useEffect(() => {
//         dispatch(initiateLoading());
//         axios.get(`${searchNewsApi}&page=${currentPage ? currentPage : 1}${sectionSelected ? `&section=${sectionInfo.sectionId}` : ''}`)
//             .then((response) => {
//                 dispatch(setNewsData(response.data.response.results));
//             })
//             .catch((reason) => {
//                 console.log(reason);
//                 dispatch(loadingErrored())
//             });
//     }, [currentPage])
// }

// infinite scrolling with intersection observer
export const useInfiniteScroll = (scrollRef, dispatch, reducer) => {

    const scrollObserver = useCallback(
        node => {
            new IntersectionObserver(entries => {
                entries.forEach(en => {
                    if (en.intersectionRatio > 0) {
                        //console.log("HERE SHOULD BE A DISPATCH FOR INCREMENTING THE PAGE BROO")
                        dispatch(reducer());
                    }
                });
            }, ).observe(node);
        },
        [dispatch]
    );

    useEffect(() => {
        //console.log(scrollRef.current)
        if (scrollRef.current) {
            scrollObserver(scrollRef.current);
        }
    }, [scrollObserver, scrollRef]);
}

// lazy load images with intersection observer
// export const useLazyLoading = (imgSelector, items) => {
//     const imgObserver = useCallback(node => {
//         const intObs = new IntersectionObserver(entries => {
//             entries.forEach(en => {
//                 if (en.intersectionRatio > 0) {
//                     const currentImg = en.target;
//                     const newImgSrc = currentImg.dataset.src;
//
//                     // only swap out the image source if the new url exists
//                     if (!newImgSrc) {
//                         console.error('Image source is invalid');
//                     } else {
//                         currentImg.src = newImgSrc;
//                     }
//                     intObs.unobserve(node);
//                 }
//             });
//         })
//         intObs.observe(node);
//     }, []);
//
//     const imagesRef = useRef(null);
//
//     useEffect(() => {
//         imagesRef.current = document.querySelectorAll(imgSelector);
//
//         if (imagesRef.current) {
//             imagesRef.current.forEach(img => imgObserver(img));
//         }
//     }, [imgObserver, imagesRef, imgSelector, items])
// }
