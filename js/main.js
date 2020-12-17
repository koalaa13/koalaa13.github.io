const favouritesLocalStorageID = 'favourites';
const weatherAPI = new WeatherAPI();
const mainCity = document.querySelector('.weather-here-info');
const favouritesSection = document.querySelector('.favourites');
if (!localStorage.getItem(favouritesLocalStorageID)) {
    localStorage.setItem(favouritesLocalStorageID, '[]');
}

updateWeatherHere();
updateFavourites();

document.querySelector('.update-geo-button-text').addEventListener('click', updateWeatherHere);
document.querySelector('.update-geo-button-sign').addEventListener('click', updateWeatherHere);
document.querySelector('#add-city').addEventListener('submit', addToFavourites);