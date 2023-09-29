//Deletes the todo only from the server
//does not return anything
//- will throw an error if HomeServer request fails
async function deleteTodoServerElement(elementText){
    const response = await fetch("http://"+serverIp+":"+serverPort+"/deleteTodoListItem",{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'itemText': elementText})
    });
    
    if (!response.ok) {
        throw new Error("Error in deleteTodoListItem() request");
    }
}

//Edits the todo only from the server
//does not return anything
//- will throw an error if HomeServer request fails
async function editTodoServerElement(elementText, newElementText){
    const dataToSend = {'itemText': elementText, 'itemNewText': newElementText}
    const response = await fetch("http://"+serverIp+":"+serverPort+"/editTodoListItem",{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    });
    
    if (!response.ok) {
        throw new Error("Error in editTodoListItem request");
    }
}


//Adds the todo to the server
//does not return anything
//- will throw an error if HomeServer request fails
async function addTodoServerElement(elementText){
    const response = await fetch("http://"+serverIp+":"+serverPort+"/addTodoListItem",{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'itemText': elementText})
    });
    
    if (!response.ok) {
        throw new Error("Error in addTodoListItem request");
    }
}


//Returns a todo input element
function createInputElement(inputText){

    //lock user from adding more elements
    addingElement = true;

    const elementTextInput = document.createElement("input");
    elementTextInput.className = "todo-input";
    elementTextInput.value = inputText;
    elementTextInput.focus();

    //pressing enter or escape behaviour
    elementTextInput.onkeydown = function(e){

        //enter creates the to do element
        if(e.key === 'Enter'){
            newTodoElement = createTodoElement(elementTextInput.value);
            
            elementTextInput.replaceWith(newTodoElement);
            addingElement = false;
            if(inputText == ""){
                addTodoServerElement(elementTextInput.value);
            }
            else{
                editTodoServerElement(inputText, elementTextInput.value);
            }
        }
        
        //escape cancels the operation, deleting the input
        if(e.key === 'Escape'){
            if(inputText == ""){
                elementTextInput.remove();
            }
            else{
                elementTextInput.replaceWith(createTodoElement(inputText));
            }
            addingElement = false;
        }
    }
    return elementTextInput;
}

//returns a todo element div
//that div can have an already set text via the todoElementText paramamater
//- will throw an error if HomeServer request fails
function createTodoElement(todoElementText){

    //create html elements for the element
    const todoRowDiv = document.createElement("div");
    todoRowDiv.id = todoElementText+"_container";
    todoRowDiv.className = "todo-element-container";

    const todoRowText = document.createElement("p");
    todoRowText.innerText = todoElementText;
    todoRowText.className = "todo-element-text inline";

    //delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "todo-element-button";
    const deleteButtonIcon = document.createElement("i");
    deleteButtonIcon.className = "fa fa-trash";
    deleteButton.appendChild(deleteButtonIcon);

    deleteButton.addEventListener("click", function(){
        try{
            deleteTodoServerElement(todoElementText);
            todoRowDiv.remove();
        }
        catch(error){
            console.error("Error en la solicitud HTTP:", error);
        }
    });

    //edit button
    const editButton = document.createElement("button");
    editButton.className = "todo-element-button";
    const editButtonIcon = document.createElement("i");
    editButtonIcon.className = "fa fa-pencil-square";
    editButton.appendChild(editButtonIcon);

    editButton.addEventListener("click", function(){
        try{
            if(!addingElement){
                const elementTextInput = createInputElement(todoElementText);
                todoRowDiv.replaceWith(elementTextInput);
                elementTextInput.focus();  
            }
        }
        catch(error){
            console.error("Error en la solicitud HTTP:", error);
        }
    });

    //div hover detection
    todoRowDiv.addEventListener('mouseenter', function() {
        editButton.classList.remove('todo-element-button');
        void editButton.offsetWidth; // trigger reflow
        editButton.classList.add('todo-element-button');
        deleteButton.classList.remove('todo-element-button');
        void deleteButton.offsetWidth; // trigger reflow
        deleteButton.classList.add('todo-element-button');
    })

    //append html elements to todoRowDiv
    todoRowDiv.appendChild(deleteButton);
    todoRowDiv.appendChild(editButton);
    todoRowDiv.appendChild(todoRowText);

    return todoRowDiv;
}



//Get the to do list from server
//- will throw an error if request fails
async function getServerTodos(){
        const response = await fetch("http://"+serverIp+":"+serverPort+"/getTodoList",{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
    
        if (!response.ok) {
            throw new Error("Error in getServerTodos() resquest");
        }

        const data = await response.json();
        return data.todoList;
}


//creates the todoList and updates the server status container
//this is made to save one server request
async function createTodoList(){
    const server_status_text = document.getElementById("server_status_text");
    try{

        //get to do list from server
        var todoList = await getServerTodos();

        //integrate to do list in html
        if(todoList.length > 0){
            todo_rows.innerHTML = ''
            todoList.forEach(todoElementText => {
                    newTodoElement = createTodoElement(todoElementText)
                    todo_rows.appendChild(newTodoElement);
            });
        }


        //update serverstatus text (server up)
        server_status_text.innerText = "Server Up";
        server_status_text.className = "server-status-text green";
    }catch(error){
        //update serverstatus text (server down)
        server_status_text.innerText = "Server Down";
        server_status_text.className = "server-status-text red";
        console.log("[ERROR]: ", error)
    };
}



//Create a line for each to do
const todo_rows = document.getElementById("todo_rows");
createTodoList();

//to do add button behavior

    //to prevent user from adding more than one to do at the same time
var addingElement = false;

document.getElementById("todo_add_button").addEventListener("click", function(){
    if(!addingElement){
        const elementTextInput = createInputElement("");
        todo_rows.appendChild(elementTextInput);
        elementTextInput.focus();     
    }
})