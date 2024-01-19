//Gets the state of every wled device
// each state is a dictionary composed of: brightness (ac), rgb color (cl), and effect index (fx)
// if a request, that device's state will just be "error"
async function getWledData(){
    var data = [];

    for(let i= 0; i<wledDevices.length; i++){
        try{
            const response = await fetch("http://"+wledDevices[i].ip+"/win");

            xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            // Accessing attributes
            const acValue = xmlDoc.querySelector("ac").textContent;
            const fxValue = xmlDoc.querySelector("fx").textContent;
            const clValues = Array.from(xmlDoc.querySelectorAll("cl")).map((element) => element.textContent);

            data.push({"ac": acValue, "cl": clValues, "fx": fxValue});
        }
        catch{
            data.push("error");
            console.error("[ERROR] Error with request to wled:" + wledDevices[i].ip);
        }
    }
    
    return data;
}



//Turns on the wled corresponding to deviceIndex and updates the data list with its new state
//- will throw an error if request fails
async function turnOnWled(deviceIndex, data){
    const response = await fetch("http://"+wledDevices[deviceIndex].ip+"/win&T=2");
    
    if (!response.ok) {
        throw new Error("Error turning on wled:" + wledDevices[deviceIndex].ip);
    }
    xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // Accessing attributes
    const acValue = xmlDoc.querySelector("ac").textContent;
    const fxValue = xmlDoc.querySelector("fx").textContent;
    const clValues = Array.from(xmlDoc.querySelectorAll("cl")).map((element) => element.textContent);

    data[deviceIndex] = {"ac": acValue, "cl": clValues, "fx": fxValue};
    return data;
}



//Converts an rgb component value to hex
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  


//Converts and rgb value to hex
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



//Increases a color component's value to make it brighter
//the color component is received as a 0-255 integer
function moreWhite(color){
    newColor = color + 60;
    if(newColor > 255) return 255;
    else return newColor;
}



//Sets each wled device's button to its corresponding color
async function setWledColor(devicesData){
    for(let i = 0; i<wledDevices.length; i++){
        if(devicesData[i] == "error"){
            //if the device could not be connected, set the button as unavailable
            document.getElementById("wled_button_"+i).classList.add("unavailable");
        }
        else{
            //base color and hoverColor
            var hexColor = "#141414";
            var secondHexColor = "#6b6b6b";

            //if the light is turned on, set its color
            if(devicesData[i]['ac']!="0"){ 
                const r = parseInt(devicesData[i]['cl'][0]);
                const g = parseInt(devicesData[i]['cl'][1]);
                const b = parseInt(devicesData[i]['cl'][2]);
                hexColor = rgbToHex(r,g,b);
                secondHexColor = rgbToHex(moreWhite(r),moreWhite(g),moreWhite(b));
            }
            document.getElementById("wled_button_"+i).style.color = hexColor;
        }
    }
}



//Creates the wled buttons and assigns their colors
async function setupWled(){
    if(!wledDevices) return;

    //get state of wled devices
    try{
        var devicesData = await getWledData();
    }
    catch(error){
        console.error("[ERROR]" + error);
    }
    

    //create a button for each wled device
    const wledButtonSet = document.getElementById("wled_button_set");

    var index = 0;
    wledDevices.forEach(device => {
        
        var html = "";
        html+= "<div class='wled-button-container' title='"+device.name+"'>";
        html+=  "<button id='wled_button_"+index+"' class='button wled-button'>";
        html+=      "<i class='fa fa-lightbulb-o'></i>";
        html+=  "</button>"
        html+= "</div>"

        wledButtonSet.innerHTML += html;

        index++;
    });


    for(let index = 0; index<wledDevices.length; index++){

        const deviceIndex = index;
        const wledButton = document.getElementById("wled_button_"+deviceIndex);
        //turning on device button functionality
        wledButton.addEventListener("click", async function(){
            try{
                if(!wledButton.classList.contains("unavailable")){
                    devicesData = await turnOnWled(deviceIndex, devicesData);
                    setWledColor(devicesData);
                }
            }
            catch(error){
                console.error("[ERROR]" + error);
            }
        });

        //clicking the button with middle click witll open the device's control page
        wledButton.addEventListener("mousedown", function(event){
            if(event.button === 1 && !wledButton.classList.contains("unavailable")){
                window.open("http://"+wledDevices[deviceIndex].ip,'_blank_');
            }
        })
    }


    //set color
    setWledColor(devicesData);
    
}


setupWled();