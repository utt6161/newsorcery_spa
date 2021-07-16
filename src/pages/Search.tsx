import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {setSearchText} from "../store/searchSlice";
import SearchList from "../components/SearchList";
import {useLocation} from "react-router";

export default function Search() {
    const dispatch = useDispatch()
    // const query = useSelector(selectQuery)
    const setSearch = useRef(true)
    const location = useLocation()
    const queryParser = new URLSearchParams(location.search)
    const q = queryParser.get("q")
    const [showSearch, setShowSearch] = useState(true)

    useEffect(() => {
            if (setSearch.current) {
                if (q !== null) {
                    dispatch(setSearchText(q))
                } else {
                    dispatch(setSearchText(""))
                }
                setSearch.current = false
            }
        }
    )
    return (
        // <Transition
        //     items={showSearch}
        //     from={{opacity: 0}}
        //     enter={{opacity: 1}}
        //     leave={{opacity: 0}}
        //     delay={150}
        //     onRest={() =>
        //         setShowSearch(true)
        //     }
        //
        // >{(styles, item) =>
        //     item && <animated.div style={styles}>
                <SearchList/>
        //     </animated.div>
        // }
        // </Transition>


    )
}
