//CONSTANTS
const API_KEY = "74d929a73e3642fda3a2696e947bfd22";
const BASE_URL = "https://api.weatherbit.io/v2.0/forecast/daily";
const CURRENT_BASE_URL = "https://api.weatherbit.io/v2.0/current";
const days = document.querySelectorAll(".weeksday-container");
const inputs = document.querySelectorAll("form");
const locationButton = document.querySelector(".location-button");
const geolocationButton = document.querySelector(".geolocation-button");
const mainThemeNavigation = document.querySelector(".main-theme-navigation");
const mainThemeInput = document.querySelector(".main-theme-input");
const mainThemeCloseInput = document.querySelector(".search-close");
const mainTheme = document.querySelector(".main-theme");
const logoBackMainTheme = document.querySelector(".header-logo-text");
const aboutMeButton = document.querySelector(".about-me");
const aboutMeButtonBurger = document.querySelector(".about-me-burger");
const popup = document.querySelector(".popup");
const popupClose = document.querySelector("#popup-close");
const headerBurger = document.querySelector(".header-burger");
const burgerContent = document.querySelector(".burger-content");
const loading = document.querySelector(".loading");
const mainContent = document.querySelector(".main-container");

//FLOAT VARIABLES
let weekData;
let currentData;
let city;
let lat, lon;
let day = 2;

//EVENT LISTENERS
locationButton.addEventListener("click", () => {
  mainThemeNavigation.classList.add("hide");
  mainThemeInput.classList.add("show");
});

mainThemeCloseInput.addEventListener("click", () => {
  mainThemeNavigation.classList.remove("hide");
  mainThemeInput.classList.remove("show");
});

logoBackMainTheme.addEventListener("click", () => {
  mainTheme.classList.remove("hide");
});

aboutMeButton.addEventListener("click", () => {
  popup.classList.add("show");
});

aboutMeButtonBurger.addEventListener("click", () => {
  popup.classList.add("show");
});

popupClose.addEventListener("click", () => {
  popup.classList.remove("show");
});

headerBurger.addEventListener("click", () => {
  burgerContent.classList.toggle("show");
  if (burgerContent.classList.contains("show")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
});

geolocationButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    mainTheme.classList.add("hide");
    startApp();
  });
});

for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("submit", (e) => {
    e.preventDefault();
    city = e.target.location.value;
    if (!mainTheme.classList.contains("hide")) mainTheme.classList.add("hide");
    burgerContent.classList.remove("show");
    startApp();
  });
}

for (let i = 0; i < days.length; i++) {
  days[i].addEventListener("click", (e) => {
    day = i;
    setWeekWeather(weekData);
    setDayWeather(weekData, currentData);
  });
}

//FUNCTION HELPER
function cutDate(data) {
  return data.split("-").splice(1, 2).reverse().join(".");
}

//MAIN APP FUNCTIONS
async function startApp() {
  loading.classList.add("show");
  mainContent.classList.add("hide");
  day = 0;
  weekData = await fetchWeekApi();
  currentData = await fetchCurrentApi();
  setWeekWeather(weekData);
  setDayWeather(weekData, currentData);
  lat = null;
  lon = null;
}

async function fetchWeekApi() {
  try {
    const response = await fetch(
      BASE_URL +
        `?${
          lat && lon ? `lat=${lat}&lon=${lon}` : `city=${city}`
        }&key=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (e) {
    if (e instanceof SyntaxError) {
      alert(`Something went wrong, try to enter a correct location`);
      mainThemeNavigation.classList.remove("hide");
      mainThemeInput.classList.remove("show");
      mainTheme.classList.remove("hide");
    }
  }
}
async function fetchCurrentApi() {
  const response = await fetch(
    CURRENT_BASE_URL +
      `?${lat && lon ? `lat=${lat}&lon=${lon}` : `city=${city}`}&key=${API_KEY}`
  );
  const data = await response.json();
  return data;
}

function setWeekWeather(data) {
  for (let i = 0; i < days.length; i++) {
    days[i].children[0].innerHTML = cutDate(data.data[i].datetime);
    days[
      i
    ].children[1].innerHTML = `<img src="./assets/weather_icons/${data.data[i].weather.icon}.png"/>`;
    days[i].children[2].innerHTML = data.data[i].temp + "°с";
    days[i].children[3].innerHTML = data.data[i].weather.description;
  }
}

function setDayWeather(data, currentData) {
  if (day !== 0) {
    document.querySelector(".primary-info-current-degree").innerHTML =
      data.data[day].temp + "°с";
  } else {
    document.querySelector(".primary-info-current-degree").innerHTML =
      currentData.data[0].temp + "°с";
  }
  document.querySelector(
    ".primary-info-time-update"
  ).innerHTML = `Last time updated: ${currentData.data[0].ob_time
    .split(" ")
    .splice(1, 1)}`;
  document.querySelector(".primary-info-weather-description").innerHTML =
    data.data[day].weather.description;
  document.querySelector(
    ".geolocation-icon-description"
  ).innerHTML = `<img src="./assets/weather_icons/${data.data[day].weather.icon}.png"/>`;
  document.querySelector(".geolocation-title").innerHTML = data.city_name;
  document.querySelector(".geolocation-date").innerHTML = data.data[
    day
  ].valid_date
    .split("-")
    .reverse()
    .join("-");
  document.querySelector(".humidity-value").innerHTML = data.data[day].rh + "%";
  document.querySelector(".wind-speed-value").innerHTML =
    data.data[day].wind_spd.toFixed(2) + "m/s";
  document.querySelector(".feels-like").innerHTML =
    data.data[day].app_max_temp + "°с";
  document.querySelector(".pressure").innerHTML =
    data.data[day].pres.toFixed(1);
  document.querySelector(".cloudiness").innerHTML = data.data[day].clouds;
  document.querySelector(".visibility").innerHTML =
    data.data[day].vis.toFixed(1);
  document.querySelector(".win-dir").innerHTML = data.data[day].wind_cdir;
  document.querySelector(".precipitation").innerHTML = data.data[day].pop;
  mainContent.classList.remove("hide");
  loading.classList.remove("show");
}
