function openPopup(popupId){
  const popup = document.getElementById(popupId);

  popup.classList.remove("hide");
  popup.classList.add("show");
}

function closePopup(popupId){
  const popup = document.getElementById(popupId);
  //hide popup
  popup.classList.remove("show");
  popup.classList.add("hide");
}

document.getElementById("extra_bookmarks_popup_close_button").addEventListener("click", function(){closePopup("extra_bookmarks_popup_content")});
document.getElementById("wallpapers_popup_close_button").addEventListener("click", function(){closePopup("wallpapers_popup_content")});
document.getElementById("settings_popup_close_button").addEventListener("click", function(){closePopup("settings_popup_content")});