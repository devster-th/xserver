/**
 * xserver is a framework to dev software.
 * Version: 0.1
 * Web:''
 * Date: 2023-06-13
 * Contact: mutita.org@gmail.com
 * License: none
 */





//1) initialize/config -----------------------------------------

global.XSERVER = {
  appName:  "xserver",
  version:  "0.1",
  startTime: Date.now(),
  domain:   "localhost",
  port:     2000,
  operator: 'mutita',
  security:{
    salt: 'Ac+G_^;axLHq',
    serverid:'35af4272-c5c2-48c7-8a37-6ed1a703a3f6',
    key: 'c40b93b2dfb61810e5ad22d132de54b7e718d10f66a8f523379826de95dbadf1'
  }
}
    


//load modules
const express = require("express")
//const { W } = require("./module/xdev/xdev.js")
const app     = express()
global.core   = require("./core.js")
global.xs   = require('./module/xdev/xdev1.js')
global.model = require('./module/xdev/xDataModel.js')
global.sales = require('./module/sales/sales.js')


//setting
app.use(express.static("website"))
app.use(express.json())

//else
//_xserver.serverid = xdev.random()



// data model
core.id = xs.uuid()






//2) GET works ----------------------------------------
/**
 * open/insecured msg handling mainly used for static & web pages not private data.
 */

app.get("/xget", (req,resp)=>{

  //A) works on the input mainly for certifying msg
  console.log('//--------------------------------------')
  console.log('//@xserver: received GET message at ', new Date().toISOString() )
  //console.log(req.ip)
  //console.log(req.method)
  console.log(req.query)

  let getMsg = req.query //put a name to prevent confuse
  //getMsg.method = 'get'

  if (getMsg._xs) {
    eval('_xs =' + getMsg._xs)
    delete getMsg._xs //before pass it to the db

    let xsKey = Object.keys(_xs)[0]

    //write mode
    if ( xsKey == 'setTo') {
      xs.$({set:getMsg, to: _xs.setTo}).then(re => {

        if (re.insertedCount) { //success
          resp.send(`<h1>Successfully save data.</h1>
          <p><b>from:</b> @xserver<br>
          <b>success:</b> true<br>
          <b>id:</b> ${re.insertedIds[0]}<br>
          <b>time:</b> ${new Date().toISOString()}</p>`)
        
        } else { //fail
          resp.send(`<h1>Fail to save data.</h1>
          <p><b>from:</b> @xserver<br>
          <b>success:</b> false<br>
          <b>id:</b> ${xs.uuid()}<br>
          <b>time:</b> ${new Date().toISOString()}`)
        }
        
      })
    
    //read mode
    } else if (xsKey == 'getFrom' && Object.keys(getMsg)[0] == 'search') {

      xs.$({
        get:'',from: _xs.getFrom, 
        filter: {$text:{$search: getMsg.search }}

      }).then(re => {
//---will replace this block        
/*        if (typeof re == 'object') re = JSON.stringify(re)
        resp.send(`<p style="font-size:large">${re}</p>`) */

//--- block #2306220917m

        //work on this block to display in html
        console.log(re)
/*        
        let outputHtml = ''

        if (Array.isArray(re)) {

          if (re == '') return resp.send('<h1>Not found.</h1>')

          //each doc has <p> with the <br> to break each data
          re.forEach(doc => {
            outputHtml += '<p>'
            let key = Object.keys(doc) 

            key.forEach(k => {
              outputHtml += '<b>' + k + ':</b> ' + doc[k] + '<br>'
            })

            outputHtml += '</p>'

          })

        } else if (typeof re == 'object') {
          //the re is obj, containing only 1 doc
          outputHtml += '<p>'
          let key = Object.keys(re) 

          key.forEach(k => {
            outputHtml += '<b>' + k + ':</b> ' + re[k] + '<br>'
          })

          outputHtml += '</p>'

        } else {
          //out of scope
          outputHtml = '<h1>Something wrong.</h1>'
        }
*/

        //console.log(outputHtml)
        let htmlOutput = xs.x2html(re)

        if (htmlOutput.success == false) {
          resp.send('<h1>Not found.</h1>')
        } else {
          resp.send( htmlOutput )
        }
//---

      }) //then
    }
  }


/*  
  if (!getMsg.id) getMsg.id = Date.now() + '-' + xs.randomInt()
  
  //B) pass msg to specified module
  core.$(getMsg).then(re => {
    
    //C) return something back to caller/browser
    console.log('\n//@xserver: response from @core is: ', re)
    resp.send(re)


  })
*/

  /**
   * haven't do things much so far. The GET will mainly use for static & open web pages, contents.
   */

})



//3 POST works -----------------------------------
/**
 * secured msg handling
 * POST will be main channel for all communications in the app
 * Takes only JSON data
 */

