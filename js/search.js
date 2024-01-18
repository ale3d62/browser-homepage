const searchUrl = "google.com/search?q=";
/*Other possible search engines:
- DuckDuckGo: duckduckgo.com/?q=
- Bing: bing.com/search?q=
*/
const scheme = "https://";


// Search on enter key event
function search(e) {
    if (e.keyCode == 13) {
        var searchField = document.getElementById("search-field").value;
        var urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)?(?:www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(?:\/[^\s]*)?$/;
        var schemeRegex = /^(?:(?:https?|ftp):\/\/)[^ "]+$/;
        //If its an url
        if(urlRegex.test(searchField)){
            //If url has a scheme
            if(schemeRegex.test(searchField)){
                window.location.href = searchField;
            }
            else{
                window.location.href = scheme + searchField;
            }
            
        }
        else{
            window.location.href = scheme + searchUrl + searchField; 
        }
    }
}



// Move caret on input update
var charWidth = 0; //this only works if font is monospace
document.addEventListener('DOMContentLoaded', () => {
    const inputEle = document.getElementById('search-field');
    const caretEle = document.getElementById('search-caret');

    const canvasEle = document.createElement('canvas');
    // Get the context
    const context = canvasEle.getContext('2d');

    const inputStyles = window.getComputedStyle(inputEle);
    const font = `${inputStyles.getPropertyValue('font-size')} ${inputStyles.getPropertyValue('font-family')}`;
    const paddingLeft = parseInt(inputStyles.getPropertyValue('padding-left'), 10) + 2;
    const caretWidth = caretEle.getBoundingClientRect().width;

    const measureWidth = (text, font) => {
        context.font = font;
        // Measure the text
        const metrics = context.measureText(text);
        // Return the width in pixels
        return metrics.width;
    };

    const updateCaretPosition = (position, nDeletedElements) => {
        const text = inputEle.value.substr(0, position);
        const textWidth = measureWidth(text, font) ;
        if(charWidth == 0){
            charWidth = textWidth;
        }
        const fullTextWidth = measureWidth(inputEle.value, font) - nDeletedElements*charWidth;
        

        const inputWidth = inputEle.getBoundingClientRect().width;
        if (textWidth + caretWidth < inputWidth) {
            caretEle.style.transform = `translate(${(textWidth - fullTextWidth/2)}px, -50%)`;
        }
    };

    const handleSelectionChange = () => {
        if (document.activeElement === inputEle) {
            updateCaretPosition(inputEle.selectionEnd, 0);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && inputEle.value.length > 0) {
            const selectedElements = Math.abs(inputEle.selectionStart-inputEle.selectionEnd);
            if(selectedElements > 0){
                updateCaretPosition(inputEle.selectionStart, selectedElements);
            }
            else{
                updateCaretPosition(inputEle.selectionStart -1, 1);
            }            
        }
    };

    inputEle.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectionchange', handleSelectionChange);

    updateCaretPosition();
});


function closeSearch(){
    document.getElementById("search-field").value = "";
    document.getElementById("search-field").blur();
    document.getElementById("search").style.display = "none";
}

const escKeyButton = document.getElementById("search-esc-button");
escKeyButton.addEventListener("click", function(){closeSearch()});