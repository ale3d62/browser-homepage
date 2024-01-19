//initialize global variables
var connectToServer;
var serverIp;
var serverPort;
var lifeBarTextState;
var wledDevices;
var wallpapersRoute;
var currentWallpaperName;
var wallpaperCycling;
var wallpaperCyclingTime;
var wallpaperCyclingTimeUnit;
loadValuesFromStorage();


//Get values from storage
function loadValuesFromStorage(){
    connectToServer = localStorage.getItem("connectToServer"); //true or false string
    serverIp = localStorage.getItem("serverIp"); //ip string
    serverPort = localStorage.getItem("serverPort"); //port string
    lifeBarTextState = localStorage.getItem("lifeBarText"); // true or false string
    wledDevices = JSON.parse(localStorage.getItem("wledDevices")); //array of dictionaries: {"name": name, "ip": ip}
    wallpapersRoute = localStorage.getItem("wallpapersRoute"); //route string
    currentWallpaperName = localStorage.getItem("currentWallpaperName"); //wallpaper id
    wallpaperCycling = localStorage.getItem("wallpaperCycling"); //true or false string
    wallpaperCyclingTime = localStorage.getItem("wallpaperCyclingTime"); //time in seconds string
    wallpaperCyclingTimeUnit = localStorage.getItem("wallpaperCyclingTimeUnit"); //option string
    if(!wallpaperCyclingTimeUnit) wallpaperCyclingTimeUnit = "seconds"; //default value
}


//settings popup html elements
const enableServerCheckbox = document.getElementById("enable_server_checkbox");
const serverIpOption = document.getElementById("server_ip_option");
const serverPortOption = document.getElementById("server_port_option");
const wledDevicesContainer = document.getElementById("wledDevicesContainer");
const wallpapersRouteOption = document.getElementById("wallpapers_route");

//Load stored values in the settings popup
enableServerCheckbox.checked = connectToServer;
serverIpOption.value = serverIp;
serverPortOption.value = serverPort;
wallpapersRouteOption.value = wallpapersRoute;
if(wledDevices) {
    for(let i=0; i<wledDevices.length; i++){
        createWledDeviceText(null, wledDevices[i]);
    }
};


//Wled device adding

var addingWledDevice = false;


//creates an wled device text in the wled devices section
//receives a device (object with atributes name and ip) and may or may not receive an
//already created device container
function createWledDeviceText(newDeviceContainer, device){
    const wledDevicesContainer = document.getElementById("wled_devices_container");

    //if a device container wasnt sent, create one
    if(!newDeviceContainer){
        newDeviceContainer = document.createElement("div");
        newDeviceContainer.className = "wled-device-container";
        wledDevicesContainer.appendChild(newDeviceContainer);
    }

    //create new html elements
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

    //delete button functionality
    newDeviceDeleteButton.addEventListener("click", function(){
        newDeviceContainer.remove();
        wledDevices = wledDevices.filter(function(object){
            return object.name !== device.name;
        });
    });

    //append html elements to the device container
    newDeviceContainer.appendChild(newDeviceNameText);
    newDeviceContainer.appendChild(newDeviceIpText);
    newDeviceContainer.appendChild(newDeviceDeleteButton);
}


//wled add device button functionality
//creates a container with inputs and buttons to create the wled device
const wledAddButton = document.getElementById("wled_add_button");
wledAddButton.addEventListener("click", function(){
    if(addingWledDevice) return;

    //prevents the user from creating two devices at the same time
    addingWledDevice = true;

    //create html elements
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
    
    //append html elements to the created container
    newDeviceContainer.appendChild(newDeviceNameInput);
    newDeviceContainer.appendChild(newDeviceIpInput);
    newDeviceContainer.appendChild(newDeviceConfirmButton);
    newDeviceContainer.appendChild(newDeviceCancelButton);

    wledDevicesContainer.appendChild(newDeviceContainer);


    //Confirm button functionality
    newDeviceConfirmButton.addEventListener("click", function(){
        //save the input values
        const newDeviceName = newDeviceNameInput.value;
        const newDeviceIp = newDeviceIpInput.value;

        //if a value is missing, returns doing nothing
        if(!newDeviceName || !newDeviceIp) return;

        //delete old html elements
        newDeviceNameInput.remove();
        newDeviceIpInput.remove();
        newDeviceConfirmButton.remove();
        newDeviceCancelButton.remove();

        //creates the device, its html text and appends it to the existing container
        device = {"name": newDeviceName, "ip": newDeviceIp};
        createWledDeviceText(newDeviceContainer, device);

        //append the device to the global wledDevices list
        if(!wledDevices)
            wledDevices = [device];
        else
            wledDevices.push(device);

        //allow another wled device to be created
        addingWledDevice = false;
    });


    //Cancel button functionality
    newDeviceCancelButton.addEventListener("click", function(){
        //remove the device container
        newDeviceContainer.remove();

        //allow another wled device to be created
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


//Save settings button functionality
const saveSettingsButton = document.getElementById("save_settings_button");
saveSettingsButton.addEventListener("click", function(){
    saveSettings();
    
    //show saved message
    const saveConfirmText = document.getElementById("save_confirm_text");
    saveConfirmText.classList.remove('save-confirm-text');
    void saveConfirmText.offsetWidth; // trigger reflow
    saveConfirmText.classList.add('save-confirm-text');

    //update the loaded values
    loadValuesFromStorage();
});


//Saves settings to localstorage
function saveSettings(){
    localStorage.setItem("connectToServer", enableServerCheckbox.checked);
    localStorage.setItem("serverIp", serverIpOption.value);
    localStorage.setItem("serverPort", serverPortOption.value);
    localStorage.setItem("wledDevices", JSON.stringify(wledDevices));
    localStorage.setItem("wallpapersRoute", wallpapersRouteOption.value);
}