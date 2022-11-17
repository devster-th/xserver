//nodeFile.js
//test handling files

var fs = require("fs")

//read
fs.readFile("_xdb.json","utf8", (error,data)=> {
  console.log(data)
})  