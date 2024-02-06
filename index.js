
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".weather-container");
const searchFrom = document.querySelector("[data-searchFrom]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-conatiner");

// initially need variable

let key = 'a4bf314e6160a4a0084639c2b809b3db';
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

function swithTab(clickedtab)
{
    if(clickedtab != currentTab)
    {
        currentTab.classList.remove('current-tab');
        currentTab = clickedtab;
        currentTab.classList.add("current-tab");

        if(!searchFrom.classList.contains("active"))
        {
            // means current tab was usertab
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchFrom.classList.add("active");
        }
        else{
            // means we were in search tab and need to move usertab

            searchFrom.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // dispaly your current waether
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click",()=> {
    //pass click tab
    swithTab(userTab);
});

searchTab.addEventListener("click",()=> {
    //pass click tab
    swithTab(searchTab);
});



function getfromSessionStorage()
{
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add("active");
    }
    else
    {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon} = coordinates;

    // make grant container invisible
    grantAccessContainer.classList.remove("active");

    //loading visible
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        randerWeatherInfo(data);
    }
    catch(e)
    {
        loadingScreen.classList.remove("active");
        console.log(e);
    }
}


function randerWeatherInfo(weatherInfo)
{
    console.log(weatherInfo);
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");

    // fethch values
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =   `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getlocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No geolocation Support");
    }
}


function showPosition(position)
{
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    console.log(userCoordinates);

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAcessButton = document.querySelector("[data-grantAccess]");
grantAcessButton.addEventListener("click",getlocation);


const searchInput = document.querySelector(".input-bar");
const searchBtn = document.querySelector(".search-btn");
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let cityName = searchInput.value;
    if(cityName === "") 
        return;
    else
        fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(cityName)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`);
        const data  =  await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        randerWeatherInfo(data);
    }
    catch(er)
    {
        console.log('Error Occur');
    }
}