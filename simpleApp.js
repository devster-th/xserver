// head note ////////////////////////////////////////////////////////////

// this is the simpleApp main file = /simpleApp/simpleApp.js
// expressjs v4.18.1
// this file can finally named deeji.js , the main or core module

// 1 - init ////////////////////////////////////////////////////////////

global._server = {
                appName: "simpleApp",
                version: "1.0",
                startTime: new Date(),
                domain: "localhost",
                port: 2000,
                mongoUrl: "mongodb://localhost:27017/",
                codeGen: {lastXuid: 0, prefix:"deeji-"}
            }
    
//load module
const express   = require("express")
const app       = express()
const mongo     = require("mongodb").MongoClient 
const crypto    = require("crypto")
const uuid      = require("uuid")
const _x        = require("./module/xdev.js")


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

app.get("/get", (req,resp)=>{
    console.log(req.method)
    console.log(req.query)
    
    if (req.query.request != "" 
        && /^\/\/.+\/\/$/.test(req.query.request)) {
        //gen a code
        /*
        let approvCode = Date.now()
        let approvText = 
            req.query.request.replace(/\/\/$/,
                `/deeji-${approvCode}//`)  
        console.log(approvText)
        */
        resp.send(  `<p>Your request is:<br>
                    ${req.query.request}</p>`)

        //in real mode we send command to xdev
        // _x.do({act:"...", data})
        //so we invent new language for the Get, e.g.,
        //.... //----/----/-----//
        //the language starts with // and end with // with commands in between
        //like: //send/3000$dm/to@john/from@dad//
        //we make this because it will be easiest for typical user to 
        //put in the browser bar or in an input box.
        //the Get may accept 2 languages, the easyLang & objectLang

    } else {
        resp.send("you put wrong command, try again...")
    }//-----------------------------------------------------------

    //all Get-job comes here
})



// 3 - Post works ///////////////////////////////////////////////////////
app.post("/post", (req,resp)=> {
    //console.log(req)
    console.log(req.method)
    console.log(req.body)
    if (req.body.act !="" && req.body.data !="") { //validate input
        let svResp = {  act: "reply",
                        from:"deeji",
                        note:"ok, got your message",
                        secureKey:5000,
                        data:"",
                        time: Date.now()
                    }
        //resp.send(svResp)
        resp.json(svResp)
        //console.log("svResp:")
        console.log(svResp)
    } else { //wrong input response
        let svResp = {  act:"reply",
                        from:"deeji",
                        note:"wrong command",
                        secureKey:5000,
                        data:"",
                        time: Date.now()
                    }
    }//--------------------------------------------------
   

    //all Post-job comes here
})




// 4 - listen ///////////////////////////////////////////////////////
app.listen(_server.port, ()=>{
    console.log("////////////////////////////////////////////////////////")
    console.log(`${_server.startTime} -- simpleApp , port: ${_server.port}`)
    console.log(`...This is a tiny server trying to do little things, and makes things minimal and may be used to be a model, for something bigger.
    -- @mutita 
    v1.0.0 / Sep 6, 2022
    `)
    console.log("//some test messages may follows...")
    testScript()
})



// 5 - test //////////////////////////////////////////////////////////
function testScript() {

//put all test command here
/*
    console.log("//test server:")
    _x.do({ test:"server"})
    console.log(_server)

    console.log("//test xdev")
    _x.do({test:"xdev"})

    console.log("//test mongoDb")
    _x.do({test:"mongoDb"})

    

    console.log("//test encrypt the word='yo!' :")
    _x.do({ encrypt:"yo!"})

    console.log("//test decrypt to get the word='yo!' back:")
    _x.do({ decrypt:"7061e86aa2e055ae8f480837fe6095ab"})
    
    console.log("//test hash the word='deeji' to sha256:")
    _x.do({ hash:"deeji", algorithm:"sha256", digest:"hex"})

    console.log("//hash 'deeji' to md5 :")
    _x.do({ hash:"deeji", algorithm:"md5", digest:"hex"})

    console.log("//gen some of the UUID/random :")
    _x.do({ generate:"uuid", type:"random"})
    _x.do({ generate:"uuid", type:"random"})
    _x.do({ generate:"uuid", type:"random"})

    console.log("//UUID/timestamp")
    _x.do({ generate:"uuid", type:"timestamp"})
    _x.do({ generate:"uuid", type:"timestamp"})
    _x.do({ generate:"uuid", type:"timestamp"})

    console.log("//XUID test")
    _x.do({ generate:"xuid", qty:10, output:"console"})
    
        
    //test xdb
    console.log("//test xdb")
    //xdb.do({test:"xdb"})
    //xdb.do({find:"*",in:"people"})

    xdb.do({  create: "people goods order"    }) 

    xdb.do({  add:[
                    {name:"dad", age:54, sex:"male"},
                    {name:"mom", age:53, sex:"female"},
                    {name:"john", age:22, sex:"male"},
                    {name:"jane", age:18, sex:"female"},
                    {name:"biden", age:54, sex:"male"},
                    {name:"putin", age:53, sex:"female"},
                    {name:"trudo", age:22, sex:"male"},
                    {name:"jamica", age:18, sex:"female"}

                ], // {name:"dad", age:54, sex:"male"},
            in:"people" 
        })

    xdb.do({  add:[
                {name:"noodle",price:525, stock:5265},
                {name:"coffee",price:5454, stock:8451},
                {name:"rice",price:452, stock:256},
                {name:"phone",price:4548, stock:62145},
                {name:"table",price:547, stock:1258}
            ],
        in:"goods"
    })

    xdb.do({  add:[
                {num:"s100",goods:"noodle",price:5000, date:"2022-09-01"},
                {num:"s200",goods:"steak",price:10000, date:"2022-09-02"},
                {num:"s526",goods:"coffee",price:300000, date:"2022-09-05"},
                {num:"s562",goods:"phone",price:1000000, date:"2022-09-15"},
                {num:"s600",goods:"table",price:30000, date:"2022-09-20"}
            ],
        in:"order"
    })

    xdb.do({show:"status"})
    xdb.do({show:"entireDb"}) 
    xdb.do({find:{price:">1000"},in:"goods"})
    xdb.do({test:"xdb"})
    xdb.do({ find:{name:"j"},in:"people" })
*/

    _x.dev({ act:"readFile",fileName:"xdb.json",convert:"toObject"})
    
}




/* 6 - tail note /////////////////////////////////////////////////////
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


*/