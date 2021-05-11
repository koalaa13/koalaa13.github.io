const weatherAPI = new WeatherAPI();
const drawer = new Drawer();
const favouritesManager = new FavouritesManager();
const mainCity = document.querySelector('.weather-here-info');
const favouritesSection = document.querySelector('.favourites');
if (!localStorage.getItem(Helper.favouritesLocalStorageID)) {
    localStorage.setItem(Helper.favouritesLocalStorageID, '[]');
}

updateWeatherHere();
updateFavourites();

document.querySelector('.update-geo-button-text').addEventListener('click', updateWeatherHere);
document.querySelector('.update-geo-button-sign').addEventListener('click', updateWeatherHere);
document.querySelector('#add-city').addEventListener('submit', favouritesManager.addToFavourites);