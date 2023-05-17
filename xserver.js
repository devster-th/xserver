// head note ////////////////////////////////////////////////////
/*
this is the simpleApp main file = /simpleApp/simpra.js
expressjs v4.18.1
this file can finally named deeji.js , the main or core module
changed name to 'simpra.js' -- 2022-10-2
changed name to deeji.js -- 2022-10-12
*/


// 1 - init ////////////////////////////////////////////////////

global._xserver = {
  appName:  "xserver",
  version:  "0.1",
  startTime: Date.now(),
  domain:   "localhost",
  port:     2000,
  security:{
    salt: 'mutita',
    serverid:'',
    key: 'c40b93b2dfb61810e5ad22d132de54b7e718d10f66a8f523379826de95dbadf1'
  }
}
    
//load module
const express = require("express")
const app     = express()
global.core   = require("./core.js")
global.xdev   = require('./module/xdev/xdev.js')
global.sales = require('./module/sales/sales.js')


//setting
app.use(express.static("webSite"))
app.use(express.json())

//else
_xserver.serverid = xdev.random()




// 2 - Get works ///////////////////////////////////////////////
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
    core.$(req.query, 'get')

    //for testing just return something to B
    resp.send("@xserver : received data at " + Date() )


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

    //1) verifying the msg here: check if the 'cert' correct
    console.log('\n//xserver(), msg from caller:', req.body)
    let cert = req.body.cert
    delete req.body.cert
    
    let ver = xdev.sha256(
      JSON.stringify(req.body) + _xserver.security.salt
    )
    
    console.log(
      `\n//xserver(), ver result: ${cert==ver? true : false}`
    )

    //2) after verify the msg , xserver() may return a response
    let wrap = {
      from:'xserver()',
      msg:'OK, your msg is verified and being computed.',
      time: Date.now()
    }

    wrap.cert = xdev.sha256(
      JSON.stringify(wrap) + _xserver.security.salt
    )

    console.log(
      '\n//xserver(), respond this back to caller:',
      wrap
    )
    
    resp.json(wrap)



    //3) pass input to core()
    core.$(
      { id: req.body.id,
        from: req.body.from,
        for: req.body.for,
        seal: req.body.seal }, //req.body,
      //'post'
    ).then( moduleRe => {
      //the module responses to the request here

      console.log(
        '\n//xserver(), this is reply from core():\n',
        moduleRe
      )
      //resp.json(re) this is msg from core()
    })

    //just send message 'thank you' for now
    //resp.json({ msg:"@xserver : received data at " + Date() })

})




// 4 - listen /////////////////////////////////////////////////
app.listen(_xserver.port, ()=>{
    console.log("//////////////////////////////////////////////////////////////////////")
    console.log(
`@${_xserver.appName} starts at http://localhost:${_xserver.port}
${new Date()}\n`
    )

    console.log('Brief: This is a tiny server trying to do little things, and makes things minimal and may be used to be a model, for something bigger. \n-- @mutita v0.2 / Sep 30, 2022\n')
    
    console.log("@xserver is ready...\n")
    
    //testScript()
    
})



// 5 - child functions ///////////////////////////////////////

function xrespond(m) {
  //this for xserver() to respond to all request; must use this f all the time

  
}



// 6 - test //////////////////////////////////////////////////
function testScript() {

//put all test command here

let msg = JSON.stringify(
  {name:'mutita',ag:55,sex:'male'}
) 
let key = xdev.random()
let salt = xdev.random()
console.log('key: '+key, '\nsalt: '+salt)
let seal = xdev.$({encrypt:msg,userKey:key, salt:salt}).then(seal => {
  console.log(seal)

  xdev.$({decrypt:seal.cipherText, secureKey:seal.key, iv:seal.iv}).then( text => console.log(text))
} 


)




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


2023-4-21   M/xserver.js directly comms with core.js and handles mainly traffice, web site, web files. For app level just pass to core.js.

*/