app.post("/xpost", (req,resp)=> {
  //console.log(req)
  //console.log(req.method)
  //console.log(req.body)

  //A) certifying msg
  console.log('//---------------------------------------')
  console.log('//@xserver: received POST msg at ', new Date().toISOString() )
  console.log(req.body)

  let postMsg = req.body //just put name to avoid confuse

//working on new block    

  if (postMsg.wrap) {
    //this is wrapped msg (encrypted one)
    // {wrap:'--base64 encrypted text--'}

    //unwrap
    xs.$({
      decrypt: postMsg.wrap,
      key: XSERVER.security.key
    
    }).then(re => {
      console.log(re)

      let xsCommand = JSON.parse(re)
      console.log(xsCommand)

//working in this block

      xs.$(xsCommand).then(re => {
        console.log(re)

        if (xsCommand.set) {
          let msg = new model.ServerResponse

          if (re.insertedCount) {
            msg.msg = "Successfully save the data."
            msg.success = true
            msg.id = re.insertedIds[0]

            xs.wrap(msg).then(wrap => {
              console.log(wrap)
              resp.json(wrap)
            })
            
  
          } else {
            msg.msg = "Fail to save the data."
            msg.success = false
            msg.id = xs.uuid()

            xs.wrap(msg).then(wrap => {
              console.log(wrap)
              resp.json(wrap)
            })
            
          }
        
        } else if (xsCommand.get) {
          console.log('this is get results')

          xs.wrap(re).then(wrap => {
            console.log(wrap)
            resp.json(wrap)
          })
          
        }
        
      })



/*      
      eval('_xs = ' + obj._xs)
      console.log(_xs)
      delete obj._xs

      let xsKey = Object.keys(_xs)[0]

      if (xsKey == 'setTo') {
        //this is set command
        xs.$({set:obj, to: _xs.setTo}).then(re => {

          console.log(re)

          //response back to caller
          if (re.insertedCount) { //success

            let respMsg = {
              from: '@xserver',
              success: true,
              msg:'Successfully save data.',
              id: re.insertedIds[0],
              time: new Date().toISOString()
            }
            console.log(respMsg)
            resp.json(respMsg)

          } else { //fail

            let respMsg = { 
              from: '@xserver',
              success: false,
              msg:'Fail to save data.',
              id: xs.uuid(),
              time: new Date().toISOString()   
            }
            console.log(respMsg)
            resp.json(respMsg)
          } 

        })
      }
*/      
    })
  

  } else {
    //not wrapped data

    let msg = new model.ServerResponse
    
    msg.msg = "Rejected, unrecognized command."
    msg.success = false 
    msg.id = xs.uuid()

    resp.json(msg)
  }





// below is old block
/*    
    //valid check
    if (!postMsg.cert || !postMsg.id || !postMsg.to || !postMsg.from || !postMsg.msg || !postMsg.time) {

      console.log('invalid message')
      return resp.json({msg:'invalid message'})
    } 


    let cert_ = postMsg.cert //take out first
    postMsg.cert = '' //empty the cert then verify the rest

    //certifying the msg
    xs.$({  xcert: JSON.stringify(postMsg), 
              key:   XSERVER.security.salt, 
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
        let wrap = new xs.Wrap

        wrap.to = postMsg.from
        wrap.from = re.from // _xserver.security.serverid
        wrap.subj = 'response'
        wrap.ref = postMsg.id
        wrap.msg = re.msg
        wrap.note = 'OK'
        wrap.confidential = 'module only'

        //cert
        xs.$({
          xcert: JSON.stringify(wrap), 
          key:   XSERVER.security.salt
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
*/    

/*    xdev.sha256(
      JSON.stringify(req.body) + _xserver.security.salt
    ).then(ver => {
      req.body.verified = cert==ver? true : false
*/
}) //end app.post()




// 4 - listen /////////////////////////////////////////////////
app.listen(XSERVER.port, () => {
  console.log("//////////////////////////////////////////////////////////////////////")
  console.log(
`@${XSERVER.appName} starts at http://localhost:${XSERVER.port} , ${new Date().toISOString()}`
  )

  console.log('A little thing that trying to solve bigger things.')
  console.log("@xserver is ready...\n")
  
  //testScript()
  //console.log('@core id: ', core.id )
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

  let key = xs.random()
  let salt = xs.random()
  console.log('key: '+key, '\nsalt: '+salt)

  let seal = xs.$({encrypt:msg,userKey:key, salt:salt}).then(seal => {
    console.log(seal)

    xs.$({decrypt:seal.cipherText, secureKey:seal.key, iv:seal.iv}).then( text => console.log(text))
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

/**
 * Devnote
 * 
 * Changed global var from _xserver to XSERVER
 * Changed get path from /get_ to /xget
 * Changed post path from /post_ to /xport
 * m20230613
 * 
 * 
 */