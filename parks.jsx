window.addEventListener('DOMContentLoaded', init);
function init() {
    document.addEventListener("DOMContentLoaded", loadToday);
    window.onload = getParks;
    document.getElementById("submit-button").addEventListener("click", SubmitDates)
    document.getElementById("select-park").addEventListener("change",  () => getCamps(document.getElementById("select-park").value))
}



parkAvailability = {}
var parks = {}
var URLs = []
var campsites = {}
var daysAvailable = {}


// getCampsites finds the campground's campsites' availability for a month with a given start-date.
function getCampsites(id, date, callback){
    campsiteIds = []
    let request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if (request.readyState == 4 && request.status == 200)
        {
            callback(JSON.parse(request.response)); // Another callback here
        }
    }; 
    request.open("GET", "https://www.recreation.gov/api/camps/availability/campground/" + id + "/month?start_date=" + date + "T00%3A00%3A00.000Z");
    request.send();
}

function getCampgroundID(url) {
    id = "";
    for (let i = url.length - 1; i >= 0; i--) {
        if(/^-?\d+$/.test(url.charAt(i))) {
            id = url.charAt(i) + id;
        }
        else {
            break;
        }
    }
    return id;
}

function getCamps(parkCode){
    camps = parks[parkCode] 
    for (let i = 0; i < camps.length; i++) {
        URLs.push(getCampgroundID(camps[i].reservationUrl));
    }
    URLs = [... new Set(URLs)]
    return URLs
}

// getParks populates the dropdown menu with parks that offer camping
async function getParks(){
    loadToday();

    // const data = await fetch('key.txt');
    // const apiKey = await data.text();

    let request = new XMLHttpRequest();
    request.open("GET", "https://developer.nps.gov/api/v1/campgrounds?limit=502")
    request.setRequestHeader('X-Api-Key', "Al5Q4vgNLW5trEeOjWPYGHXEMeuxzS1V1WIM0qTU");
    request.send();
    request.onload = () => {
        if (request.status === 200) {
            campgrounds = JSON.parse(request.response).data;
            selection = document.getElementById("select-park");
            for (let i = 0; i < campgrounds.length; i++) {
                currentPark = campgrounds[i].parkCode
                url = campgrounds[i].reservationUrl
                if (url.substring(0, 47)=="https://www.recreation.gov/camping/campgrounds/"  && /^-?\d+$/.test(url.substring(url.length-2, url.length-1))) {
                     if (parks[currentPark] == null) {
                        parks[currentPark] = [campgrounds[i]]
                        op = document.createElement("option");
                        op.value = campgrounds[i].parkCode;
                        op.innerHTML = campgrounds[i].parkCode;
                        selection.appendChild(op)
                     }
                     else {
                        parks[currentPark].push(campgrounds[i])
                    }
                }
            }
        } else {
            console.log('error ${request.status}` ${request.statusText}');
        }
    }
}


// fixDecimals adds a "0" to months and days that are single digits
function fixDecimals(value) {
    if (value.length == 1) {
        return "0" + value
    }
    else {
        return value
    }
}

// getYearMonthDay converts a date to an appropriate form for the calendar
function getYearMonthDay(date) {
    year = date.getFullYear().toString()
    month = fixDecimals(date.getMonth().toString())
    day = fixDecimals(date.getDate().toString())

    return year + "-" + month + "-" + day
}

// getDateMonth converts a date to a form that matches the keys
function getDateMonth(date) {
    year = date.getFullYear().toString()
    month = fixDecimals((date.getMonth() + 1).toString())
    day = fixDecimals(date.getDate().toString())

    return year + "-" + month + "-" + day + "T00:00:00Z"
}

// loadToday sets the calendar to be today
function loadToday() {
    today = new Date()
    tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    document.getElementById("min-range").value = getYearMonthDay(today)
    document.getElementById("max-range").value = getYearMonthDay(tomorrow)
}

function getAvailability(){
    cKeys = Object.keys(campsites)
    for (let i = 0; i < cKeys.length; i++) {
        site = campsites[cKeys[i]]
        days = Object.keys(site)
        for (let j = 0; j < days.length; j++) {
            day = days[i]
            if (daysAvailable[day] == null) {
                daysAvailable[day] = {"date": site[day], "campsite":  "https://www.recreation.gov/camping/campsites/" + cKeys[i]}
            }
            else if (daysAvailable[day] != "Available") { 
                daysAvailable[day]  = {"date": site[day], "campsite": "https://www.recreation.gov/camping/campsites/" + cKeys[i]};
            }
        }
    }
    for (let i = 0; i < days.length; i++) {
        if (daysAvailable[days[i]]["date"] == "Available") {
            console.log(days[i] + ": " + daysAvailable[days[i]].campsite);
            // el = document.createElement("p");
            // el.innerHTML = getDateMonth(new  Date(days[i])).toDateString();
            // el.href = daysAvailable[days[i]]["campsite"]
            // document.getElementsByTagName("body")[0].appendChild(el);
        }
    }
    //console.log(daysAvailable);
}

// SubmitDates finds the available dates within the range when the submit button is clicked
async function SubmitDates() {
    min = new Date(document.getElementById("min-range").value + "T00:00:00.000-07:00");
    max = new Date(document.getElementById("max-range").value + "T00:00:00.000-07:00");
    if (min >= max) {
        console.log("failed to retrieve timeframe information: invalid time range");
        return 
    }

    for (let i = 0; i < URLs.length; i++) {
        getCampsites(URLs[i], "2024-08-01", function(campsite){
            camp = Object.keys(campsite.campsites);
            for (let i = 0; i < camp.length; i ++) {
                campsites[camp[i]] = campsite.campsites[camp[i]].availabilities;
            }
            getAvailability();
        })
    }

    // keyMin = document.getElementById("min-range").value + "T00:00:00Z";
    // keyMax = document.getElementById("max-range").value + "T00:00:00Z";
    // keys = Object.keys(parkAvailability);
    // datesAvailable = [];
    // for (let i = min; i <= max; i.setDate(i.getDate() + 1)) {
    //     date = getDateMonth(i) 
    //     if (date >= keyMin && date <= keyMax) {
    //         if (parkAvailability[date] == "Available"){
    //             datesAvailable.push(date);
    //         }
    //     }
    // }
    // if (datesAvailable.length > 0) {
    //     document.getElementById("show-dates").hidden = false;
    //     document.getElementById("no-dates").hidden = true;
    //     olList =  document.getElementById("list")
    //     for (let i = 0; i < datesAvailable.length; i++) {
    //         el = document.createElement("li");
    //         el.innerHTML = datesAvailable[i]
    //         olList.appendChild(el)
    //     }
    // }
    // else {
    //     document.getElementById("no-dates").hidden = false;
    //     document.getElementById("show-dates").hidden = true;
    // }
    // return datesAvailable

}