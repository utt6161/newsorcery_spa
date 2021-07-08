import React, {useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Sections from "../components/Sections";
import axios from "axios";
import {apiKEY} from "../store/crucialData";
import {useLocation} from "react-router";

export default function Article() {

    // const query = useSelector(selectQuery) // left from non spa nexjs approach (accessing "server's slice"
    const [renderArticle, setArticleData] = useState("")
    const location = useLocation()
    const id = new URLSearchParams(location.search).get("id")
    const brokenArticleLink = () =>{
        setArticleData("<h1 class = 'px-4 pt-4 text-center'>Seems like link to the article is broken</h1>" +
            "<h5 class = 'text-center'>try again, perhaps?</h5>")
    }
    useEffect(() => {
        if (id !== undefined && id !== null) {
            let articleId;
            try{
                articleId = decodeURIComponent(id)
                axios.get(`https://content.guardianapis.com/${articleId}?api-key=${apiKEY}&show-fields=headline,body`)
                    .then((response) => {
                        setArticleData(response.data.response.content.fields.body)
                    })
            }catch (e) {
                brokenArticleLink()
            }
        } else {
            brokenArticleLink()
        }
    }, [renderArticle, id])

    function contentToString() {
        return {__html: renderArticle};
    }

    useEffect(()=>{
        // @ts-ignore
        window.twttr = (function(d, s, id) {
            // @ts-ignore
            let js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s); js.id = id;
            // @ts-ignore
            js.src = "https://platform.twitter.com/widgets.js";
            // @ts-ignore
            fjs.parentNode.insertBefore(js, fjs);
            // @ts-ignore
            t._e = []; t.ready = function(f) {
                t._e.push(f);
            };
            return t;
        }(document, "script", "twitter-wjs"));
    })


    return (
        <>
            <Sections/>
            <Row>
                <Col>
                    <div className="m-1 p-2 full-border bg-white" dangerouslySetInnerHTML={ contentToString() }/>
                </Col>
            </Row>
        </>
    )
}
