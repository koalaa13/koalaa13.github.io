class FavouritesManager {
    async addToFavourites(event) {
        event.preventDefault();
        const input = event.target[0];
        const city = input.value.trim();
        input.value = '';
        let favourites = Helper.getFavouritesFromLocalStorage();
        let cityExists = false;

        favourites.forEach(elem => {
            if (elem.toLowerCase() === city.toLowerCase()) {
                cityExists = true;
            }
        });
        if (cityExists) {
            Helper.errorHandler('City is already in favourites.');
        } else {
            if (!navigator.onLine) {
                Helper.errorHandler('Internet connection lost. Try again.');
                return;
            }
            let response = await weatherAPI.getByCityName(city).catch(() => {
                Helper.errorHandler(`Something went wrong while getting weather in ${city}.`);
            })
            if (response.cod === 200) {
                favourites = Helper.getFavouritesFromLocalStorage();
                if (favourites.includes(response.name)) {
                    Helper.errorHandler('City is already in favourites.');
                } else {
                    localStorage.setItem(Helper.favouritesLocalStorageID, JSON.stringify([...favourites, response.name]));
                    updateFavourites();
                }

            } else {
                Helper.errorHandler(`City ${Helper.getSmallCityName(city, 20)} not found.`);
            }
        }
    }

    removeFromFavourites(event) {
        const city = event.currentTarget.parentElement.firstElementChild.innerHTML;
        const favourites = Helper.getFavouritesFromLocalStorage();
        localStorage.setItem(Helper.favouritesLocalStorageID, JSON.stringify(favourites.filter(cityName => cityName !== city)));
        updateFavourites();
    }
}