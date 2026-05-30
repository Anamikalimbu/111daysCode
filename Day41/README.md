## 🌟 Features

1. 📂 **Directory Listing (`list` / `ls`)**: Asynchronously traverses directories, formats sizes into human-readable strings, maps file modes to Unix symbolic permissions (e.g. `drwxrwxrwx`), and lists contents in a beautiful, sorted tabular form.
2. 🌳 **Directory Tree (`tree`)**: Renders an elegant recursive folder tree with customizable depth controls (`--depth`) to visually inspect deep project directories without clogging the terminal.
3. 🔎 **Deep File Inspection (`inspect` / `view`)**: Displays comprehensive file stats (timestamps, exact sizes, octal and symbolic modes). Text-based files feature a **high-performance, stream-based 1KB preview**.
4. 💻 **System Inspector (`sysinfo` / `sys`)**: Displays system platform, memory usage, CPU model, CPU cores, uptime, and network interfaces using a modular CommonJS design.
5. ⚡ **Event Loop Timing Simulator (`demo`)**: An interactive command that visually proves Node's Event Loop phases (nextTick microtask queues vs Promise microtask queues, Timer macrotasks, and Poll phase I/O execution order).

---

## 🚀 Usage Guide

Navigate to the `Day41` directory and execute commands using Node:

```bash
# Display help and commands overview
node explorer.js --help

# List current directory contents
node explorer.js list .

# List files and folders with color disabled
node explorer.js list . --no-color

# Generate a visual directory tree up to depth 2
node explorer.js tree . --depth 2

# Inspect a file and read a 1KB stream-preview
node explorer.js inspect ./package.json

# Fetch current OS and Hardware specs
node explorer.js sysinfo

# Run the live Event Loop scheduling demo
node explorer.js demo
```

---

## 🧠 Architectural Insights Explained

### 1. Asynchronous I/O & The Event Loop
In Node.js, the main thread is single-threaded. Blocking operations (like standard `fs.readFileSync`) halt all execution. In our CLI, we exclusively use asynchronous APIs (`fs.promises.readdir`, `fs.promises.stat`, `fs.createReadStream`). 
- When an async file request is made, Node delegates it to the **libuv Thread Pool** (in the background).
- The main thread continues running other code immediately.
- Once the operation completes, a callback is queued and handled during the **Poll Phase** of the Event Loop.

Run the `node explorer.js demo` command to see nextTick, Promises, setTimeout, setImmediate, and fs callbacks executing in real time!

### 2. Streams vs. Buffering (Memory Efficiency)
In the `inspect` command, rather than reading the entire file into RAM using `fs.readFile` (which can crash the application or waste resources if checking multi-gigabyte logs), we use `fs.createReadStream`.
- Streams read files in chunks (buffers) sequentially.
- By piping the stream or listening to the `data` event and ending the stream at `1023` bytes, we only load **exactly 1KB** of data into memory, regardless of whether the file size is 10KB or 10GB.
- This represents a highly scalable, memory-efficient design pattern.

### 3. Module Systems Interoperability (ESM vs. CommonJS)
In modern JavaScript, there are two competing module systems:
- **ESModules (ESM)**: Native JS modules using `import/export`. Used as our project-wide default by configuring `"type": "module"` in `package.json`.
- **CommonJS (CJS)**: Node's legacy module system using `require()` and `module.exports`. Used in `lib/sysInfo.cjs`.

Node.js allows them to coexist through strict filename-extension conventions:
1. Since `"type": "module"` is in `package.json`, any `.js` file defaults to ESM.
2. A `.cjs` extension forces Node.js to load a file strictly as CommonJS.
3. Our ESM router (`explorer.js`) imports the CJS module statically using the standard import structure:
   ```javascript
   import sysInfo from './lib/sysInfo.cjs';
   const { getSystemInfo } = sysInfo;
   ```
   This showcases flawless interoperability between the modern and legacy module structures.