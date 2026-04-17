import path from "path";
import url from "url";

const filePath = "folder1/folder2/folder3/data.json";

console.log(path.basename(filePath)); // file name
console.log(path.extname(filePath)); // extension name
console.log(path.dirname(filePath)); // folder/s name

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename);
console.log(__dirname);