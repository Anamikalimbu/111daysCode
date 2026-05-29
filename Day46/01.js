const express = require('express')
const app = express()
const path = require('path')    
const port = 3000

// const anamikaMiddleware = (req, res, next) => {
//     console.log(req)
//     next()
// }
app.get('/hello/:name', (req, res) => {
  res.send(`Hello World!, ${req.params.name}!`)
})
app.use(express.static(path.join(__dirname, 'public')))
// app.use(anamikaMiddleware)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})