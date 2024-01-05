global.fileTag = {
  fileName:     'xserver.js',
  brief:        'xserver is a platform for everything.',
  version:      '0.5',
  component:    ['nodejs','expressjs','mongodb','js','html','css'],
  web:          'localhost:2000',
  createdDate:  '2023-06-13',
  teamMember:   ['M'],
  license:      null,
  releasedDate: 'not yet',
  status:       'dev'
}





//1) initialize/config -----------------------------------------

//load modules
const express = require("express")
const app     = express()
const xs      = require('./module/xdev/xdev.js')
const x$      = xs.$
const mdb     = xs.mdb
const {xd, ObjectId, DocControl}  = require('./module/xdev/xmongo.js')
const {xf}    = require('./module/xdev/xfile.js')
const {xc}    = require('./module/xdev/xcrypto.js')
const {core}  = require('./module/core/core.js')
//const sales = require('./module/sales/sales.js')
//global.model = require('./module/xdev/xDataModel.js')

const {test} = require('./module/test/test.js')



// variables
global.XSERVER = {
  appName:    "xserver",
  version:    fileTag.version,
  startTime:  Date.now(),
  domain:     "localhost",
  port:       2000,
  operator:   'nexWorld',
  secure:{
    defaultSalt: "#|~}v4&u&1R",
    serverId: xs.uuid(),
    masterKey: 'c40b93b2dfb61810e5ad22d132de54b7e718d10f66a8f523379826de95dbadf1'
  },
  xRootPath:          '/home/sunsern/xserver/', //root of xserver
  xsModulePath:       'module/',
  websitePath:        'website/',
  xbrowserPath:       'xbrowser/', //put after websitePath 
  xbrowserModulePath: 'module/', //put after xbrowserPath
  xbrowserDocPath:    'doc/' //after xbrowserModulePath
}



//setting expressjs
app.use(
  (i,o,next) => {
    if (i.path.includes('/pic/fish.jpeg')) {
      o.send('<p>this is secured file</p>')
    } else {
      next()
    }
  }
) //put this block 20240104.0959 this can be way to secure static file

app.use(express.static('website'))
app.use(express.json())





//2) GET works ////////////////////////////////////////////////////////////
/**
 * open/insecured msg handling mainly used for static & web pages not private data.
 */

/*
app.get('/', (i,o) => {
  console.log(i.query)
  o.send('<p>Please log-in first</p>')
})
*/

app.get("/req", async (i,o)=>{

  //A) works on the input mainly for certifying msg
  console.log('//--------------------------------------')
  console.log('//@xserver: received GET message at ', new Date().toISOString() )
  //console.log(req.method)
  console.log(i.query)

  let getMsg = i.query //put a name to prevent confuse
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

  if (i.query.from) {
    let key = Object.keys(i.query)[0]
    let foundRecord = await xd({
      find: {[key]: i.query[key]},
      from: i.query.from
    })
  
    o.send(`<!DOCTYPE html><html>
    <head>
    <style>
    h1 {color:red}
    </style>
    </head><body><h1>reply from xserver</h1>
    <code>${
      xs.pretty(
        JSON.stringify(foundRecord[0])
      )
    }</code></body></html>`)
  } else {
    o.send(`<h1>reply from xserver</h1>
    <code>ERROR: Wrong input</code>`)
  }
  
 

}) //xget block


//handle postId
app.get('/post/:postId', (i,o)=>{
  // http://domain.io/post/[uuid] will show that post
  console.log(i.params) //for get and using express routing, this is work
  //console.log(i.query) this not work for routing
})


//handle product
app.get('/product/:productId', async (i,o)=>{
  // http://domain.io/product/[productId] ...shows product page
  console.log(i.params)
  let foundProduct = await xd({
    find: {uuid: i.params.productId},
    from: 'product'
  })

  if (foundProduct) {
    o.send(
      `<h1>reply from xserver</h1>
      <code>${
        xs.pretty(
          JSON.stringify(foundProduct[0])
        )
      }</code>`
      
    )
  } else {
    o.send(
      `<h1>reply from xserver</h1>
      <code>ERROR: Not found this productId in our database.</code>`
    )
  }
})


//transaction handling
app.get('/transac/:transacId', (i,o)=>{
  // http://domain.io/transac/[transacId] ...shows transac info
  console.log(i.params)
})


//contract handling
app.get('/contract/:contractId',(i,o)=>{
  // http://domain.io/contract/[contractId] ...shows contract info
  console.log(i.params)
})

app.get('/user/:username/post/:postId',(i,o)=>{
  // http://domain.io/user/[username]/post/[postId] ...shows that post of that user
  console.log(i.params)
})

//file handling
app.get('/file/:fileName', async (i,o)=>{
  // http://domain.io/file/[fileName] ...gives that file
  console.log(i.params)
  let foundFile = await xf({
    exist: '/home/sunsern/xserver/file/' + i.params.fileName
  })

  if (foundFile) {
    o.sendFile('/home/sunsern/xserver/file/' + i.params.fileName)
  } else {
    o.send(`<p>File not found.</p>`)
  }
})






//3 POST works ///////////////////////////////////////////////////////////
/**
 * secured msg handling
 * POST will be main channel for all communications in the app
 * Takes only JSON data
 */

