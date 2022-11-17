// keyGen.js

const keypair   = require("keypair")
const fs        = require("fs")
const keys = keypair()

fs.writeFile("public.key",keys.public, (error)=>{
    if (error) throw error 
})
fs.writeFile("private.key",keys.private, (error)=> {
    if (error) throw error
})
console.log(keys)


/* NOTE
The object keys has 2 properties
  keys.public
  keys.private

so we can save to files if we need.
everything works.

before using, install by .... $ npm install keypair


*/