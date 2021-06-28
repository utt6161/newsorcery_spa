import Sections from "../components/Sections";
import React, {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {setSelected} from "../store/sectionSlice";
import {setSearchText} from "../store/searchSlice";
import {SearchList} from "../components/SearchList";
import {useLocation} from "react-router";

export default function Search() {
    const dispatch = useDispatch()
    // const query = useSelector(selectQuery)
    const setSectionAndSearch = useRef(true)
    const location = useLocation()
    const queryParser = new URLSearchParams(location.search)
    const sectionId = queryParser.get("sectionId")
    const q = queryParser.get("q")
    useEffect(() =>
        {
            if (setSectionAndSearch.current) {
                if (sectionId !== null) {
                    dispatch(setSelected({
                        sectionId: sectionId,
                    }));
                }
                if (q !== null) {
                    dispatch(setSearchText(q))
                } else {
                    dispatch(setSearchText(""))
                }
                setSectionAndSearch.current = false
            }
        }
    )
    return (
        <>
            <Sections/>
            <SearchList/>
        </>
    )
}
