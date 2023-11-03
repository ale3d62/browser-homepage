const searchUrl = "https://google.com/search?q=";
/*Other possible search engines:
- DuckDuckGo: https://duckduckgo.com/?q=
- Bing: https://www.bing.com/search?q=
*/



// Search on enter key event
function search(e) {
    if (e.keyCode == 13) {
    var val = document.getElementById("search-field").value;
    window.open(searchUrl + val);
    }
}