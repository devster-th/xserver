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
//const mongo     = require("mongodb").MongoClient 
//const crypto    = require("crypto")
//const uuid      = require("uuid")
const xde = require("./module/xdev.js")


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
    console.log(req.method)
    console.log(req.query)
    
    //this part is the new language, may be called... the slashLang 
    /* style is... //aaaaa/bbbbb/cccc/dddd//  ...............*/
/*
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
       /*
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
*/
    //all Get-job comes here

    //test to let user put xdev lang via the Get
    resp.redirect("/")
    /* this block works
    let getinput = JSON.parse(req.query.request) 
    log_(getinput)
    xde.v(getinput) //work now, the input must be json format
    */
    //if want user to easily type on the url bar, we should have some prep on
    //input data

    //try let user just fill in xLang, like: .... '{act:"read file",...}' 
    //log_(req.query.request)
    //log_(typeof req.query.request)
    //eval("convToObj =" + req.query.request) //this line works
    //log_(convToObj)
    //log_(typeof convToObj)
    //let xLang = convertToX(req.query.request)
    //log_(/^\{act\:.*\}$/.test(req.query.request))
    if (typeof req.query.request !="undefined" 
            && /^\{act\:.*\}$/.test(req.query.request) ) {
      let xLang = xde.v({act:"convert to xLang", input:req.query.request})
      //log_(xLang) 
      xde.v(xLang) //work now
    }//work, only '{act:...}' will pass the if screening
    

})



// 3 - Post works ///////////////////////////////////////////////////////
app.post("/post_", (req,resp)=> {
    //console.log(req)
    console.log(req.method)
    console.log(req.body)
    if (req.body.act !="" && req.body.data !="") { //validate input
        let svResp = {  act: "reply",
                        from:"deeji",
                        note:"ok, got your message",
                        secureKey:5000,
                        data:"",
                        time: Date.now(),
                        transacid:"" //id of this transac
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
    console.log("////////////////// S I M P L E   A P P //////////////////")
    console.log(`${_server.startTime} -- simpleApp , port: ${_server.port}`)
    console.log(`...This is a tiny server trying to do little things, and makes things minimal and may be used to be a model, for something bigger.
    -- @mutita 
    v0.2 / Sep 30, 2022
    `)
    console.log("//ready...")
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



*/