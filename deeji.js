// head note ////////////////////////////////////////////////////////////
/*
this is the simpleApp main file = /simpleApp/simpra.js
expressjs v4.18.1
this file can finally named deeji.js , the main or core module
changed name to 'simpra.js' -- 2022-10-2
changed name to deeji.js -- 2022-10-12
*/


// 1 - init ////////////////////////////////////////////////////////////

global._server = {
                appName: "simpleApp",
                version: "1.0",
                startTime: new Date(),
                domain: "localhost",
                port: 2000,
                mongoUrl: "mongodb://localhost:27017/",
                //codeGen: {lastXuid: 0, prefix:"deeji-"}
            }
    
//load module
const express   = require("express")
const app       = express()
//const mongo     = require("mongodb").MongoClient 
//const crypto    = require("crypto")
//const uuid      = require("uuid")
const core = require("./core.js")
//const xdev = require("./module/xev.js")
//const xdb = require("./module/xdb.js")

//setting
app.use(express.static("webSite"))
app.use(express.json())
//let mongoUrl = "mongodb://localhost:27017/"





// 2 - Get works ///////////////////////////////////////////////////////
/*                  THE TALKING PART
The server talks to external via GET & POST here and then send 'command' to the xDev which will do detail works.
*/
//handling requests
//the app has only 1 GET and 1 POST

app.get("/get_", (req,resp)=>{
    //log_(req.ip)
    //console.log(req.method)
    //console.log(req.query)
    
    

    //pass to cor.e(method,inputData)
    //most of work will be done in the core module
    core.run(req.query, 'get')

    //for testing just return something to B
    resp.send("@deeji : received data at " + Date() )


})//mostly work
/* when key xdev command like: {act:"generate",code:"xuid"} returns output to browser = good,
But when do {act:"find xdb",...} return blank on browser, but the server console got output

this generally OK, because just test, will need to work more on real stuff afterward.
*/



// 3 - Post works ///////////////////////////////////////////////////////
app.post("/post_", (req,resp)=> {
    //console.log(req)
    //console.log(req.method)
    //console.log(req.body)

    

    //pass input to cor.e(method,inputData)
    core.run(req.body, 'post')

    //just send message 'thank you' for now
    resp.json({ note:"@deeji : received data at " + Date() })

})




// 4 - listen ///////////////////////////////////////////////////////
app.listen(_server.port, ()=>{
    console.log("////////////////// S I M P R A //////////////////")
    console.log(`${_server.startTime} -- simpleApp , port: ${_server.port}`)
    console.log(`...This is a tiny server trying to do little things, and makes things minimal and may be used to be a model, for something bigger.
    -- @mutita 
    v0.2 / Sep 30, 2022
    `)
    console.log("@deeji is ready...")
    //cor.e()
    testScript()
})



// 5 - child functions ////////////////////////////////////////////////////
function log_(x) {
  console.log(x)
}

function convertToX(input_) {//input_ is string
  return eval("obj =" + input_)
}


// 6 - test //////////////////////////////////////////////////////////
function testScript() {

//put all test command here


  /*
  xde.v({ act:"find mongo", data:{}, 
            dbName:"test100", collecName:"people"})

  //xde.v({act:"find xdb", data:{price:">500"}, in:"goods"})
  xde.v({ act:"edit xdb", find:{name:"noodle"}, 
          edit:{review:"best one"}, in:"goods"    })

  xde.v({ act:"find xdb", data:"*", in:"goods" })
  */              

  //xde.v({act:"read file", fileName:"xdb.json", convert:"toObject"})

  //xd.b({find:"*",in:"people"})
  core.run("test")
}




/* 7 - tail note /////////////////////////////////////////////////////
devper = @mutita

6/9/2022 - created this file: /simpleApp/server.js
12.24 - now handle get, post, file at min level
        put express.json() to use so can handle post, seeing req.body now
13.02 - installed & tested mongodb done, v5.0.11

7/9/2022 - put module 'crypto' , test ok since yesterday
        today test hash ok



        -installed uuid, nanoid got errors not match version, but the 'uuid' still work

        uuid.v1() gen timestamp the same # if we call consecutively so mayne not good for the XUID

        *XUID = nexgen UID that it is unique along the time + another idea that we can know which one is before/behide. This is the idea.


2022-09-26  move all child functions to xdev.js
            included xdev.js , xdb.js
2022-09-27  moved test commands to testScript() and start it at section #4            
            move in test script for xdb 

            ! after run simpleApp.js xdb not show the data, and json file
            contains little of size.

2022-9-29   now the index.html receives input and translates to xLang then run, ok

2022-9-30   changed paths to '/get_', '/post_' to avoid conflict of html pages

2023-2-20   M/touch little

*/