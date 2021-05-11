async function updateWeatherHere() {
    Helper.clearAndAppend(mainCity, document.importNode(document.querySelector('#main-city-waiting').content, true));
    const defaultWeatherHandler = weather => {
        Helper.clearAndAppend(mainCity, drawer.getElemAndSetWeatherHere(weather));
    };
    navigator.geolocation.getCurrentPosition(coordinates => {
        weatherAPI.getByCityCoordinates(coordinates)
            .then(defaultWeatherHandler)
            .catch(() => Helper.errorHandler('Something went wrong while getting geo location.'));
    }, () => weatherAPI.getByCityName(Helper.defaultCity)
        .then(defaultWeatherHandler)
        .catch(() => Helper.errorHandler('Something went wrong while getting geo location.')));
}

function updateFavourites() {
    const favourites = Helper.getFavouritesFromLocalStorage();

    // Deleting removed cities here
    for (const elem of favouritesSection.children) {
        const cityNameFromElem = elem.querySelector('.city-name').innerText;
        if (!(favourites.includes(cityNameFromElem))) {
            favouritesSection.removeChild(elem);
        }
    }

    // Adding new cities to favourites
    for (const city of favourites) {
        const cityName = city.toString();
        if (!favouritesSection.querySelector(`.city-full-data[cityName=${Helper.eraseSpaces(cityName)}]`)) {
            drawer.addCity(cityName);
        }
    }
}

