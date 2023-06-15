import React, { useState, useEffect } from "react";




// allows you to get a user name
const getUserName = (forceChange) => {
    // local storage is exactly what it sounds like
    let user = localStorage.getItem('username');

    // if it wants a force full change or if there is no username in local storage
    if((!user) || forceChange) {
        do { // Almost like a repeat until loop
            user = prompt("Please enter your ToDo list api id", "");
        } while(user.length === 0);

        // saves it in the local storage
        localStorage.setItem('username', user);
    }

    return user;
};



// The Home component will manage a to-do list for the specified user
const Home = () => {
    // inputValue stores the current value of the text input box
    const [inputValue, setInputValue] = useState("");

    // list is the state variable that will store all of the to-do items
    const [list, setList] = useState([]);

     // I figured out how to prompt for questions
    // Prompt the user for their username only on the initial render
    const [username, setUsername] = useState(getUserName(false));

    

    // postData is a function that creates a new, empty to-do list for the user on the server
    const postData = () => {
        console.log("Posting data");
        // The function sends a POST request to the server at the specified URL, with an empty array as the body
        fetch('https://assets.breatheco.de/apis/fake/todos/user/'+username, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // The data sent to the server will be JSON
            },
            body: JSON.stringify([]) // The body of the request is an empty array, indicating a new, empty to-do list
        })
        .then(resp => resp.json()) // The response from the server is parsed from JSON into JavaScript
        .then(data => {
            // If the server returns 'ok', the list state variable is set to an empty array
            setList([{ label: "Empty", done: false }]);
        })
        .catch(error => console.log(error)); // Any errors are logged to the console
    };

    // deleteData is a function that deletes all to-dos for the user on the server
    const deleteData = () => {
        console.log("hgf");
        // The function sends a DELETE request to the server at the specified URL
        fetch('https://assets.breatheco.de/apis/fake/todos/user/'+username, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json" // The data sent to the server will be JSON
            }
        })
        .then(resp => resp.json()) // The response from the server is parsed from JSON into JavaScript
        .then(data => {
            // If the server returns 'ok', the list state variable is set to an empty array
            if (data.result === 'ok') {
                postData();
            }
        })
        .catch(error => console.log(error)); // Any errors are logged to the console
    };
    
    // This useEffect hook runs once when the component first loads
    useEffect(() => {
        console.log("123");
        // The hook sends a GET request to the server to fetch the user's to-do list
        fetch('https://assets.breatheco.de/apis/fake/todos/user/'+username, {
            method: "GET",
            headers: {
                "Content-Type": "application/json" // The expected data from the server is JSON
            }
        })
        .then(resp => resp.json()) // The response from the server is parsed from JSON into JavaScript
        .then(data => {
            // If the server's response is an empty array, the postData function is called to create a new to-do list
            console.log(username);
            console.log(data.length);
            if (! data.length) {
                console.log("No data");
                postData();
            } else {
                // If the server's response contains to-do items, the list state variable is set to this data
                setList(data);
            }
            console.log(list);
        })
        .catch(error => console.log(error)); // Any errors are logged to the console
    }, []);

    
    
    // This useEffect hook runs every time the list state variable changes
    useEffect(() => {
        // The hook only sends a PUT request if the list
        // The hook only sends a PUT request if the list is not empty
        if (list.length > 0) {
            console.log(list.length);
            // The function sends a PUT request to the server with the updated to-do list
            fetch('https://assets.breatheco.de/apis/fake/todos/user/'+username, {
                method: "PUT",
                body: JSON.stringify([{ label: "Empty", done: false }]), // The updated to-do list is sent as the body of the request
                headers: {
                    "Content-Type": "application/json" // The data sent to the server will be JSON
                }
            })
            .then(resp => resp.json()) // The response from the server is parsed from JSON into JavaScript
            .then(data => console.log(data, list)) // The server's response is logged to the console
            .then(data => {
                fetch('https://assets.breatheco.de/apis/fake/todos/user/'+username, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json" // The expected data from the server is JSON
                    }
                })
                .then(resp => resp.json()) // The response from the server is parsed from JSON into JavaScript
                .then(data => console.log(data.length))
            })
            .catch(error => console.log(error)); // Any errors are logged to the console
        }
    }, [list, username]);

    // handleKeyDown is called every time a key is pressed in the input box
    const handleKeyDown = (event) => {
        // If the key that was pressed is 'Enter', a new to-do item is added to the list
        if (event.key === "Enter") {
            setList([...list, { label: inputValue, done: false }]);
            setInputValue(""); // The input box is cleared
        }
    };

    // handleDelete is called when the user wants to delete a to-do item
    const handleDelete = (index) => {
        let newList = [...list]; // A copy of the list state variable is created
        newList.splice(index, 1); // The to-do item at the specified index is removed
        setList(newList); // The list state variable is updated to the new list
    };

    // The Home component's JSX
    return (
        <div className="text-center">
            <h1>Todo list for: {username}</h1>
            <hr />
            <div>
                <input
                    type="text"
                    placeholder="Add tasks here"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)} // The inputValue state variable is updated every time the user types in the input box
                    onKeyDown={handleKeyDown} // The handleKeyDown function is called every time the user presses a key in the input box
                />
                <button onClick={deleteData}>Clear All</button> {/* The deleteData function is called when the user clicks the 'Clear All' button */}
                <button onClick={()=>{
                    setUsername(getUserName(true));
                }}>Change Username</button>
            </div>
            {
                // If the list state variable is empty, a message is displayed telling the user to add tasks
                list.length <= 1 ? 
                (<p>No tasks, add a task</p>) :
                (
                    // If the list state variable contains to-do items, each item is displayed with a delete button
                    <div>
                        {
                            list.map((item, index) => {
                                if (index >= 1) {
                                    return (
                                        <div key={index} style={{ padding: '5px' }}>
                                            <span>{item.label}</span>
                                            <button onClick={() => handleDelete(index)}>Delete</button> {/* The handleDelete function is called when the user clicks the 'Delete' button */}
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                )
            }
        </div>
    );
}

export default Home;
