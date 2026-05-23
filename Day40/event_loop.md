# Node.js Core: Runtime & The Event Loop (Day 2)

Understanding how Node.js executes code is fundamental to writing performant, non-blocking applications. This guide covers the Node runtime architecture, the Libuv-backed Event Loop, and execution priorities.

---

## 1. The Node.js Runtime Architecture
Node.js is not a programming language; it is a **runtime environment** that allows you to run JavaScript on the server. It is built on three core components:

*   **V8 Engine (Google):** Compiles JavaScript directly into native machine code. It handles memory allocation, call stacks, and garbage collection.
*   **Libuv (C Library):** A multi-platform support library with a focus on asynchronous I/O. It provides the event loop, thread pool, child processes, file system events, and DNS resolution.
*   **C++ Bindings & Core APIs:** The bridge connecting V8 JavaScript code to Libuv's C++ operations (e.g., the `fs` or `net` modules).

```
┌───────────────────────────────────────────────┐
│              JavaScript Code                  │
├───────────────────────────────────────────────┤
│            Node.js Bindings & APIs            │
├───────────────────────┬───────────────────────┤
│    V8 Engine (JS)     │      Libuv (I/O)      │
└───────────────────────┴───────────────────────┘
```

---

## 2. The Single-Threaded Myth
Is Node.js single-threaded? **Yes and No.**
*   **Yes:** The **JavaScript Execution Thread (Call Stack)** is single-threaded. Only one statement is executed at a time.
*   **No:** **Libuv maintains a Thread Pool** (by default, 4 threads, configurable via `UV_THREADPOOL_SIZE`). High-level intensive tasks (like file system access, cryptography, and compressing/zipping) are offloaded to this thread pool to prevent blocking the main thread.

---

## 3. The Event Loop Lifecycle
The event loop allows Node.js to perform non-blocking I/O operations by offloading tasks to the system kernel whenever possible.

When Node.js starts, it initializes the event loop, processes the input script, and begins cycling through **six main phases** in each loop iteration (tick):

```
                     ┌───────────────────────────┐
               ┌────>│          TIMERS           │
               │     │ setTimeout, setInterval   │
               │     └─────────────┬─────────────┘
               │                   │
               │     ┌─────────────▼─────────────┐
               │     │     PENDING CALLBACKS     │
               │     │ I/O system errors/events  │
               │     └─────────────┬─────────────┘
               │                   │
               │     ┌─────────────▼─────────────┐
               │     │       IDLE, PREPARE       │
               │     │     Internal use only     │
               │     └─────────────┬─────────────┘
               │                   │
               │     ┌─────────────▼─────────────┐
               │     │           POLL            │
               │     │ Retrieve I/O; run callbacks
               │     └─────────────┬─────────────┘
               │                   │
               │     ┌─────────────▼─────────────┐
               │     │           CHECK           │
               │     │       setImmediate        │
               │     └─────────────┬─────────────┘
               │                   │
               │     ┌─────────────▼─────────────┐
               │     │      CLOSE CALLBACKS      │
               │     │  socket.on('close', ...)  │
               │     └─────────────┬─────────────┘
               └───────────────────┘
```

### The 6 Phases Explained:
1.  **Timers:** Executes callbacks scheduled by `setTimeout()` and `setInterval()` once their threshold has passed.
2.  **Pending Callbacks:** Executes system-level callbacks (e.g., TCP errors like `ECONNREFUSED`).
3.  **Idle, Prepare:** Used internally by the runtime.
4.  **Poll:** Retrieves new I/O events. Node will execute I/O callbacks here. If there are no timers or setImmediate callbacks scheduled, Node may block here and wait for I/O.
5.  **Check:** Executes callbacks registered with `setImmediate()`.
6.  **Close Callbacks:** Executes teardown callbacks like `socket.on('close', ...)`.

---

## 4. The Microtask Queues: NextTick & Promises
Before entering any phase of the Event Loop, Node.js processes **Microtasks**. There are two microtask queues, and they run *immediately* when the current operation completes, regardless of the active phase:

1.  **NextTick Queue (`process.nextTick`):** The highest priority queue. Executed before the Promise queue.
2.  **Microtask Queue (Promises):** Handles Promise resolution callbacks (`.then`, `.catch`, `async/await` returns).

### Priority Hierarchy:
```
[Call Stack Sync Code] -> [process.nextTick] -> [Promises (microtasks)] -> [Event Loop Phases (macrotasks)]
```

---

## 5. Visualizing Execution Order
Analyze this code snippet to understand execution priority:

```javascript
console.log('1: Synchronous script start');

setTimeout(() => {
  console.log('5: setTimeout (Timer Phase)');
}, 0);

setImmediate(() => {
  console.log('6: setImmediate (Check Phase)');
});

Promise.resolve().then(() => {
  console.log('4: Promise resolved (Microtask)');
});

process.nextTick(() => {
  console.log('3: process.nextTick (Tick Queue)');
});

console.log('2: Synchronous script end');
```

### Output:
```text
1: Synchronous script start
2: Synchronous script end
3: process.nextTick (Tick Queue)
4: Promise resolved (Microtask)
5: setTimeout (Timer Phase)
6: setImmediate (Check Phase)
```

> [!WARNING]
> While `process.nextTick()` is useful for ensuring callbacks run before subsequent operations, nesting calls to it recursively can starve the event loop, causing it to freeze because Node will continuously empty the nextTick queue without advancing the phases.
