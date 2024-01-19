//PARAMETERS
//-----------------------------------
const birthDateStr = "05-08-1950";
const lifeExpentancyYearsStr = "80";
//-----------------------------------

var currentDate = new Date();


//convert date data
var birthDay = parseInt(birthDateStr.split("-")[0], 10);
var birthMonth = parseInt(birthDateStr.split("-")[1], 10);
var birthYear = parseInt(birthDateStr.split("-")[2], 10);

var birthDate = new Date(birthYear, birthMonth, birthDay);
var lifeExpentancyYears = parseInt(lifeExpentancyYearsStr, 10);

//calculate percentaje
var timePassed = currentDate - birthDate;
var exactPercentaje = (timePassed / (lifeExpentancyYears* 365 * 24 * 60 * 60 * 1000)) * 100;

//round two decimals
var percentaje = Math.round((exactPercentaje + Number.EPSILON) * 100) / 100;

document.getElementById("life_bar_progress").style.width = percentaje+"%";
document.getElementById("life_bar_text").style.marginLeft = "-"+percentaje+"%";
document.getElementById("life_bar_percentaje_text").innerText = percentaje+"%";


//setup lifebar message
document.getElementById("life_bar_message").innerText = inspiringMessages[messageIndex];


//hide lifebar message
const lifeBarText = document.getElementById("life_bar_message");
if (lifeBarTextState == "false")
    lifeBarText.classList.toggle("hide"); 

//hide message by pressing on it
lifeBarText.addEventListener("click", function(){
    localStorage.setItem("lifeBarText", lifeBarText.classList.contains("hide"));
    lifeBarText.classList.toggle("hide");
});