app.post("/xserver", async (i,o)=> {
  //A) certifying msg
  console.log('-----------------------------------------------------')
  console.log('--POST packet, ', new Date().toISOString() )
  console.log('--req packet = ', i.body)

  //got a packet
  let packet = i.body //just put name to avoid confuse

  //log
  xd({ add:{packet: packet}, to:'log' })


  // ACTIVE ---------------------------------------------------
  /* if the packet.active means this is active communications between server & browser. But will need to check it the db that there's record or not too. 
  
  Normally the browser/user may call the core or other modules to work. */

  if (packet.active) { 
    //session already active

    //check xdb, double check. The mdb.r() will return null if not found, if found will return array of doc.
    let foundSess = await mdb.read({ 
      sessionId:  packet.from,
      from:       'session'
    })

    if (foundSess) {
      foundSess = foundSess[0]
      if (foundSess.active) {
        //in the xdb.session also active so the session is good to work with

        //uses salt in the found record from db to cert the coming packet
        xs.cert(packet, foundSess.salt).then(certified => {
          if (certified) {

            //packet is certified, now unwrap the packet.msg
            xs.makeKey(packet, foundSess.salt).then(gotKey => {

              //unwrap packet.msg
              return xc({ 
                decrypt:  packet.msg,
                key:      gotKey
              })
// ! what if the decrypt fail?
            
            }).then(unwrappedMsg => {
// ! what to do if the unwrap bad?

              packet.msg = JSON.parse(unwrappedMsg)
              console.log(packet.msg)

              if (packet.msg.module) {
                //if there's module regards it as a module call
                /*
                  like 
                    { 
                      module: =moduleName=, 
                      act:    =actionName=, 
                      anyKey: ==== 
                    } 
                */

                //run the module
                //like sales.$({..input..})
                try {
                  let thisModule = eval(packet.msg.module)
                  console.log(thisModule)         

                  //tried to change to: this[packet.msg.module](...) not works
                  thisModule(packet.msg).then(moResp => {
                    //this is resp from the module
                    console.log(moResp)

                    //prep packet to send to XB
                    return xs.prepPacket(moResp, foundSess)
                    
                  }).then(rePacket => {
                      console.log(rePacket)

                      //log
                      xd({ 
                        add:  rePacket,
                        to:   'log' 
                      })

                      //send back to XB
                      o.json(rePacket)
                  
                  }).catch(error => {
                    console.log(error)
                  })

                } catch {
                  console.log('module error')
                }
                


              } else {
                //not specified module so regards this as for the xserver or the core module
                //like {act: 'log_in', =otherFields= }

                console.log('if no module specified, regards it as for core module')
                packet.msg.sessionId = packet.from

                core(packet.msg).then(re => {
                  console.log('return from core: ', re)

                  if (!re) re = { //in case something wrong in the module
//should make more formal msg                    
                    module: 'core',
                    msg:    'none'
                  }
                  return xs.prepPacket(re, foundSess)
                
                }).then(rePacket => {
                  console.log(rePacket)

                  //log
                  xd({ 
                    add:  rePacket,
                    to:   'log' 
                  })

                  //send back to XB
                  o.json(rePacket)

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

    //not actually found the session in the db
    } else {
      console.log('something wrong with the packet')        
    } 

  
  } else {
    //  INACTIVE ----------------------------------------
    /* Inactive state can be the first connection of the browser/user to xserver so what normally do is to initiate or register new session. The browser will do: {act:'new_session} and after the xserver registered then both sides can communicate further. */

    //check cert
    xs.cert(packet).then(certified => {
      //console.log('cert result', certified) //true|false

      if (certified) {
        //cert passed now unwrap the packet.msg

        xs.makeKey(packet).then(gotKey => {
          //console.log(gotKey)

          return xc({ 
            decrypt:  packet.msg, 
            key:      gotKey 
          })
// ! what if dec has problem?          
        
        }).then(unwrappedMsg => {
          packet.msg = JSON.parse(unwrappedMsg)
          //console.log(packet)
// ! if unwrap or parse has problem?

          //check action in the packet.msg
          if (packet.msg.act == 'new_session') {

            //check mdb/db is there any dup sessionId? If not found the mdb.r() returns null
            mdb.read({ 
              sessionId:  packet.from,
              from:       'session'  
            }).then(found => {

              if (!found) {
                //sessionId not already existed, good to go
                let newSalt = xs.password()
                
                //register new session
//if db error?                
                xd({ 
                  add: {  
                    sessionId:  packet.from, //regis this id
                    salt:       newSalt,
                    active:     true,
                  },
                  to: 'session'
                })

                //response to browser
                let rePacket    = new xs.Packet
                rePacket.from   = XSERVER.secure.serverId
                rePacket.to     = packet.from
                rePacket.active = true

                rePacket.msg = {
                  act: 'reply_new_session',
                  ref:  '',
                  msg: 'Successfully registered new session.',
                  refPacketId:      packet.id,
                  sessionActivated: true,
                  yourNewSalt:      newSalt, 
                  serverId:         XSERVER.secure.serverId
                }
console.log(rePacket)
                xs.makeKey(rePacket).then(gotKey => {
                  //console.log(gotKey)

                  //wrap msg
                  return xc({ 
                    encrypt:  JSON.stringify(rePacket.msg),
                    key:      gotKey 
                  })
// ! if this got problem?                  
                
                }).then(wrap => {
                  rePacket.msg = wrap
                  //certify
                  return xs.cert(rePacket)

                }).then(() => {

                  //log
                  xd({ 
                    add:  {packet: rePacket}, 
                    to:   'log' 
                  })

                  console.log('\n--response packet = ', rePacket)
                  o.json(rePacket)
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

            })// end of {act:'new_session}


          } else {
            //other actions

            console.log('this is inactive session & for other action other than new_session')

            /* Generally the first contact of the browser the packet.active = false so the browser usually call {act:'new_session'} but there can be more action to come as we dev. */

          }
        })//end of certified block

        
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

  console.log('A little thing that trying to solve something big.')
  console.log("@xserver is ready...\n")
  
  //testScript()
  //console.log('@core id: ', core.id )
})


/*
2023-12-14
  -reviewed codes, made some notes, and uses mdb.r() instead of xd() 
  
  
*/





