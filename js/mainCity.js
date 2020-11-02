const weatherAPI = new WeatherAPI();
mainCity = document.querySelector(".weather-here-info")

updateWeatherHere();

const updateButtonText = document.querySelector('.update-geo-button-text');
const updateButtonSign = document.querySelector('.update-geo-button-sign');

updateButtonText.addEventListener('click', updateWeatherHere);
updateButtonSign.addEventListener('click', updateWeatherHere);
