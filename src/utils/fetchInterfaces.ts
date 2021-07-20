export interface IFetchSearchResults {
    currentPage: number,
    sectionInfo: {
        sectionId: string
    },
    searchText: string | null | undefined | number
}

export interface IFetchSingleArticle {
    sectionId: string
}

export interface IFetchSingleArticleResult {
    response: {
        "status": string,
        "userTier": string,
        "total": number,
        "content": {
            "id": string,
            "type": string,
            "sectionId": string,
            "sectionName": string,
            "webPublicationDate": string,
            "webTitle": string,
            "webUrl": string,
            "apiUrl": string,
            "fields": {
                "headline": string,
                "body": string
            },
            "isHosted": boolean,
            "pillarId": string,
            "pillarName": string
        }
    }

}

export interface IFetchNews {
    currentPage: number,
    sectionInfo: {
        sectionId: string
    },
}

export interface IArticleMinified {
    id: string,
    type?: string,
    sectionId?: string,
    sectionName?: string,
    webPublicationDate?: string,
    webTitle?: string,
    webUrl?: string,
    apiUrl?: string,
    fields: {
        headline: string,
        trailText: string,
        lastModified: string,
        thumbnail: string
    },
    isHosted?: boolean,
    pillarId?: string,
    pillarName?: string
}

export interface IFetchArticlesResult {
    response: {
        status: string,
        userTier: string,
        total: number,
        startIndex: number,
        pageSize: number,
        currentPage: number,
        pages: number,
        orderBy: string,
        results: IArticleMinified[]
    }
}
