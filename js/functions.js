const defaultCity = "Moscow";

function clearAndAppend(div, toAppend) {
    div.innerHTML = "";
    div.append(toAppend);
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

function getSmallCityName(city) {
    const maxCityLength = 20;
    if (city.length < maxCityLength) {
        return city;
    }
    return city.slice(0, maxCityLength) + '...';
}

async function addToFavourites(event) {
    event.preventDefault();
    const input = document.getElementById('city-to-add');
    const city = input.value.trim();
    input.value = '';
    const favourites = getFavouritesFromLocalStorage();
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
            errorHandler(city);
        } else {
            errorHandler(`City ${getSmallCityName(city)} not found.`);
        }
    }
}