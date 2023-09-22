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