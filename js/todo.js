
//Create a line for each todo
const todo_rows = document.getElementById("todo_rows");
createTodoList();

//add button behavior
var addingElement = false;
document.getElementById("todo_add_button").addEventListener("click", function(){
    if(!addingElement){
        const elementTextInput = createInputElement("");
        todo_rows.appendChild(elementTextInput);
        elementTextInput.focus();     
    }
})


//deletes the todo only from the server
async function deleteTodoServerElement(elementText){
    try{
        const response = await fetch("http://"+serverIp+":"+serverPort+"/deleteTodoListItem",{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'itemText': elementText})
        });
        
        if (!response.ok) {
            throw new Error("Error en la solicitud HTTP");
        }
    } catch (error) {
        throw error;
    }
}

//edits the todo only from the server
async function editTodoServerElement(elementText, newElementText){
    try{
        const dataToSend = {'itemText': elementText, 'itemNewText': newElementText}
        const response = await fetch("http://"+serverIp+":"+serverPort+"/editTodoListItem",{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) {
            throw new Error("Error en la solicitud HTTP");
        }
    } catch (error) {
        throw error;
    }
}


//adds the todo to the server
async function addTodoServerElement(elementText){
    try{
        const response = await fetch("http://"+serverIp+":"+serverPort+"/addTodoListItem",{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'itemText': elementText})
        });
        
        if (!response.ok) {
            throw new Error("Error en la solicitud HTTP");
        }
    } catch (error) {
        throw error;
    }
}


//returns a todo input element
function createInputElement(inputText){
    addingElement = true;
    const elementTextInput = document.createElement("input");
    elementTextInput.className = "todo-input";
    elementTextInput.value = inputText;
    elementTextInput.focus();
    elementTextInput.onkeydown = function(e){
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
        if(e.key === 'Escape'){
            if(inputText == ""){
                elementTextInput.remove();
            }
            else{
                elementTextInput.replaceWith(createTodoElement(inputText));
            }
        }
    }
    return elementTextInput;
    
}

//returns a todo element div
function createTodoElement(todoElementText){
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

    
    todoRowDiv.appendChild(deleteButton);
    todoRowDiv.appendChild(editButton);
    todoRowDiv.appendChild(todoRowText);

    return todoRowDiv;
}



//Get the todos from server
async function getServerTodos(){
    try{
    const response = await fetch("http://"+serverIp+":"+serverPort+"/getTodoList",{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
    
    if (!response.ok) {
        throw new Error("Error en la solicitud HTTP");
    }

    const data = await response.json();
    return data.todoList;
    } catch (error) {
        throw error;
    }
}


//gets and updates the server status and creates the todoList
async function createTodoList(){
    const server_status_text = document.getElementById("server_status_text");
    try{
        var todoList = await getServerTodos();

        if(todoList.length > 0){
            todo_rows.innerHTML = ''
            todoList.forEach(todoElementText => {
                    newTodoElement = createTodoElement(todoElementText)
                    todo_rows.appendChild(newTodoElement);
            });
        }
        //update serverstatus text
        server_status_text.innerText = "Server Up";
        server_status_text.className = "server-status-text green";
    }catch(error){
        //update serverstatus text
        server_status_text.innerText = "Server Down";
        server_status_text.className = "server-status-text red";
        console.log("[ERROR]: ", error)
    };
}