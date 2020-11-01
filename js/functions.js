const defaultCity = "Moscow";

function clearAndAppend(div, toAppend) {
    div.innerHTML = "";
    div.append(toAppend);
}

function setWeatherInfo(elem, weather) {
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

function getAndSetWeather(weather, divId) {
    const elem = document.importNode(document.querySelector(divId).content, true);
    setWeatherInfo(elem, weather);
    return elem;
}

async function updateWeatherHere() {
    clearAndAppend(mainCity, document.importNode(document.querySelector('#main-city-waiting').content, true));
    const defaultWeatherHandler = weather => {
        clearAndAppend(mainCity, getAndSetWeather(weather, '#main-city'));
    };
    navigator.geolocation.getCurrentPosition(coordinates => {
        weatherAPI.getByCityCoordinates(coordinates).then(defaultWeatherHandler)
    }, () => weatherAPI.getByCityName(defaultCity).then(defaultWeatherHandler));
}