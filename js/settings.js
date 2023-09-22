//settings popup elements
const enableServerCheckbox = document.getElementById("enable_server_checkbox");
const serverIpOption = document.getElementById("server_ip_option");
const serverPortOption = document.getElementById("server_port_option");
const wledDevicesContainer = document.getElementById("wledDevicesContainer");
const wallpapersRouteOption = document.getElementById("wallpapers_route");

var connectToServer;
var serverIp;
var serverPort;
var lifeBarTextState;
var wledDevices;
var wallpapersRoute;
var currentWallpaperName;
loadValuesFromStorage();


//Get values from storage
function loadValuesFromStorage(){
    connectToServer = localStorage.getItem("connectToServer"); //true or false string
    serverIp = localStorage.getItem("serverIp"); //ip string
    serverPort = localStorage.getItem("serverPort"); //port string
    lifeBarTextState = localStorage.getItem("lifeBarText"); // true or false string
    wledDevices = JSON.parse(localStorage.getItem("wledDevices")); //array of dictionaries: {"name": name, "ip": ip}
    wallpapersRoute = localStorage.getItem("wallpapersRoute") //route string
    currentWallpaperName = localStorage.getItem("currentWallpaperName") //wallpaper id
}


//Load stored values in the settings popup
enableServerCheckbox.checked = connectToServer;
serverIpOption.value = serverIp;
serverPortOption.value = serverPort;
wallpapersRouteOption.value = wallpapersRoute;
if(wledDevices) loadWledDevicesContainer();


function loadWledDevicesContainer(){
    for(let i=0; i<wledDevices.length; i++){
        createWledDeviceText(null, wledDevices[i]);
    }
}

var addingWledDevice = false;


function createWledDeviceText(newDeviceContainer, device){
    const wledDevicesContainer = document.getElementById("wled_devices_container");
    if(!newDeviceContainer){
        newDeviceContainer = document.createElement("div");
        newDeviceContainer.className = "wled-device-container";
        wledDevicesContainer.appendChild(newDeviceContainer);
    }

    //create new elements
    const newDeviceNameText = document.createElement("span");
    newDeviceNameText.innerText = device.name;
    newDeviceNameText.className = "wled-device-text";
    const newDeviceIpText = document.createElement("span");
    newDeviceIpText.innerText = device.ip;
    newDeviceIpText.className = "wled-device-text";
    const newDeviceDeleteButton = document.createElement("button");
    newDeviceDeleteButton.className = "button wled-device-input-button";
    const newDeviceDeleteButtonIcon = document.createElement("i");
    newDeviceDeleteButtonIcon.className = "fa fa-trash";
    newDeviceDeleteButton.appendChild(newDeviceDeleteButtonIcon);

    newDeviceDeleteButton.addEventListener("click", function(){
        newDeviceContainer.remove();
        wledDevices = wledDevices.filter(function(object){
            return object.name !== device.name;
        });
    });

    newDeviceContainer.appendChild(newDeviceNameText);
    newDeviceContainer.appendChild(newDeviceIpText);
    newDeviceContainer.appendChild(newDeviceDeleteButton);
}


//wled add device button functionality
const wledAddButton = document.getElementById("wled_add_button");
wledAddButton.addEventListener("click", function(){
    if(addingWledDevice) return;

    addingWledDevice = true;

    const wledDevicesContainer = document.getElementById("wled_devices_container");
    const newDeviceContainer = document.createElement("div");
    newDeviceContainer.className = "wled-device-container";
    const newDeviceNameInput = document.createElement("input");
    newDeviceNameInput.className = "wled-device-input";
    newDeviceNameInput.placeholder = "name";
    const newDeviceIpInput = document.createElement("input");
    newDeviceIpInput.className = "wled-device-input";
    newDeviceIpInput.placeholder = "ip";
    const newDeviceConfirmButton = document.createElement("button");
    newDeviceConfirmButton.className = "button wled-device-input-button";
    const newDeviceConfirmButtonIcon = document.createElement("i");
    newDeviceConfirmButtonIcon.className = "fa fa-check";
    newDeviceConfirmButton.appendChild(newDeviceConfirmButtonIcon);
    const newDeviceCancelButton = document.createElement("button");
    newDeviceCancelButton.className = "button wled-device-input-button";
    const newDeviceCancelButtonIcon = document.createElement("i");
    newDeviceCancelButtonIcon.className = "fa fa-close";
    newDeviceCancelButton.appendChild(newDeviceCancelButtonIcon);
    

    newDeviceContainer.appendChild(newDeviceNameInput);
    newDeviceContainer.appendChild(newDeviceIpInput);
    newDeviceContainer.appendChild(newDeviceConfirmButton);
    newDeviceContainer.appendChild(newDeviceCancelButton);

    wledDevicesContainer.appendChild(newDeviceContainer);

    newDeviceConfirmButton.addEventListener("click", function(){
        //save the values
        const newDeviceName = newDeviceNameInput.value;
        const newDeviceIp = newDeviceIpInput.value;

        //if a value is missing, return
        if(!newDeviceName || !newDeviceIp) return;

        //delete old elements
        newDeviceNameInput.remove();
        newDeviceIpInput.remove();
        newDeviceConfirmButton.remove();
        newDeviceCancelButton.remove();

        device = {"name": newDeviceName, "ip": newDeviceIp};
        createWledDeviceText(newDeviceContainer, device);

        if(!wledDevices)
            wledDevices = [device];
        else
            wledDevices.push(device);

        addingWledDevice = false;
    });


    newDeviceCancelButton.addEventListener("click", function(){
        newDeviceContainer.remove();
        addingWledDevice = false;
    });
});

//Wallpapers route confirm button functionality
const wallpapersRouteConfirmButton = document.getElementById("wallpapers_route_confirm_button");
wallpapersRouteConfirmButton.addEventListener("click", function(){
    saveSettings();
    loadValuesFromStorage();
    setupWallpapers();
}) 


//Save settings button
const saveSettingsButton = document.getElementById("save_settings_button");
saveSettingsButton.addEventListener("click", function(){
    saveSettings();
    const saveConfirmText = document.getElementById("save_confirm_text");
    saveConfirmText.classList.remove('save-confirm-text');
    void saveConfirmText.offsetWidth; // trigger reflow
    saveConfirmText.classList.add('save-confirm-text');
    loadValuesFromStorage();
});

function saveSettings(){
    localStorage.setItem("connectToServer", enableServerCheckbox.checked);
    localStorage.setItem("serverIp", serverIpOption.value);
    localStorage.setItem("serverPort", serverPortOption.value);
    localStorage.setItem("wledDevices", JSON.stringify(wledDevices));
    localStorage.setItem("wallpapersRoute", wallpapersRouteOption.value);
}