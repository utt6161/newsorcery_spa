import React from 'react';
import strip from "../utils/stripHtml";
import {useSelector} from "react-redux";
import {selectSwitch} from "../store/switchSlice";
import {ImageWrapper} from "./ImageWrapper";
import {IArticleMinified} from "../utils/fetchInterfaces";
import {AxiosResponse} from "axios";

interface INewsListItemProps<T>{
    data: T
}

export default function NewsListItem(props: INewsListItemProps<IArticleMinified>) {
    // let options = {
    //     era: 'long',
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //     weekday: 'long',
    //     timezone: 'UTC',
    //     hour: 'numeric',
    //     minute: 'numeric'
    // };
    const itemURL = `/article?&id=${encodeURIComponent(props.data.id)}`
    return (
        <a href={itemURL} style = {{ textDecoration: "none"}} className="news-item">
            <div className="card no-rounding full-border custom-card bg-newspaper h-100 mx-auto">
                <ImageWrapper className="card-img-top no-rounding border-bottom border-bottom border-dark card-img-news" src={props.data.fields.thumbnail}
                     alt="Card image cap"/>
                <div className="card-body">
                    <h5 className="card-title">{strip(props.data.fields.headline)}</h5>
                    <p className="card-text">{`${strip(props.data.fields.trailText)}...`}</p>
                </div>
                <div className="card-footer">
                    <small
                    >
                        {`last updated: ${new Date(props.data.fields.lastModified).toLocaleString()}`}
                    </small>
                </div>
            </div>
        </a>
    )
}
