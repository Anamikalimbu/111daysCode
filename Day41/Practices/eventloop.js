console.log("Start");

setTimeout(() => {
    console.log("setTimeout Callback");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise Resolved");
});

console.log("End");

// Event loop phases:
// 1. Timer Phase: Executes callbacks scheduled by setTimeout and setInterval.
// 2. I/O Callbacks Phase: Executes callbacks for completed I/O operations.
// 3. Poll Phase: Executes callbacks for I/O operations that are ready.
// 4. Check Phase: Executes callbacks scheduled by setImmediate.
// 5. Close Callbacks Phase: Executes callbacks for closed handles.

/**
 * Event loop is a mechanism that allows node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible. It continuously checks for events and executes the corresponding callbacks when an event occurs. This allows node.js to handle multiple operations concurrently without blocking the main thread.
 */

// console.log('1. Start');

// // Next tick queue
// process.nextTick(() => console.log('2. Next tick'));

// // Microtask queue (Promise)
// Promise.resolve().then(() => console.log('3. Promise'));

// // Timer phase
// setTimeout(() => console.log('4. Timeout'), 0);

// // Check phase
// setImmediate(() => console.log('5. Immediate'));

// console.log('6. End');