import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import React, {useEffect, useRef, useState} from "react";
import strip from "../utils/stripHtml";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useDispatch, useSelector} from "react-redux";
import {selectQuery} from "../store/serverSlice";
import {setSelected} from "../store/sectionSlice";
import {setSearchText} from "../store/searchSlice";
import {setCurrentPage} from "../store/articlesSlice";
import Sections from "../components/Sections";
import axios from "axios";
import {apiKEY} from "../store/crucialData";
import {useLocation, useParams} from "react-router";

export default function Article(props) {

    const dispatch = useDispatch()
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
    }, [renderArticle])

    function contentToString() {
        return {__html: renderArticle};
    }

    useEffect(()=>{
        window.twttr = (function(d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s); js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);
            t._e = []; t.ready = function(f) {
                t._e.push(f);
            };
            return t;
        }(document, "script", "twitter-wjs"));
    })


    return (
        <>
            <Sections>

            </Sections>
            <Row>
                <Col>
                    <div className="m-1 p-2 full-border bg-white" dangerouslySetInnerHTML={ contentToString() }/>
                </Col>
            </Row>
        </>
    )
}
