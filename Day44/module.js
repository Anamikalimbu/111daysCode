// Modules
// Modules - Encapsulated Code (only share minimum)
// CommonJS, every file is module (by default)
// Modules - Encapsulated Code (only share minimum) 


const names = require('./02')
const sayHI = require('./03')
// console.log(names)
const data  = require('./04')
console.log(data)

sayHI('Anamika')
sayHI(names.Anu)
sayHI(names.Smriti)