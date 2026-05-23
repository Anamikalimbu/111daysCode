# Node.js Core: fs, path, & os Modules (Day 2)

Node.js comes with a rich set of built-in modules to interact with the file system, resolve file paths, and gather operating system details. This guide covers the three most critical core modules.

---

## 1. The `fs` (File System) Module
The `fs` module allows you to read, write, update, delete, and monitor files/directories. Node.js provides three ways to access `fs` features:

### A. Callback-Based (Asynchronous, Non-blocking)
The traditional way. Does not block the main thread, but can lead to "Callback Hell" if nested.
```javascript
const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) return console.error('Error reading file:', err);
  console.log(data);
});
```

### B. Synchronous (Blocking)
Simple but halts the entire execution thread until completed. Avoid using these in web server code.
```javascript
const fs = require('fs');

try {
  const data = fs.readFileSync('data.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error('Error reading file synchronously:', err);
}
```

### C. Promises-Based (Modern, Recommended)
Uses Promises and `async/await`. Clean and modern syntax.
```javascript
const fs = require('fs/promises');

async function readFileAsync() {
  try {
    const data = await fs.readFile('data.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error reading file with promises:', err);
  }
}
readFileAsync();
```

### Essential `fs` Methods Cheat Sheet:
*   `fs.readFile(path, options)` / `fs.writeFile(path, data)`
*   `fs.readdir(path)` - Reads contents of a directory.
*   `fs.mkdir(path, { recursive: true })` - Creates directories safely.
*   `fs.stat(path)` - Retrieves metadata like file size and creation date.
*   `fs.unlink(path)` - Deletes a file.
*   `fs.rm(path, { recursive: true })` - Deletes files/directories recursively.

---

## 2. The `path` Module
Working with file paths using basic string manipulation is error-prone and platform-dependent (Windows uses `\`, Mac/Linux use `/`). The `path` module resolves this.

### Key Methods:
*   **`path.join(...paths)`**: Combines multiple path segments into a single string using the platform's delimiter.
*   **`path.resolve(...paths)`**: Resolves a sequence of paths or path segments into an absolute path.
*   **`path.basename(filePath)`**: Returns the last portion of a path (e.g., `app.js`).
*   **`path.dirname(filePath)`**: Returns the directory name of a path (e.g., `/user/bin`).
*   **`path.extname(filePath)`**: Extracts the file extension (e.g., `.json`).
*   **`path.parse(filePath)`**: Breaks a path into an object containing `root`, `dir`, `base`, `ext`, and `name`.

### Code Example:
```javascript
const path = require('path');

const samplePath = '/projects/node-app/src/index.js';

console.log('Join:', path.join('projects', 'node-app', 'src', 'index.js'));
// Output (Windows): projects\node-app\src\index.js
// Output (macOS): projects/node-app/src/index.js

console.log('Resolve:', path.resolve('src', 'index.js'));
// Output: absolute path starting from current working directory

console.log('Basename:', path.basename(samplePath)); // 'index.js'
console.log('Extension:', path.extname(samplePath));  // '.js'
console.log('Directory:', path.dirname(samplePath));   // '/projects/node-app/src'
console.log('Parsed:', path.parse(samplePath));
/* Output:
{
  root: '/',
  dir: '/projects/node-app/src',
  base: 'index.js',
  ext: '.js',
  name: 'index'
}
*/
```

---

## 3. The `os` Module
The `os` module provides operating-system related utility methods and properties. It is useful for system monitoring or matching application configurations to system specs.

### Key Methods:
*   `os.platform()` - Returns the OS platform (e.g., `win32`, `darwin`, `linux`).
*   `os.arch()` - Returns the CPU architecture (e.g., `x64`, `arm64`).
*   `os.cpus()` - Returns information about each logical CPU core.
*   `os.freemem()` / `os.totalmem()` - Returns free / total system memory in bytes.
*   `os.homedir()` - Returns the path of the current user's home directory.
*   `os.uptime()` - Returns system uptime in seconds.

### Code Example (System Health Dashboard):
```javascript
const os = require('os');

function getSystemReport() {
  const bytesToGb = (bytes) => (bytes / (1024 ** 3)).toFixed(2);
  
  console.log('=== SYSTEM REPORT ===');
  console.log(`OS Platform:     ${os.platform()} (${os.arch()})`);
  console.log(`System Uptime:   ${(os.uptime() / 3600).toFixed(2)} hours`);
  console.log(`CPU Model:       ${os.cpus()[0].model}`);
  console.log(`CPU Cores:       ${os.cpus().length}`);
  console.log(`Total Memory:    ${bytesToGb(os.totalmem())} GB`);
  console.log(`Free Memory:     ${bytesToGb(os.freemem())} GB`);
  console.log(`User Home:       ${os.homedir()}`);
  console.log('====================');
}

getSystemReport();
```
