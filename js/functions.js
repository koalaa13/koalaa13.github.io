const defaultCity = "Moscow";

function clearAndAppend(div, toAppend) {
    div.innerHTML = "";
    div.append(toAppend);
}

function setCityWeatherInfo(cityElem, weather) {
    cityElem.querySelector('.city-info-title .city-name')
        .innerHTML = weather.name;
    cityElem.querySelector('.city-info-title .city-weather-icon')
        .src = weatherAPI.getIconURL(weather.weather[0].icon);
    cityElem.querySelector('.city-info-title .temperature')
        .innerHTML = `${Math.round(weather.main.temp)}°C`;
    cityElem.querySelector('.city-weather-info .wind-info .value')
        .innerHTML = `${weather.wind.speed} m/s`;
    cityElem.querySelector('.city-weather-info .cloudiness-info .value')
        .innerHTML = `${weather.clouds.all}%`;
    cityElem.querySelector('.city-weather-info .pressure-info .value')
        .innerHTML = `${weather.main.pressure} hpa`;
    cityElem.querySelector('.city-weather-info .humidity-info .value')
        .innerHTML = `${weather.main.humidity}%`;
    cityElem.querySelector('.city-weather-info .coordinates-info .value')
        .innerHTML = `[${weather.coord.lat.toFixed(2)}, ${weather.coord.lon.toFixed(2)}]`;
}


function setWeatherHereInfo(elem, weather) {
    elem.querySelector('.main-info .city-here-name')
        .innerHTML = weather.name;
    elem.querySelector('.main-info .weather-here-image-and-temperature .weather-icon')
        .src = weatherAPI.getIconURL(weather.weather[0].icon);
    elem.querySelector('.main-info .weather-here-image-and-temperature .temperature-here')
        .innerHTML = `${Math.round(weather.main.temp)}°C`;
    elem.querySelector('.side-info .side-info-container .wind-info .value')
        .innerHTML = `${weather.wind.speed} m/s`;
    elem.querySelector('.side-info .side-info-container .cloudiness-info .value')
        .innerHTML = `${weather.clouds.all}%`;
    elem.querySelector('.side-info .side-info-container .pressure-info .value')
        .innerHTML = `${weather.main.pressure} hpa`;
    elem.querySelector('.side-info .side-info-container .humidity-info .value')
        .innerHTML = `${weather.main.humidity}%`;
    elem.querySelector('.side-info .side-info-container .coordinates-info .value')
        .innerHTML = `[${weather.coord.lat.toFixed(2)}, ${weather.coord.lon.toFixed(2)}]`;
}

function getElemAndSetWeatherCity(weather) {
    const elem = document.importNode(document.querySelector('#city').content, true);
    setCityWeatherInfo(elem, weather);
    elem.querySelector('.close-button').addEventListener('click', removeFromFavourites);
    elem.firstElementChild.setAttribute('cityName', eraseSpaces(weather.name));
    return elem;
}

function getElemAndSetWeatherHere(weather) {
    const elem = document.importNode(document.querySelector('#main-city').content, true);
    setWeatherHereInfo(elem, weather);
    return elem;
}

async function updateWeatherHere() {
    clearAndAppend(mainCity, document.importNode(document.querySelector('#main-city-waiting').content, true));
    const defaultWeatherHandler = weather => {
        clearAndAppend(mainCity, getElemAndSetWeatherHere(weather));
    };
    navigator.geolocation.getCurrentPosition(coordinates => {
        weatherAPI.getByCityCoordinates(coordinates)
            .then(defaultWeatherHandler)
            .catch(() => errorHandler('Something went wrong while getting geo location.'));
    }, () => weatherAPI.getByCityName(defaultCity)
        .then(defaultWeatherHandler)
        .catch(() => errorHandler('Something went wrong while getting geo location.')));
}

function errorHandler(errorMessage) {
    const elem = document.getElementById('error');
    elem.innerHTML = errorMessage;
    setTimeout(() => {
        elem.innerHTML = '';
    }, 2000);
}

function getFavouritesFromLocalStorage() {
    return JSON.parse(localStorage.getItem(favouritesLocalStorageID));
}

function getSmallCityName(city, maxCityLength) {
    if (city.length < maxCityLength) {
        return city;
    }
    return city.slice(0, maxCityLength) + '...';
}

function getCoordsFromResponse(response) {
    return {coords: {latitude: response.coord.lat, longitude: response.coord.lon}};
}

function eraseSpaces(str) {
    return str.replace(/\s/g, "");
}

async function addToFavourites(event) {
    event.preventDefault();
    const input = document.getElementById('city-to-add');
    const city = input.value.trim();
    input.value = '';
    let favourites = getFavouritesFromLocalStorage();
    let cityExists = false;

    favourites.forEach(elem => {
        if (elem.toLowerCase() === city.toLowerCase()) {
            cityExists = true;
        }
    });
    if (cityExists) {
        errorHandler('City is already in favourites.');
    } else {
        let response = await weatherAPI.getByCityName(city).catch(() => {
            errorHandler(`Something went wrong while getting weather in ${city}.`);
        })
        if (response.cod === 200) {
            favourites = getFavouritesFromLocalStorage();
            const responseByCoords = await weatherAPI.getByCityCoordinates(getCoordsFromResponse(response));
            if (favourites.includes(responseByCoords.name)) {
                errorHandler('City is already in favourites.');
            } else {
                localStorage.setItem(favouritesLocalStorageID, JSON.stringify([...favourites, responseByCoords.name]));
                updateFavourites();
            }

        } else {
            errorHandler(`City ${getSmallCityName(city, 20)} not found.`);
        }
    }
}

function addCityWaiting(city) {
    const template = document.querySelector('#city-waiting');
    const cityElem = document.importNode(template.content, true);
    cityElem.querySelector('.city-name').innerText = city;
    cityElem.firstElementChild.setAttribute('cityName', eraseSpaces(city));
    return cityElem;
}

function addCity(cityToAdd) {
    favouritesSection.append(addCityWaiting(cityToAdd));
    const cityElem = favouritesSection.querySelector(`.city-full-data[cityName=${eraseSpaces(cityToAdd)}]`);
    weatherAPI.getByCityName(cityToAdd)
        .then(weather => favouritesSection
            .replaceChild(getElemAndSetWeatherCity(weather), cityElem))
        .catch(() =>
            errorHandler('Something went wrong while adding new city to favourites.'));
}

function removeFromFavourites(event) {
    const city = event.currentTarget.parentElement.firstElementChild.innerHTML;
    const favourites = getFavouritesFromLocalStorage();
    localStorage.setItem(favouritesLocalStorageID, JSON.stringify(favourites.filter(cityName => cityName !== city)));
    updateFavourites();
}

function updateFavourites() {
    const favourites = getFavouritesFromLocalStorage();

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
        if (!favouritesSection.querySelector(`.city-full-data[cityName=${eraseSpaces(cityName)}]`)) {
            addCity(cityName);
        }
    }
}

