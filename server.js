// this is the simpleApp main file = /simpleApp/server.js

//init
const SEVR = {
                startTime: new Date(),
                port: 3000
            }
    
//load module
const express   = require("express")
const app       = express()


//setting
app.use(express.static("webSite"))


//handling requests
app.get("/xx", (request,response)=>{
    response.send("Yo!, got a GET request")
})

app.post("/zz", (request,response)=> {
    response.send("Yo!, got a POST request")
})





//listen
app.listen(SEVR.port, ()=>{
    console.log("////////////////////////////////////////////////////////")
    console.log(`${SEVR.startTime} -- simpleApp , port: ${SEVR.port}`)
    console.log(`...This is a tiny server trying to do little things, and makes things minimal and may be used to be a model, for something bigger.
    -- @mutita 
    v1.0.0 / Sep 6, 2022
    `)
})

/*-------- NOTE -----------
6/9/2022 - created this file: /simpleApp/server.js






*/