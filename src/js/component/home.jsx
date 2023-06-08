import React, { useState } from "react";

// The Home component manages a to-do list
const Home = () => {
    // "inputValue" stores the current input text value
    let [inputValue, setInputValue] = useState("");
    // "list" contains all the to-do items
    let [list, setList] = useState([]);

    // The function "handleKeyDown" processes the pressing of the "Enter" key
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            // If "Enter" is pressed, a new item is added to the list
            // And the input field is cleared
            setList([...list, inputValue]);
            setInputValue("");
        }
    };

    // The function "handleDelete" removes an item from the list
    const handleDelete = (index) => {
        // A new list is created without the item at the specified index
        let newList = [...list];
        newList.splice(index, 1);
        setList(newList);
    };

    // The Home component returns a structured to-do list
    return (
        <div className="text-center">
            <h1>TODO</h1>
            <hr />
            <div>
                <input
                    type="text"
                    placeholder="Add tasks here"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            {
                list.length === 0 ? 
                (<p>No tasks, add a task</p>) :
                (
                    <div>
                        {
                            list.map((item, index) => (
                                <div key={index} style={{ padding: "5px" }}>
                                    <a style={{paddingRight: "5px"}}>{item}</a>
                                    <button onClick={() => handleDelete(index)}>X</button>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
};

// The Home component is exported for usage in other files
export default Home;
