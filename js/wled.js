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
        }
    }
    
    return data;
}

async function turnOnWled(deviceIndex, data){
    try{
        const response = await fetch("http://"+wledDevices[deviceIndex].ip+"/win&T=2");
        
        if (!response.ok) {
            throw new Error("Wled HTTP Error");
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
    } catch (error) {
        throw error;
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function moreWhite(color){
    newColor = color + 60;
    if(newColor > 255) return 255;
    else return newColor;
}



async function setWledColor(devicesData){
    for(let i = 0; i<wledDevices.length; i++){
        if(devicesData[i] == "error"){
            document.getElementById("wled_button_"+i).classList.add("unavailable");
        }
        else{
            var hexColor = "#141414";
            var secondHexColor = "#6b6b6b";
            if(devicesData[i]['ac']!="0"){ //If the light is turned on
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

//creates the wled buttons and assigns their colors
async function setupWled(){
    if(!wledDevices) return;

    //get state of wled devices
    try{
        var devicesData = await getWledData();
    }
    catch(error){
        console.error(error);
    }
    

    //create a button for each wled device
    const wledButtonSet = document.getElementById("wled_button_set");

    var index = 0;
    wledDevices.forEach(device => {
        const deviceIndex = index;
        
        var html = "";
        html+= "<div class='wled-button-container' title='"+device.name+"'>";
        html+=  "<button id='wled_button_"+deviceIndex+"' class='button wled-button'>";
        html+=      "<i class='fa fa-lightbulb-o'></i>";
        html+=  "</button>"
        html+= "</div>"

        wledButtonSet.innerHTML += html;

        const wledButton = document.getElementById("wled_button_"+deviceIndex);

        wledButton.addEventListener("click", async function(){
            try{
                devicesData = await turnOnWled(deviceIndex, devicesData);
                setWledColor(devicesData);
            }
            catch(error){
                console.error(error);
            }
            
        });

        wledButton.addEventListener("mousedown", function(event){
            if(event.button === 1){
                window.open("http://"+wledDevices[deviceIndex].ip,'_blank_');
            }
        })

       index++;
    });
    //set color
    setWledColor(devicesData);
    
}

setupWled();