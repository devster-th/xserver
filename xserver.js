// head note ////////////////////////////////////////////////////
/*
this is the simpleApp main file = /simpleApp/simpra.js
expressjs v4.18.1
this file can finally named deeji.js , the main or core module
changed name to 'simpra.js' -- 2022-10-2
changed name to deeji.js -- 2022-10-12
*/


//1) initialize --------------------------------------------

global._xserver = {
  appName:  "xserver",
  version:  "0.1",
  startTime: Date.now(),
  domain:   "localhost",
  port:     2000,
  operator: '@deeji.co',
  security:{
    salt: 'Ac+G_^;axLHq',
    serverid:'35af4272-c5c2-48c7-8a37-6ed1a703a3f6',
    key: 'c40b93b2dfb61810e5ad22d132de54b7e718d10f66a8f523379826de95dbadf1'
  }
}
    


//load modules
const express = require("express")
const { W } = require("./module/xdev/xdev.js")
const app     = express()
global.core   = require("./core.js")
global.xdev   = require('./module/xdev/xdev.js')
global.sales = require('./module/sales/sales.js')


//setting
app.use(express.static("webSite"))
app.use(express.json())

//else
//_xserver.serverid = xdev.random()



// data model







//2) GET works ----------------------------------------
/**
 * open/insecured msg handling mainly used for static & web pages not private data.
 */

app.get("/get_", (req,resp)=>{

  //A) works on the input mainly for certifying msg
  console.log('//--------------------------------------')
  console.log('//@xserver: received GET message:')
  console.log(req.ip)
  console.log(req.method)
  console.log(req.query)

  let getMsg = req.query //put a name to prevent confuse
  getMsg.method = 'get'

  if (!getMsg.id) getMsg.id = Date.now() + '-' + xdev.randomInt()
  
  //B) pass msg to specified module
  core.$(getMsg).then(re => {
    
    //C) return something back to caller/browser
    console.log('\n//@xserver: response from @core is: ', re)
    resp.send(re)


  })


  /**
   * haven't do things much so far. The GET will mainly use for static & open web pages, contents.
   */

})



//3 POST works -----------------------------------
/**
 * secured msg handling
 * POST will be main channel for all communications in the app
 */

app.post("/post_", (req,resp)=> {
    //console.log(req)
    //console.log(req.method)
    //console.log(req.body)

    //A) certifying msg
    console.log('//---------------------------------------')
    console.log('\n//@xserver: received POST msg', req.body)

    let postMsg = req.body //just put name to avoid confuse

    //valid check
    if (!postMsg.cert || !postMsg.id || !postMsg.to || !postMsg.from || !postMsg.msg || !postMsg.time) {

      console.log('invalid message')
      return resp.json({msg:'invalid message'})
    } 


    let cert_ = postMsg.cert //take out first
    postMsg.cert = '' //empty the cert then verify the rest

    //certifying the msg
    xdev.$({  xcert: JSON.stringify(postMsg), 
              key:   _xserver.security.salt, 
              sig:   cert_
          })

    .then(resul => {

      //if false stop the processing
      if (!resul) return resp.json({msg:'msg is not certified'})

      postMsg.verified = resul
      postMsg.cert = cert_ //if certified put the cert back
      postMsg.method = 'post'

      //B) pass msg to module
      core.$(postMsg).then(re => {

        console.log(
          '\n//@xserver: got this back from @core \n', 
          re
        )


        //C) return msg to browser
        let wrap = new xdev.Wrap

        wrap.to = postMsg.from
        wrap.from = _xserver.security.serverid
        wrap.subj = 'response'
        wrap.ref = postMsg.id
        wrap.msg = re
        wrap.note = 'OK'
        wrap.confidential = 'module only'

        //cert
        xdev.$({
          xcert: JSON.stringify(wrap), 
          key:   _xserver.security.salt
        })
        
        .then(cert => {
          wrap.cert = cert 
          
          console.log(
            '\n//@xserver: respond this back to browser:'
          )
          console.log(wrap)
          
          //send back to browser
          resp.json(wrap)
        })


      }) //core
    }) //.then

/*    xdev.sha256(
      JSON.stringify(req.body) + _xserver.security.salt
    ).then(ver => {
      req.body.verified = cert==ver? true : false
*/
})




// 4 - listen /////////////////////////////////////////////////
app.listen(_xserver.port, () => {
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
  })


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