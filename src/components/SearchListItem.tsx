import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import React from "react";
import strip from "../utils/stripHtml";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useSelector} from "react-redux";
import {ImageWrapper} from "./ImageWrapper";
import {IArticleMinified} from "../utils/fetchInterfaces";


// <Card className = "w-100 full_border no_rounding m-2">
//     <Card.Body>
//         <Row>
//
//             <Col xs lg = "5">
//                 <img className="no_rounding card-img-size" src={props.data.thumbnail} alt="article image"/>
//             </Col>
//             <Col xs lg = "7">
//                 <Card.Title className = "h-50">{strip(props.data.headline)}</Card.Title>
//                 <Card.Text className = "h-50">
//                     {`${strip(props.data.trailText)}...`}
//                 </Card.Text>
//             </Col>
//         </Row>
//
//     </Card.Body>
// </Card>

interface ISearchListItemProps<T>{
    data: T
}

export function SearchListItem(props: ISearchListItemProps<IArticleMinified>) {

    const itemURL = `/article?&id=${encodeURIComponent(props.data.id)}`

    return(

        <a href={itemURL} style = {{ textDecoration: "none"}} className="article-item">
            <div className="card full-border no-rounding m-2 p-2 bg-newspaper">
                <div className="row">
                    <div className="col-md-4 my-auto">
                        <ImageWrapper src={props.data.fields.thumbnail}
                            className="w-100 full-border card-img-search" alt="search image"/>
                    </div>
                    <div className="col-md-8 px-3 d-flex">
                        <div className="my-auto">
                            <Row>
                                <div className="card-block px-3">
                                    <h4 className="card-title">{strip(props.data.fields.headline)}</h4>
                                    <p className="card-text">{`${strip(props.data.fields.trailText)}...`} </p>
                                </div>
                            </Row>
                            <Row>
                                <small className = "px-3 pt-3"
                                >
                                    {`last updated: ${new Date(props.data.fields.lastModified).toLocaleString()}`}
                                </small>
                            </Row>
                        </div>
                    </div>

                </div>
            </div>
        </a>

    )
}
