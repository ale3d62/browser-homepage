async function setupWallpapers(){
    const wallpaperThumbsContainer = document.getElementById("wallpaper_thumbs_container");
    wallpaperThumbsContainer.innerHTML = "";


    if(!wallpapersRoute) return;

    const wallpaperNames = await getWallpaperNames();

    for(let i = 0; i<wallpaperNames.length; i++){
        const thumb = document.createElement("img");
        thumb.className = "thumb";
        thumb.classList.add("good");
        thumb.src = wallpapersRoute+"/"+wallpaperNames[i];

        //in case the wallpaper is missing locally
        thumb.onerror = function(){
            thumb.src = "img_error.png";
            thumb.classList.remove("good");
            thumb.classList.add("missing");
        }

        if(wallpaperNames[i] == currentWallpaperName && thumb.classList.contains("good")){
            thumb.classList.add("selected");
        }
    
        wallpaperThumbsContainer.appendChild(thumb);
    
        thumb.onclick = function(){
            if(thumb.classList.contains("good") && ! thumb.classList.contains("selected")){
                selectWallpaper(thumb);
                //save wallpaperName
                localStorage.setItem("currentWallpaperName", wallpaperNames[i]);
            }
        }
    }
}


async function getWallpaperNames(){
    try{
        const serverResponse = await fetch("http://"+serverIp+":"+serverPort+"/getWallpapers",{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({wallhavenUsername: "ale3d62", wallhavenCollectionId: "1591884"})
        });
        const data = await serverResponse.json();
        if(! data.error)
            wallpaperNames = await data.wallpaperNames;
        else
            wallpaperNames = [];
    } catch (error) {
        wallpaperNames = [];
        console.error("[ERROR] getWallpaperNames() request failed")
    }
    return wallpaperNames;
}


//Selects the wallpaper and sets it as the current one
function selectWallpaper(thumb){
    //Change selected thumb
    selectedThumb = document.getElementsByClassName("selected");
    if(selectedThumb.length == 1){
        const previousThumb = selectedThumb[0];
        previousThumb.classList.remove("selected");
    
    }
    thumb.classList.add("selected");

    //Change wallpaper
    const wallpaper = document.getElementById("wallpaper");
    wallpaper.style.opacity = 0;
    setTimeout(() => {
        wallpaper.src = thumb.src;
        wallpaper.style.opacity = 1;
    }, 100);
}



//load current wallpaper
if(wallpapersRoute){
    document.getElementById("wallpaper").src = wallpapersRoute+"/"+currentWallpaperName;
}

//setup wallpapers in popup
setupWallpapers();



//WALLPAPER CYCLING FUNCTIONALITY

//set local values in html elements
const wallpaperCyclingCheckbox = document.getElementById("wallpaper_cycling_checkbox");
const wallpaperCyclingTimeInput = document.getElementById("wallpaper_cycling_time_input");
const timeUnitSelect = document.getElementById("time_unit_select");

wallpaperCyclingCheckbox.checked = wallpaperCycling == "true";
wallpaperCyclingTimeInput.value = wallpaperCyclingTime;
timeUnitSelect.value = wallpaperCyclingTimeUnit;


//returns the cycling time in seconds, if its not set, returns null
function getCyclingTime(){
    var cyclingTime = parseInt(wallpaperCyclingTime);
    if(cyclingTime){

        //convert the time acording to timeUnit
        if(wallpaperCyclingTimeUnit == "minutes") cyclingTime *= 60;
        else if(wallpaperCyclingTimeUnit == "hours") cyclingTime*=3600;
    }   
    return cyclingTime;
}


//indicates if wallpaperCycler is currently running;
var cycling = false;

//waits for the cyclingTime and switches the wallpaper repeatedly
//ends if wallCycling is disabled or if cycling time is not set
async function wallpaperCycler(){
    var cyclingTime = getCyclingTime();

    while(wallpaperCycling=="true" && cyclingTime){
        //sleep for the time set
        await new Promise(r => setTimeout(r, cyclingTime*1000));

        //get available wallpapers
        var availableWallpapers = document.querySelectorAll("img:not(.selected):not(.missing)");
        //pick a random and switch
        const randomIndex = Math.floor(Math.random() * availableWallpapers.length);
        const randomThumb = availableWallpapers[randomIndex];
        selectWallpaper(randomThumb);

        //update cycling time for the next iretation
        cyclingTime = getCyclingTime();
    }

    cycling = false;
}



//returns true if cycling is enabled and a cycletime is set
function checkForCycling(){
    return (wallpaperCycling=="true" && parseInt(wallpaperCyclingTime));
}



//wallpaperCycler triggering

//check at the start
if(checkForCycling() && !cycling){
    cycling = true;
    wallpaperCycler();
} 

//check if input changes
wallpaperCyclingCheckbox.addEventListener("change", function(){
    //save value in localstorage
    wallpaperCycling = wallpaperCyclingCheckbox.checked.toString();
    localStorage.setItem("wallpaperCycling", wallpaperCycling);
    
    if(checkForCycling() && !cycling){
        cycling = true;
        wallpaperCycler();
    } 
});

const wallpaperCyclingTimeConfirmButton = document.getElementById("wallpaper_cycling_time_confirm_button");
wallpaperCyclingTimeConfirmButton.addEventListener('click', function(){
    //animation
    wallpaperCyclingTimeConfirmButton.classList.remove("wallpaper-cycling-time-confirm");
    void wallpaperCyclingTimeConfirmButton.offsetWidth; // trigger reflow
    wallpaperCyclingTimeConfirmButton.classList.add("wallpaper-cycling-time-confirm");
    //save value in localstorage
    wallpaperCyclingTime = wallpaperCyclingTimeInput.value;
    wallpaperCyclingTime_unit = timeUnitSelect.value;
    localStorage.setItem("wallpaperCyclingTime", wallpaperCyclingTime);
    localStorage.setItem("wallpaperCyclingTime_unit", wallpaperCyclingTime_unit);

    if(checkForCycling() && !cycling){
        cycling = true;
        wallpaperCycler();
    } 
});