# CommonJS (CJS) vs. ESModules (ESM) (Day 2)

Node.js supports two different module systems. Historically, it used CommonJS (`require()`), but modern JavaScript uses ESModules (`import`/`export`). Knowing when and how to use each is crucial.

---

## 1. Syntax Comparison

### CommonJS (CJS)
Standard module format used by Node.js for many years.
```javascript
// importing
const path = require('path');
const math = require('./math');

// exporting
module.exports = {
  add: (a, b) => a + b
};
// Or alternate syntax
exports.subtract = (a, b) => a - b;
```

### ESModules (ESM)
The official standardized module format for JavaScript (defined by ECMAScript).
```javascript
// importing
import path from 'path';
import { add, subtract } from './math.js'; // Note: extensions are mandatory in Node ESM

// exporting
export const add = (a, b) => a + b;
export default function multiply(a, b) {
  return a * b;
}
```

---

## 2. Structural Differences

| Feature | CommonJS (CJS) | ESModules (ESM) |
| :--- | :--- | :--- |
| **Primary Syntax** | `require()` / `module.exports` | `import` / `export` |
| **Loading Mode** | **Synchronous** (Dynamic, loaded at runtime) | **Asynchronous** (Static, analyzed before runtime) |
| **Top-Level Await**| Not supported (must wrap in async functions) | Supported natively |
| **Directory Scope** | Has `__dirname` and `__filename` | No `__dirname` or `__filename` (uses `import.meta.url`) |
| **Tree Shaking** | Hard to optimize (since it is dynamic) | Excellent (static analysis enables pruning dead code) |
| **Caching** | Cached after first require | Cached after first import |

---

## 3. How to Enable ESM in Node.js
By default, Node.js treats files as CommonJS. You can enable ESModules in one of two ways:

1.  **Add `"type": "module"` in `package.json`**:
    This makes Node.js interpret all `.js` files in that package directory as ESModules.
2.  **Use `.mjs` File Extension**:
    Any file ending in `.mjs` will always be treated as an ESModule, while files ending in `.cjs` will always be treated as CommonJS.

---

## 4. Re-creating `__dirname` and `__filename` in ESM
In ESModules, the utility global variables `__filename` and `__dirname` are not defined. If you need them (e.g. to resolve relative files with absolute paths), you can recreate them using the `url` module:

```javascript
import { fileURLToPath } from 'url';
import path from 'path';

// Get current filename: e.g. /Users/name/projects/app.js
const __filename = fileURLToPath(import.meta.url);

// Get current directory: e.g. /Users/name/projects
const __dirname = path.dirname(__filename);

console.log('__filename:', __filename);
console.log('__dirname:', __dirname);
```

---

## 5. Interoperability Guidelines
Mixing the two systems can sometimes be tricky:

*   **Importing CJS in ESM:** Supported. You can import CommonJS modules in an ESModule.
    ```javascript
    import fs from 'fs'; // Built-in CJS modules work fine
    import lodash from 'lodash'; // lodash (CJS) imports correctly in ESM
    ```
*   **Requiring ESM in CJS:** Not directly supported via standard `require()`. You will get an `ERR_REQUIRE_ESM` error. To load an ESM module inside a CommonJS module, you must use dynamic `import()`:
    ```javascript
    // Inside a CommonJS file
    async function loadESM() {
      const myEsmModule = await import('./math.js');
      console.log(myEsmModule.add(2, 3));
    }
    loadESM();
    ```
