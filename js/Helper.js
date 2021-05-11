class Helper {
    static favouritesLocalStorageID = 'favourites';
    static defaultCity = "Moscow";

    static clearAndAppend(div, toAppend) {
        div.innerHTML = "";
        div.append(toAppend);
    }

    static eraseSpaces(str) {
        return str.replace(/[\s.]/g, "");
    }

    static errorHandler(errorMessage) {
        const elem = document.getElementById('error');
        elem.innerHTML = errorMessage;
        setTimeout(() => {
            elem.innerHTML = '';
        }, 2000);
    }

    static getFavouritesFromLocalStorage() {
        return JSON.parse(localStorage.getItem(this.favouritesLocalStorageID));
    }

    static getSmallCityName(city, maxCityLength) {
        if (city.length <= maxCityLength) {
            return city;
        }
        return city.slice(0, maxCityLength) + '...';
    }
}