import {Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {sectionsList} from '../store/crucialData';
// import {selectSectionInfo, setSelected, setUnselected} from '../store/sectionSlice';
import {nanoid} from "@reduxjs/toolkit";
import {setSectionId, selectSectionId, restoreArticlesState} from "../store/articlesSlice";
import {useLocation} from "react-router-dom";
import {useHistory} from "react-router";

export default function Sections() {
    // const sectionInfo = useSelector(selectSectionInfo);

    const dispatch = useDispatch();

    // onWheel event handler to provide horizontal scroll with mouse
    // const horizontalScroll = e => {
    //     // e.preventDefault();
    //     const sections = document.getElementById("sections");
    //     const sectionsScrollPosition = document.getElementById("sections").scrollLeft;
    //     sections.scrollTo({
    //         top: 0,
    //         left: sectionsScrollPosition + e.deltaY,
    //         behaviour: "smooth"
    //     });
    // };

    const defaultButton = ['section-button', 'section-button-scrollable'];
    const defaultSection = ['sections', 'scrollable-sections', 'section-borders', "px-0"];
    const [buttonClasses, setButton] = useState(defaultButton);
    const [sectionClasses, setSection] = useState(defaultSection);
    // const [defaultWheel, setWheelEvent] = useState(true)
    const [expanded, setExpanded] = useState(false);

    // const serverSidePathName = useSelector(selectPathName) // (left from nextjs imp just in case)
    // const clientSidePathName = useSelector(selectCurrentPath) // (left from nextjs imp just in case)
    //console.log("serverSidePathName(sections): " + serverSidePathName)
    //("clientSidePathName(sections): " + clientSidePathName)
    const history = useHistory()
    let location = useLocation() // REACT ROUTER THING FOR ACCESSING WINDOW.LOCATION
    const queryParser = new URLSearchParams(window.location.search)
    const urlSectionId = queryParser.get("sectionId")
    const stateSectionId = useSelector(selectSectionId)

    // for the case when we have an url param on, but the state doesnt have sectionid param
    // useEffect(()=>{
    //     if (urlSectionId !== null && stateSectionId === "") {
    //         console.log("getting section from URL query params in case u need to ofc")
    //         dispatch(setSectionId({
    //             sectionId: urlSectionId
    //         }))
    //     }
    // })

    let restoringHandler = (e: React.MouseEvent<HTMLElement>) => {
        const el = e.currentTarget
        // strange hack to convince ts that its actually a number
        let sectionid: number = el.dataset!.sectionid as unknown as number
        queryParser.set("sectionId", Object.entries(sectionsList)[sectionid][0])
        window.history.pushState("", "", location.pathname + "?" + queryParser.toString())
        dispatch(setSectionId({
            sectionId: Object.entries(sectionsList)[sectionid][0],
        }));
    }

    // transform scrollable sections into full div
    const onExpand = () => {
        let currentButton = buttonClasses;
        let currentSection = sectionClasses;
        const forDelSection = ['scrollable-sections', 'section-borders'];
        currentSection = currentSection.filter((item) => !forDelSection.includes(item));
        // currentSection.push("d-flex-inline", "justify-content-around")
        setSection(currentSection);

        // to prevent strange behavior of supposedly unscrollable expanded div
        // setWheelEvent(false)
        setExpanded(true);
        currentButton = currentButton.filter((item) => item !== 'section-button-scrollable');
        currentButton.push('section-button-margin');
        setButton(currentButton);
        //console.log('onExpand fired');
    };

    // shrink sections back
    const onShrink = () => {
        let currentButton = buttonClasses;
        const currentSection = sectionClasses;
        currentSection.push('scrollable-sections', 'section-borders');
        setSection(currentSection);
        // setWheelEvent(true)
        setExpanded(false);
        currentButton = currentButton.filter((item) => item !== 'section-button-margin');
        currentButton.push('section-button-scrollable');
        setButton(currentButton);
        //console.log('onShrink fired');
    };

    const buttons = [];
    for (let i = 0; i < Object.keys(sectionsList).length; i += 1) {
        // if (sectionInfo !== undefined) {
            if (stateSectionId === Object.entries(sectionsList)[i][0]) {
                buttons.push(
                    <Button
                        key={nanoid()}
                        className={buttonClasses.join(' ') + " selected-section-btn"}
                    >
                        <p className="section-text">{Object.entries(sectionsList)[i][1]}</p>
                    </Button>,
                );
            } else {
                buttons.push(
                    <Button
                        data-sectionid = {i}
                        key={nanoid()}
                        variant="outline-primary"
                        className={buttonClasses.join(' ')}
                        onClick={restoringHandler}
                    >
                        <p className="section-text">{Object.entries(sectionsList)[i][1]}</p>
                    </Button>)
            }
        // } else {
        //     buttons.push(
        //         <Button
        //             data-sectionid = {i}
        //             key={nanoid()}
        //             variant="outline-primary"
        //             className={buttonClasses.join(' ')}
        //             onClick={restoringHandler}
        //         >
        //             <p className="section-text">{Object.entries(sectionsList)[i][1]}</p>
        //         </Button>,
        //     );
        // }
    }

    // let wheelHandler = defaultWheel ? horizontalScroll : undefined
    const expandHandler = expanded ? onShrink : onExpand;

    return (
        <>
            <Row>
                <div data-cy="sections-div" className={sectionClasses.join(' ')} id="sections">
                    {buttons}
                </div>
            </Row>
            {!expanded
            && (
                <Row>
                    <div className="w-100 pt-1 section-borders"/>
                </Row>
            )}
            <Row>
                <Button
                    onClick={expandHandler}
                    data-cy = "expand-btn"
                    className="expand-button d-flex justify-content-between align-items-center"
                    variant="outline-primary"
                >
                    {!expanded && (
                        <>
                            <p className="ml-2 expand-button-text">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 7L12 10.5L8.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15.5 13L12 16.5L8.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </p>
                            <p className="mr-2 expand-button-text">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 7L12 10.5L8.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15.5 13L12 16.5L8.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </p>
                        </>
                    )}
                    {expanded && (
                        <>
                            <p className="ml-2 expand-button-text">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 16.5L12 13L8.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15.5 10.5L12 7L8.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </p>
                            <p className="mr-2 expand-button-text">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 16.5L12 13L8.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15.5 10.5L12 7L8.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </p>
                        </>
                    )}
                </Button>
            </Row>
        </>
    );
}
