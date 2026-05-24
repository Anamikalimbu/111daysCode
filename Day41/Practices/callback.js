setTimeout(() => {
    console.log("Step 1");
    setTimeout(() => {
        console.log("Step 2");
        setTimeout(() => {
            console.log("Step 3");
        }, 1000);
    }, 1000);
}, 1000);

// Callback functions are functions that are passed as arguments to other functions and are executed after a certain event or condition is met. They are commonly used in asynchronous programming to handle tasks that take time to complete, such as reading files, making network requests, or handling user input. Callbacks allow developers to write non-blocking code and manage the flow of execution in an efficient way.
