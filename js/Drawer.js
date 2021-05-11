class Drawer {
    setCityWeatherInfo(cityElem, weather) {
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

    getElemAndSetWeatherCity(weather) {
        const elem = document.importNode(document.querySelector('#city').content, true);
        this.setCityWeatherInfo(elem, weather);
        elem.querySelector('.close-button').addEventListener('click', favouritesManager.removeFromFavourites);
        elem.firstElementChild.setAttribute('cityName', Helper.eraseSpaces(weather.name));
        return elem;
    }

    setWeatherHereInfo(elem, weather) {
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

    getElemAndSetWeatherHere(weather) {
        const elem = document.importNode(document.querySelector('#main-city').content, true);
        this.setWeatherHereInfo(elem, weather);
        return elem;
    }

    addCityWaiting(city) {
        const template = document.querySelector('#city-waiting');
        const cityElem = document.importNode(template.content, true);
        cityElem.querySelector('.city-name').innerText = city;
        cityElem.firstElementChild.setAttribute('cityName', Helper.eraseSpaces(city));
        return cityElem;
    }

    addCity(cityToAdd) {
        favouritesSection.append(drawer.addCityWaiting(cityToAdd));
        const cityElem = favouritesSection.querySelector(`.city-full-data[cityName=${Helper.eraseSpaces(cityToAdd)}]`);
        weatherAPI.getByCityName(cityToAdd)
            .then(weather => favouritesSection
                .replaceChild(drawer.getElemAndSetWeatherCity(weather), cityElem))
            .catch(() =>
                Helper.errorHandler('Something went wrong while adding new city to favourites.'));
    }
}