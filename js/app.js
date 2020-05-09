const request = url => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if(response.ok) {
          resolve(response.json());
        } else {
          reject(new Error("Could not check the weather in your city!"));
        }
    })
    .catch(error => console.log(error));
  });
};

const getWeatherInfo = async ( city ) => {
  try {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e066f50227d64e3af0e4296523d85c5a`;
    let response = await request(url);

    let location = response.name;
    let wind_speed = response.wind.speed;
    let pressure = response.main.pressure;
    let humidity = response.main.humidity;
    let icon = response.weather[0].icon;
    let temperature = Math.floor(response.main.temp - 273.15);
    let sensed_temperature = Math.floor(response.main.feels_like - 273.15);
    let description = response.weather[0].description;
    let cloudiness = response.clouds.all;

    let unix_sunrise = response.sys.sunrise;
    let date_sunrise = new Date(unix_sunrise * 1000);
    let hours_sunrise = date_sunrise.getHours();
    let minutes_sunrise = "0" + date_sunrise.getMinutes();
    let seconds_sunrise = "0" + date_sunrise.getSeconds();
    let formatted_time_sunrise = hours_sunrise + ':' + minutes_sunrise.substr(-2) + ':' + seconds_sunrise.substr(-2);

    let unix_sunset = response.sys.sunset;
    let date_sunset = new Date(unix_sunset * 1000);
    let hours_sunset = date_sunset.getHours();
    let minutes_sunset = "0" + date_sunset.getMinutes();
    let seconds_sunset = "0" + date_sunset.getSeconds();
    let formatted_time_sunset = hours_sunset + ':' + minutes_sunset.substr(-2) + ':' + seconds_sunset.substr(-2);

    document.querySelector('.location').innerHTML = location;
    document.querySelector('.description__icon').src = "http://openweathermap.org/img/w/" + icon + ".png";
    document.querySelector('.temperature__value').innerHTML = "Temperature: " + temperature + "&nbsp;<sup>o</sup>C";
    document.querySelector('.description__text').innerHTML = description;
    document.querySelector('.temperature__sensed').innerHTML = "Sensed temperature: " + sensed_temperature + "&nbsp;<sup>o</sup>C";
    document.querySelector('.wind_speed').innerHTML = "Wind speed: " + wind_speed + " meter/sec";
    document.querySelector('.pressure').innerHTML = "Pressure: " + Math.floor(pressure) + " hPa";
    document.querySelector('.humidity').innerHTML = "Humidity: " + humidity + " %";
    document.querySelector('.cloudiness').innerHTML = "Cloudiness: " + cloudiness + " %";
    document.querySelector('.sunrise').innerHTML = "Sunrise: " + formatted_time_sunrise;
    document.querySelector('.sunset').innerHTML = "Sunset: " + formatted_time_sunset;

    backgroundSet(location, description);
  } catch(err) {
    console.log(err);
  }
};

let backgroundSet = (location, description) => {
  let form_section = document.querySelector('.form-section');

  if(location === "Katowice"){
    form_section.style.setProperty("background-image", "url(./images/kato.jpg)");
  } else if (description.includes("clouds")){
    form_section.style.setProperty("background-image", "url(./images/clouds.jpg)");
  } else if (description.includes("snow")){
    form_section.style.setProperty("background-image", "url(./images/snow.jpg)");
  } else if (description.includes("rain")){
    form_section.style.setProperty("background-image", "url(./images/rain.jpg)");
  } else if (description.includes("sun") || description.includes("clear")){
    form_section.style.setProperty("background-image", "url(./images/sun.jpg)");
  } else {
    form_section.style.setProperty("background-image", "url(./images/weather.jpg)");
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const city = "Katowice";
  getWeatherInfo(city);
  let form = document.querySelector('#form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let q = form.querySelector('#city').value;
    getWeatherInfo(q);
  }, false);
});
