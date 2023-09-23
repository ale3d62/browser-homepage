//HOTKEYS
$(document).keydown(function(e) {
    if (e.key == 'Escape') {
        // Esc to close search
        document.getElementById("search-field").value = "";
        document.getElementById("search-field").blur();
        document.getElementById("search").style.display = "none";
        }
    if(e.target.nodeName != "INPUT"){
        if (e.key == ' ') {
        // Spacebar code to open search
        document.getElementById("search").style.display = "flex";
        document.getElementById("search-field").focus();
        } 
    }
});