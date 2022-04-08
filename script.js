class Weather {
  #apiKeyWeather = "9ac38d24b1f89311924a4ecaa72ba987";
  #apiKeyImages = "JqDIY-c-9R24XECnd9ESUKsj9no4Zt0E3ZhGn_80p8o";
  body = document.querySelector("body");
  searchBtn = document.querySelector(".enter");
  inputField = document.querySelector(".search-bar");
  cityField = document.querySelector(".city");
  tempField = document.querySelector(".temp");
  descriptionField = document.querySelector(".description");
  humidityField = document.querySelector(".humidity");
  windField = document.querySelector(".wind");
  icon = document.querySelector(".icon");
  weatherBox = document.querySelector(".weather");
  constructor() {
    this.searchBtn.addEventListener("click", (e) => {
      this.getCoords(this.inputField.value);
    });
  }
  getCoords = async function (zip) {
    try {
      const data = await fetch(
        `http://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=${
          this.#apiKeyWeather
        }`
      );
      if (!data) throw new Error("That zip code does not exist");
      const { lat, lon } = await data.json();
      this.getWeatherData(lat, lon);
    } catch (e) {
      console.error(e.message);
    }
  };

  getWeatherData = async function (lat, lon) {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
        this.#apiKeyWeather
      }`
    );
    const weatherInfo = await data.json();
    console.log(weatherInfo);
    this.updateUI(weatherInfo);
    // this.cityField.textContent = `Weather in ${weatherInfo.name}`;
  };

  updateUI(weatherInfo) {
    const { name, main, weather, wind } = weatherInfo;
    const { description, icon } = weather[0];
    this.cityField.textContent = `Weather in ${name}`;
    this.icon.src = `https://openweathermap.org/img/wn/${icon}.png`;
    this.tempField.textContent = `${this.toFahrenheit(main.temp)}° F`;
    this.descriptionField.textContent = `${description}`;
    this.windField.textContent = `Wind Speed: ${wind.speed}km/h`;
    this.humidityField.textContent = `Humidity: ${main.humidity}%`;
    this.weatherBox.classList.remove("loading");
    const url = `https://api.unsplash.com/search/photos?query=${name}&per_page=30&client_id=${
      this.#apiKeyImages
    }`;
    this.renderBackground(url);
  }

  renderBackground = async function (url) {
    try {
      this.deleteBackground();
      const data = await fetch(url);
      if (!data) throw new Error("No images found");
      const img = await data.json();
      const { results } = img;
      console.log(results);
      const finalBackGround =
        results[this.randomNumArr(0, results.length - 1)].urls.full;
      console.log(finalBackGround);
      this.body.style.backgroundImage = "url(" + finalBackGround + ")";
    } catch (e) {
      console.error(e.message);
    }
  };

  randomNumArr(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  deleteBackground() {
    this.body.style.backgroundImage = "";
  }

  toFahrenheit(temp) {
    return Math.trunc((temp - 273.15) * (9 / 5) + 32);
  }
}
const weather = new Weather();
