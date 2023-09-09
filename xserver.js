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
const app   = express()
const XS    = require('./module/xdev/xdev2.js')
const XD    = require('./module/xdev/xmongo2.js')
const XF    = require('./module/xdev/xfile2.js')
const XC    = require('./module/xdev/xcrypto2.js')
const core  = require('./module/core/core.js')
const sales = require('./module/sales/sales.js')
//global.model = require('./module/xdev/xDataModel.js')




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

  resp.send("<h1>Still don't do the GET work. Comeback later, sorry :'(</h1>")


}) //xget block



//3 POST works -----------------------------------
/**
 * secured msg handling
 * POST will be main channel for all communications in the app
 * Takes only JSON data
 */

app.post("/xserver", (req,resp)=> {

  //A) certifying msg
  console.log('-----------------------------------------------------')
  console.log('--POST packet, ', new Date().toISOString() )
  console.log('--reqs packet = ', req.body)
  console.log('--reqs ip = ', req.ip ,'\n')

  //got a packet
  let packet = req.body //just put name to avoid confuse

  //log
  XD.$(
    { add: {packet: packet}, to: 'xdb.log'  }
  )


  // ACTIVE ---------------------------------------------------
  //check if the session active or not
  if (packet.active) { 
    //session already active

    //check xdb
    XD.$(
      { find: { sessionId: packet.from },
        from: 'xdb.session'
      }
    
    ).then(found => {
      if (found.length == 1 ) found = found[0]

      if (found.active) {
        //in the xdb.session also active so the session is good to work with

        XS.cert(packet, found.salt).then(certified => {
          if (certified) {

            //packet is certified, now unwrap the packet.msg
            XS.makeKey(packet, found.salt).then(gotKey => {

              //unwrap packet.msg
              return XC.$(
                { decrypt:  packet.msg,
                  key:      gotKey
                }
              )
            
            }).then(unwrappedMsg => {
              packet.msg = JSON.parse(unwrappedMsg)
              console.log(packet.msg)

              if (packet.msg.module) {
                //this is action for a module
                /*
                  like 
                    { act: 'order', 
                      docNum: 'xxx', 
                      module: 'sales' } 
                */

                //run the module
                //like sales.$({..input..})
                try {

                  let module = eval(packet.msg.module)
                  console.log(module)         

                  module.$(packet.msg).then(result => {
                    //this is resp from the module
                    console.log(result)

                    //prep packet to send to XB
                    return XS.prepPacket(result, found)
                    
                  }).then(rePacket => {
                      console.log(rePacket)

                      //log
                      XD.$(
                        { add:  rePacket,
                          to:   'xdb.log' }
                      )

                      //send back to XB
                      resp.json(rePacket)
                  
                  }).catch(error => {
                    console.log(error)
                  })

                } catch {
                  console.log('module error')
                }
                


              } else {
                //not for module but for the xserver
                //like {act: 'log_in', input:{...} }
                // this for the core.js works

                console.log('if no module specified, regards it as for core module')

                packet.msg.sessionId = packet.from

                core.$(packet.msg).then(re => {
                  console.log('return from core: ', re)

                  if (!re) re = {
                    module: 'core',
                    msg:    'none'
                  }
                  return XS.prepPacket(re, found)
                
                }).then(rePacket => {
                  console.log(rePacket)

                  //log
                  XD.$(
                    { add:  rePacket,
                      to:   'xdb.log' }
                  )

                  //send back to XB
                  resp.json(rePacket)

                }).catch(error => {
                  console.log(error)
                })

                //should run by: XS.$( <<msg>> )
              }
            })
            
            

          } else {
            //packet not certified, will reject
            console.log('packet not certified')

          }
        })

      } else {
        //the session is expired
        console.log('session expired')

      }

    })

/*
    // response
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
*/





  
  } else {
    //  INACTIVE ----------------------------------------
    //session not active, needs to register session

    //check cert
    XS.cert(packet).then(certified => {
      //console.log('cert result', certified) //true|false

      if (certified) {
        //cert passed now unwrap the packet.msg

        XS.makeKey(packet).then(gotKey => {
          //console.log(gotKey)

          return XC.$(
            { decrypt:  packet.msg, 
              key:      gotKey }
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
                  act: 'response',
                  msg: 'Your new session is now activated.',
                  refPacketId:      packet.id,
                  sessionActivated: true,
                  yourNewSalt:      salt, 
                  serverId:         XSERVER.secure.serverId
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
                //sessionId found, already exist so will reject the request or do something

                /*
                resp.json({
                  msg:'session already existed.'
                })*/

                console.log('session already active')
              }

            })// end XD block


          } else {
            //other actions

            console.log('this is inactive session & for other action other than new_session')

            /*resp.json({
              msg:"Invalid action."
            })*/

          }


        })//end of XS.makeKey block
        
      } else {
        //not certified, probaby something wrong at the XB, like someone hacking it, so we don't allow this browser to get in.

        /*resp.json(
          { msg:"Packet not certified." }
        )*/

        console.log('packet not certified, will block this session/browser/access')
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
//function f(){}




// 6 - test //////////////////////////////////////////////////
//function testScript() {}

//put all test command here





