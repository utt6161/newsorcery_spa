import {setCurrentPath, setSearchText} from "../store/searchSlice";
import Button from "react-bootstrap/Button";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectSectionId, selectSectionSelected, newSearchFetch} from "../store/articlesSlice";
import {useHistory} from "react-router";

const SearchField = () => {

    const stateSectionId = useSelector(selectSectionId)
    const sectionSelected = useSelector(selectSectionSelected)
    const [localSearch, setLocalSearch] = useState("")
    const searchLocation = `/search?q=${localSearch}${sectionSelected ? "&sectionId=" + stateSectionId : ""}`
    const dispatch = useDispatch()
    const history = useHistory()
    const queryParser = new URLSearchParams(location.search)
    const searchQuery = queryParser.get("q")
    const setSearchInfo = useRef(true)

    useEffect(() => {
        if (setSearchInfo.current) {
            dispatch(setSearchText(searchQuery))
            if(searchQuery === null){
                setLocalSearch("")
            } else {
                setLocalSearch(searchQuery)
            }
            setSearchInfo.current = false
        }
    })

    const onSearchHandler: React.MouseEventHandler = (e) => {
        dispatch(newSearchFetch())
        dispatch(setSearchText(localSearch))
        history.push(searchLocation)
    }

    return (
        <>
            <input data-cy="search-input" placeholder="Search" aria-label="Search" value={localSearch}
                   onChange={(e) => {
                       setLocalSearch(e.target.value)
                   }}
                   className="squared colored-search form-control" onKeyUp={({key}) => {
                if (key === "Enter") {
                    dispatch(newSearchFetch())
                    dispatch(setSearchText(localSearch))
                    history.push(searchLocation)
                }
            }}/>
            <Button data-cy="search-btn" className="squared ml-1" onClick={onSearchHandler}
                    variant="outline-primary">Search</Button>
        </>
    )
}

export default SearchField
