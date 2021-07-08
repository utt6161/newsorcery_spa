interface IObjectKeys {
    [key: string]: string;
}

export const sectionsList: IObjectKeys = {
    artanddesign: "Art and design",
    business: "Business",
    culture: "Culture",
    education: "Education",
    environment: "Environment",
    fashion: "Fashion",
    film: "Film",
    food: "Food",
    football: "Football",
    games: "Games",
    inequality: "Inequality",
    law: "Law",
    lifeandstyle: "Life and style",
    media: "Media",
    money: "Money",
    music: "Music",
    politics: "Politics",
    science: "Science",
    society: "Society",
    sport: "Sport",
    technology: "Technology",
    travel: "Travel",
    weather: "Weather",
    world: "World news",
};

// export const currentURL = location.origin

export const apiKEY = process.env.REACT_APP_API_KEY

export const newsAPI = `https://content.guardianapis.com/search?${apiKEY ? "&api-key=" + apiKEY : ""}&page-size=12&show-fields=headline,thumbnail,trailText,lastModified`;
