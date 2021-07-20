import React, {useEffect, useRef, useState} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axios from "axios";
import {apiKEY} from "../store/crucialData";
import {useLocation} from "react-router";
import { Transition, animated } from 'react-spring'
import {useDispatch, useSelector} from "react-redux";
import {fetchSingleArticle, selectBody, selectIsErrored, selectIsPending} from "../store/singleSlice";
import Loading from "../components/Loading";

export default function Article() {

    // const query = useSelector(selectQuery) // left from non spa nexjs approach (accessing "server's slice"
    const [renderArticle, setArticleData] = useState("")

    const isPending = useSelector(selectIsPending)
    const isErrored = useSelector(selectIsErrored)
    const bodyOfArcticle = useSelector(selectBody)
    const dispatch = useDispatch()

    const location = useLocation()
    const id = new URLSearchParams(location.search).get("id")
    // const brokenArticleLink = () => {
    //     setArticleData("<h1 class = 'px-4 pt-4 text-center'>Seems like link to the article is broken</h1>" +
    //         "<h5 class = 'text-center'>try again, perhaps?</h5>")
    // }

    const [loadOrErrorRender, setLoadOrErrorRender] = useState<React.ReactNode>()
    useEffect(()=>{
        if(bodyOfArcticle !== ""){
            setArticleData(bodyOfArcticle)
        }
        if (isErrored) {
            setLoadOrErrorRender(
                <>
                    <h1 className = 'px-4 pt-4 text-center'>Seems like link to the article is broken</h1>
                    <h5 className = 'text-center'>try again, perhaps?</h5>
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
    },[bodyOfArcticle, isErrored, isPending])


    const fetchOnce = useRef(true)
    useEffect(() => {
        if(fetchOnce.current){
            dispatch(fetchSingleArticle({
                sectionId: id !== null ? id : ""
            }))
            fetchOnce.current = false
        }
    }, [])

    function contentToString() {
        return {__html: renderArticle};
    }

    useEffect(() => {
        // @ts-ignore
        window.twttr = (function (d, s, id) {
            // @ts-ignore
            let js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            // @ts-ignore
            js.src = "https://platform.twitter.com/widgets.js";
            // @ts-ignore
            fjs.parentNode.insertBefore(js, fjs);
            // @ts-ignore
            t._e = [];
            // @ts-ignore
            t.ready = function (f) {
                t._e.push(f);
            };
            return t;
        }(document, "script", "twitter-wjs"));
    })

    const [show, toggle] = useState(false)
    return (
        <>
            {!isErrored && !isPending && <Transition
                items={show}
                from={{opacity: 0}}
                enter={{opacity: 1}}
                leave={{opacity: 0}}
                config={{duration: 200}}
                onRest={() =>
                    toggle(true)
                }

            >
                {(styles, item) =>
                    item && <animated.div style={styles}>
                        <Row>
                            <Col>
                                <div className="m-1 p-2 full-border bg-white" dangerouslySetInnerHTML={contentToString()}/>
                            </Col>
                        </Row>
                     </animated.div>
                }

            </Transition>
            }
            {(isErrored || isPending) &&
            loadOrErrorRender
            }
        </>
    )
}
