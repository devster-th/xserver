/**
 * xserver is a framework to dev software.
 * Version: 0.1
 * Web:''
 * Date: 2023-06-13
 * Contact: mutita.org@gmail.com
 * License: none
 */





//1) initialize/config -----------------------------------------


    


//load modules
const express = require("express")
//const { W } = require("./module/xdev/xdev.js")
const app     = express()
//global.core   = require("./core.js")
const XS = require('./module/xdev/xdev2.js')
//global.model = require('./module/xdev/xDataModel.js')
//global.sales = require('./module/sales/sales.js')
const XD = require('./module/xdev/xmongo2.js')
const XF = require('./module/xdev/xfile2.js')
const XC = require('./module/xdev/xcrypto2.js')

global.XSERVER = {
  appName:  "xserver",
  version:  "0.1",
  startTime: Date.now(),
  domain:   "localhost",
  port:     2000,
  operator: 'mutita',
  secure:{
    defaultSalt: "#|~}v4&u&1R",
    serverId: XS.uuid(),
    masterKey: 'c40b93b2dfb61810e5ad22d132de54b7e718d10f66a8f523379826de95dbadf1'
  },
  xRootPath:'/home/mutita/dev/xserver/', //root of xserver
  xsModulePath:'module/',
  websitePath:'website/',
  xbrowserPath:'xbrowser/', //put after websitePath 
  xbrowserModulePath:'module/', //put after xbrowserPath
  xbrowserDocPath:'doc/' //after xbrowserModulePath
}

//console.log(XSERVER.secure.serverId)
//XD.$({find:'',from:'user'}).then(console.log)



//setting
app.use(express.static("website"))
app.use(express.json())

//else
//_xserver.serverid = xdev.random()



// data model
//core.id = xs.uuid()






//2) GET works ----------------------------------------
/**
 * open/insecured msg handling mainly used for static & web pages not private data.
 */

app.get("/reqs", (req,resp)=>{

  //A) works on the input mainly for certifying msg
  console.log('//--------------------------------------')
  console.log('//@xserver: received GET message at ', new Date().toISOString() )
  console.log(req.ip)
  //console.log(req.method)
  console.log(req.query)

  let getMsg = req.query //put a name to prevent confuse
  //getMsg.method = 'get'

  /*  browser can embed xs command like this:
        
        _xs:"{getFrom:'generalNote'}" or _xs:"{setTo:....}"

      so this get channel will detect it and convert to xs command then pass to xs.$(...)
  */

  //keep log 
  /*xs.$({
    set:{
      msg:     getMsg,
      channel: '/xget',
      type:    'input'
    },
    to: 'actionLog'
  })*/


  //work on embedded getFrom, setTo
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


        //work on this block to display in html
        console.log(re)


        //console.log(outputHtml)
        let htmlOutput = xs.x2html(re)

        if (htmlOutput.success == false) {
          resp.send('<h1>Not found.</h1>')
        } else {
          resp.send( htmlOutput )
        }

      }) //then
    
    } else {
      //other embedded command of _xs, for future, now return false first
      resp.send(false)
    }

  } else {
    //not embedded command of _xs
    resp.send(false)
  }


}) //xget block



//3 POST works -----------------------------------
/**
 * secured msg handling
 * POST will be main channel for all communications in the app
 * Takes only JSON data
 */

app.post("/xserver", (req,resp)=> {

  //A) certifying msg
  console.log('\n--POST packet, ', new Date().toISOString() )
  console.log('--reqs packet = ', req.body)
  console.log('--reqs ip = ', req.ip ,'\n')

  //got a packet
  let packet = req.body //just put name to avoid confuse

  //log
  XD.$(
    { add: {packet: packet}, to: 'xdb.log'  }
  )


  //check cert
  if (packet.active) { 
    //session already active

    let rePacket = new XS.Packet
    rePacket.from = XSERVER.secure.serverId
    rePacket.to = packet.from
    rePacket.active = true

    rePacket.msg = JSON.stringify({
      msg:"We haven't done for active state yet."
    }) //future wrap this

    XS.cert(rePacket).then(() => {

      //log
      XD.$(
        { add: {packet: rePacket}, to:'xdb.log' }
      )

      resp.json(rePacket)
    })






  
  } else {
    //session not active, needs to register session

    //check cert
    XS.cert(packet).then(certified => {
      //console.log('cert result', certified) //true|false

      if (certified) {
        //cert passed now unwrap the packet.msg

        XS.makeKey(packet).then(gotKey => {
          //console.log(gotKey)

          return XC.$(
            { decrypt: packet.msg, key: gotKey }
          )
        
        }).then(unwrappedMsg => {
          
          packet.msg = JSON.parse(unwrappedMsg)
          //console.log(packet)

          //check action in the packet.msg
          if (packet.msg.act == 'new_session') {

            //check xdb.session
            XD.$(
              { find: {sessionId: packet.from},
                from: 'xdb.session'  }

            ).then(found => {
              if (found == '') {
                //sessionId not already existed, good to go
                let salt = XS.password()
                
                //register new session
                XD.$(
                  { add: 
                      {
                        sessionId:  packet.from,
                        salt:       salt,
                        active:     true    
                      },
                    to: 'xdb.session'
                  }
                )

                //response
                let rePacket    = new XS.Packet
                rePacket.from   = XSERVER.secure.serverId
                rePacket.to     = packet.from
                rePacket.active = true

                rePacket.msg = {
                  act:                  'response_to_new_session_request',
                  refPacketId:          packet.id,
                  registrationApproved: true,
                  yourNewSalt:          salt, 
                }
                
                XS.makeKey(rePacket).then(gotKey => {
                  //console.log(gotKey)

                  //wrap msg
                  return XC.$(
                    { encrypt: JSON.stringify(rePacket.msg),
                      key: gotKey }
                  )
                
                }).then(wrap => {
                  rePacket.msg = wrap

                  //certify
                  return XS.cert(rePacket)

                }).then(() => {

                  //log
                  XD.$(
                    { add: {packet: rePacket}, to:'xdb.log' }
                  )

                  console.log('\n--response packet = ', rePacket)

                  resp.json(rePacket)
                  return

                })

                
              } else {
                //sessionId found, already exist so will reject the request

                resp.json({
                  msg:'session already existed.'
                })
              }

            })// end XD block


          } else {
            //other actions
            resp.json({
              msg:"Invalid action."
            })

          }


        })//end of XS.makeKey block
        
      } else {
        //not certified
        resp.json(
          { msg:"Packet not certified." }
        )
      }

    })//end cert block

  } //end if (packet.active)



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

