 /**
 * xdev2.js -- enhanced from xdev1.js to make software dev easier.
 * Version: 0.1
 * Web:''
 * License: none
 * Contact: mutita.org@gmail.com
 * Date: 2023-06-13
 */

//xdev.js 
/*
Simplify the dev language
v0.5 prototype 20230504
mutita.org@gmail.com

USE
    const xdev = require('./xdev.js')

    xdev.$({...})
    xdev.random() ...quick func don't need to form x-lang

*/



// import modules ---------------------------------
XC = require('./xcrypto2.js')
XF = require('./xfile2.js')
XD = require('./xmongo2.js')
const {ObjectId} = require('mongodb')
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')

const masterKeyFile = 'master.sec'
const defaultSalt = "#|~}v4&u&1R"
serverIp = '127.0.0.1'

const jsdb = {
  info: {
    module: 'jsdb',
    brief: 'A very simple json database for node.js',
    version: '0.1',
    license: 'none',
    by: 'M',
    date: '2023-07-30'
  },
  defaultFileName: 'jsdb.json',
  secureFileName: 'jsdb.sec',
  secureMode: true,
  keyFile: masterKeyFile,
  active: false, //after check the file program will adjust this
  x: {} //this where the data kept
}


// functions

async function $(X) {

  switch (Object.keys(X)[0]) {


    case 'cert':
      /** XS.$cert - this is a very simple certification of the message similarily to the HMAC but using a simple SHA-256.
       * @param {string} cert - the words to be certified
       * @param {string} key - usually a hash256 key string
       * @param {string} sig - signature string which was output of the previous certification
       * 
       * @use
       * 
       */
      // XS.$({cert:'<<words>>', salt: }) - hash256
      // XS.$({cert:'<<words>>, salt: , sig: }) - true|false
      // if has cert & key - this is the sign action
      // if has cert, key and sig - it is the verify action
      // OK m20230729
      if (!X.salt) X.salt = defaultSalt

      if (X.cert && X.salt && !X.sig) {
        //this is sign action
        return XC.$({hash: X.cert + X.salt })

      } else if (X.cert && X.salt && X.sig) {
        // verify act
        let check = await XC.$({hash: X.cert + X.salt})
        return (check == X.sig)? true : false 

      } else {
        return false
      }

      break
    

    //-------------------------------------------------
    case 'jwtSign':
      // XS.$({ jwtSign:'msg', key: })
      return jwt.sign(X.jwtSign, X.key)
      break
      //OK m20230728


    //----------------------------------------------------
    case 'jwtVerify':
      // XS.$({ jwtVerify:'jwtToken', key: })
      return new Promise( (resolve,reject) => {
        
        jwt.verify(X.jwtVerify, X.key, (err,data) => {
          resolve(data? data : false) 
        })
        
      })
      break
      //OK m20230728



    /* wrap/unwrap is used in the xserver to communicate between server & browser. The data is encrypted during transmission. 
    */
    case 'wrap': //OK,m 20230728
      // XS.$({ wrap: json|obj , key: })
       
      if (typeof X.wrap == 'object') {
        X.wrap = JSON.stringify(X.wrap)
      }
    
      if (!X.key) {
        //if no key supplied, take it from the master.sec file
        X.key = await XF.$({read:'master.sec'})
      }

      return { wrap: await XC.$({
          encrypt:  X.wrap, 
          key:      X.key
        })
      }
      break
      


    case 'unwrap': //OK, m20230728
      // XS.$({ unwrap: wrapped-msg, key: })    
      
      if (!X.key) {
        //if no key, get it from master.sec file
        X.key = await XF.$({read:'master.sec'})
      }
      
      if (X.unwrap.wrap) {
        let re = await XC.$({
          decrypt:  X.unwrap.wrap, 
          key:      X.key
        })
        
        if ( XS.isJson(re) ) {
          return JSON.parse(re)
        } else {
          return re 
        }
    
      } else {
        return {
          msg:'Wrong input.',
          fail: true 
        }
      }
      break
      


    case 'encryptFieldOf':
      //XS.$({ encryptFieldOf: obj, key: }) - all field of the obj will be encrypted

      if (!X.key) {
        X.key = await XF.$({read:'master.sec'})
      }

      runThrough(
        X.encryptFieldOf,
        'encrypt',
        X.key,
      )
      break



    case 'decryptFieldOf':
      //XS.$({ decryptFieldOf: obj, key: }) - decrypts all fields of object

      if (!X.key) {
        X.key = await XF.$({read:'master.sec'})
      }

      runThrough(
        X.decryptFieldOf,
        'decrypt',
        X.key,
      )
      break



    case 'verifyPassword':
      //XS.$({verifyPassword:<<pass>>, username:<<user>>})
      //OK, m20230802
      if (X.verifyPassword && X.username) {
        let passHash = await XD.$({
          find: {username: X.username}, 
          from:'user', 
          getOnly:'passwordHash'
        })
        let hashInDb = passHash[0].passwordHash

        let hashFromInput = await XC.$({
          hash: X.verifyPassword,
        })

        if (hashInDb == hashFromInput) {
          return true 
        } else {
          return false
        }

      } else {
        return {fail: true, msg: 'Invalid input.'}
      }
      break



    //--------------------------------------------------

    default:
      return {msg:"Invalid input.", fail: true}
  }
} //$





function uuidx() {
  // xdev.uuidx() ...get unique timestamp

  let t0 = Date.now()
  let t1 = Date.now()
  
  while (t1==t0) {
    t1 = Date.now()
  }

  let coding = t1.toString() 
  let id = coding.slice(0,-5) + '-' + coding.slice(-5)
  return id
  //output like: '16860282-70442' makes it easier to check by eyes
}//ok, m/20230606





function uuid() {
  // xdev.uuid() ...gets 12345678-1234-1234-1234-123456789012 hex
  
  return uuidv4()
}



function isHex(sample) {
  //check if the input hex or not, returning true or false

  if (typeof sample == 'string') {
    if (sample.match(/^[0-9a-f]+$/i)) {
      return true
    } else {
      return false 
    }

  } else {
    return false 
  }
}


function isJson(sample) {
  //test if the sample Json or not, if yes returns true, not returns false
  //let check = xs.isJson(aVar)
  //#tested ok, m20230616

  try {
    let check = JSON.parse(sample)
    if (typeof check == 'object') return true 
    else return false 
  } catch {
    return false
  }
}







function docNum(pattern) {
  //gen doc# for use in business
  //just for sample idea first

  let time = new Date
  let yyyy = time.getFullYear().toString()
  let yy = yyyy.slice(2)

  let mo = (time.getMonth() + 1).toString()
  if (mo.length == 1) mo = 0 + mo 

  let dd = time.getDate().toString()
  if (dd.length == 1) dd = 0 + dd 
  
  let hh = time.getHours().toString()
  if (hh.length == 1) hh = 0 + hh 

  let mm = time.getMinutes().toString()
  if (mm.length == 1) mm = 0 + mm 

  let ss = time.getSeconds().toString()
  if (ss.length == 1) ss = 0 + ss 
  
  let ms = time.getMilliseconds().toString()

  if (!V.sn) {
    V.sn = 1000
  } else {
    V.sn++
  }

  let cat = 'food'

  return (yy + mo + dd + '-' + cat + '-' + V.sn).toUpperCase() 
}



//---------------------------------------------------------
function x2html(xinput) {
  /**
   * x2html() -- converts object to html so that the xserver can respond back in html format, the xbrowser can read it easily.
   * version: 0.1
   * by: M
   * created: 2023-06-22
   * status: dev
   * 
   * #run
   *        xs.x2html({name:'john',age:23,sex:'male'})
   * 
   * #output
   *        <p><b>name:</b> john<br><b>age:</b> 23<br><b>sex:</b> male</p>
   * 
   * on web page will show like:
   * 
   * name: john
   * age: 23
   * sex: male
   * 
   * #tested OK, m-202306221133
   */

  if (xinput == '' || typeof xinput != 'object') return {
    msg:'Wrong input.',
    success: false,
    from: 'x2html()'
  }

  let htmlOutput = ''

  if (Array.isArray(xinput)) {
    //this is array of obj

    xinput.forEach(doc => {
      htmlOutput += '<p>'
      let key = Object.keys(doc) 
      
      key.forEach(k => {
        htmlOutput += '<b>' + k + ':</b> ' + doc[k] + '<br>'                 
      })

      htmlOutput += '</p>'
    })

  } else {
    //this is only 1 obj
    let key = Object.keys(xinput)
    htmlOutput += '<p>'

    key.forEach(k => {
      htmlOutput += '<b>' + k + ':</b> ' + xinput[k] + '<br>'
    })

    htmlOutput += '</p>'
  }

  return htmlOutput
}


//---------------------------------------------------
function runThrough(obj, mode, key) {
  //this func does both encrypt & decrypt
  /*
  if (typeof obj != 'object' || !key || !mode.match(/encrypt|decrypt/)) {
    return {msg:"Invalid input.", fail: true}
  }

  NOTE - right now this block works but if puts it in async mode and take the encryption/decryption func to run, got problem. Current stage it runs to any deepest stage of the data point and converts to base64 no problem.
  */

  if (Array.isArray(obj)) {
    //array
    for (i=0; i < obj.length; i++) {
    
      if (typeof obj[i] == 'object') {
        XS.runThrough(obj[i])
      } else {
        //  console.log(item)
        /*obj[i] = await XC.$({
          [mode]: obj[i],
          key: key
        })*/
        obj[i] = convert(obj[i],'utf8','base64')
        
      }
    }

  } else {
    //object
    for (item in obj) {
      
      if (typeof obj[item] == 'object') {
        XS.runThrough(obj[item])
      } else {
        //console.log(item, obj[item])
        /*obj[item] = await XC.$({
          [mode]: obj[item],
          key: key
        })*/
        obj[item] = convert(obj[item],'utf8','base64')
      }
    }
  }

}



function convert(chars,from,to) {
  if (!from) from = 'utf8'
  if (!to) to = 'utf8'
  if (typeof chars == 'number') chars = chars.toString()

  return Buffer.from(chars, from).toString(to)
}
  // XS.$({ convert:-data-, from:'utf8', to:'base64' })
  // XS.$({ convert:-data-, from:'base64', to:'utf8' })







///////////////////////////////////////////////////////
// JSDB - A very simple json database for node.js  

/**
 * jsdb.r - reads data from jsdb
 * @param {string} collec - if blank will read whole db
 * @param {object} query - like {name:'jo'}
 * @returns array if multi doc, obj if only 1 doc found
 * @use jsdb.r() for whole db, 
 *  jsdb('aaa') for whole collec,
 *  jsdb('aaa',{name:'bbb'}) finds specific filter
 * @note query allows only 1 field 
 * @test OK, m20230801
 * @clean OK, m20230801.1122
 */
jsdb.r = function (collec,query) {
  // XS.jsdb.r('person',{name:'john'})
  return new Promise((resolve,reject) => {

    let fileToUse = jsdb.secureMode? jsdb.secureFileName : jsdb.defaultFileName

    XF.$({exist: fileToUse}).then(re => jsdb.active = re)
    let output = ''
  
    if (jsdb.active) {
      //read file then work on it

      jsdbFile('read').then(re => {
        /*let readd = await XF.$({read:'jsdb.json'})
        jsdb.x = JSON.parse(readd)*/
        
        if (!collec && !query) {
          //if receive blank read, means read all data in db
          output = jsdb.x 
          jsdb.x = {}
          resolve(output) 
    
        } else if (collec && !query) {
          //receive only collec, read whole specified collec
          if (collec in jsdb.x) {
            output = jsdb.x[collec] 
            jsdb.x = {}
            resolve(output) 
            
          } else {
            jsdb.x = {}
            reject(null) 
          }
    
        } else if (collec && query) {
          //receive both collec & query
          if (collec in jsdb.x) {
    
            if (!Object.keys(query).length) {
              //blank query {} means find all
              output = jsdb.x[collec] 
              jsdb.x = {}
              resolve(output) 
      
            } else {
              //has someting in the query
    
              let key = Object.keys(query)
              let kk = key[0]
    
              if (key.length) {
                //jsdb will support only 1 field query
                let queryPattern = new RegExp(query[kk],'i')
                
                /*return jsdb.x[collec].filter(doc => doc[key].toString().match(queryPattern) )*/
    
                output = []
                jsdb.x[collec].forEach(dd => {
                  if (dd[kk]) {
                    if (dd[kk].toString().match(queryPattern) ) output.push(dd)
                  }
                })
    
                jsdb.x = {}
                if (output.length > 1) {
                  resolve(output) 
                } else {
                  resolve(output[0]) //has only 1 doc returns just obj
                }
    
              } else {
                // query == {} means no query, just take all of this collec
                output = jsdb.x[collec]
                jsdb.x = {} 
                resolve(output)
              }
            }
          
          } else {
            jsdb.x = {}
            reject(null)
          }
        }

      })//jsdbFile

    } else {
      //inactive
      reject(null)
    }

  })//promise
}//END of jsdb.r


//another name
jsdb.read = jsdb.r





//-------------------------------------------------------
/**
 * jsdb.w - add new data to jsdb, or update existing data
 * @param {string} collec 
 * @param {object} docq 
 * @param {object} update 
 * @returns true if the write success, false if invalid/fail
 * @test tested OK, m20230731
 * @clean OK, m20230801.1216
 */
jsdb.w = function (collec, docq, update) {
  //write mode

  return new Promise( (resolve,reject) => {

    let fileToUse = jsdb.secureMode? jsdb.secureFileName : jsdb.defaultFileName
  
    XF.$({exist: fileToUse}).then(re => jsdb.active = re)

    if (jsdb.active) { //now can work further

      jsdbFile('read').then(re => {
        //after read, data will be at jsdb.x

        //WRITE-ADD
        if (collec && docq && !update) {
          //this is write mode for new adding data
    
            // write-add block
          if (collec in jsdb.x) {
            //if docq is empty {} just exit
            if (!Object.keys(docq).length) {
              jsdb.x = {}
              reject(false) 
            }
            
            //collec already existed, just push
            if (Array.isArray(docq)) {
              //if array means it's multi-doc
              docq.forEach(d => {
                jsdb.x[collec].push(d)
              })
            } else {
              //only 1 doc
              jsdb.x[collec].push(docq)
            }
            jsdbFile('write')
    
    
          } else {
            //not exist, add it as new collec
            if (Array.isArray(docq)) {
              jsdb.x[collec] = docq //the doc is already array
            } else {
              jsdb.x[collec] = [docq]
            }
            jsdbFile('write')
          }
    
    
        //WRITE-UPDATE
        } else if (collec && docq && update) {
          //this is write for updatng the old doc
          //this case the docq will be the query input 
          if (collec in jsdb.x) {
            //collection exists, good to go
    
            let qKey = Object.keys(docq)
            if (qKey.length) {
              //valid query
              let qk1 = qKey[0]
              let querPatt = new RegExp(docq[qk1],'i')
              //find & update
              jsdb.x[collec].forEach(dd => {
                if (dd[qk1]) {
                  if (dd[qk1].match(querPatt) ) {
                    //found then just update it
                    for (kk in update) {
                      dd[kk] = update[kk]
                    }
                  }
                }
              })
              jsdbFile('write')
    
            } else {
              //just a blank query {}, makes it as 'all'
              jsdb.x[collec].forEach(dd => {
                for (kk in update) {
                  dd[kk] = update[kk]
                }
              })
              jsdbFile('write')
            }
    
          } else {
            //collec not exist
            jsdb.x = {}
            reject(false)
          }
    
        } else {
          //not add, not update, so this is invalid
          jsdb.x = {}
          reject(false)
        }
    
      })//jsdbFile
    
    
    } else {
      //inactive, this is fresh, the first fresh doc always being the write-new doc not write-update
  
      if (collec && docq) {
        //this is first fresh add
        if (Array.isArray(docq)) {
          jsdb.x[collec] = docq
        } else {
          jsdb.x[collec] = [docq]
        }
        jsdbFile('write')

      } else {
        //invalid input
        reject(false)
      }
    }
  
  })//promise
}//END of jsdb.w


//make another name
jsdb.write = jsdb.w //another name



//---------------------------------------------------------
/**
 * jsdb.d - deletes collection or doc
 * @param {string} collec - like 'person'
 * @param {object} query - like {name:'jo'} 
 * @returns deletion in the jsdb, or false if invalid input
 * @status WORKS, m20230731
 * @test need little more clean on msg, m20230801
 */
jsdb.d = async function(collec, query) {
  //delete collec or doc

  let fileToUse = jsdb.secureMode? jsdb.secureFileName : jsdb.defaultFileName

  jsdb.active = await XF.$({exist: fileToUse})

  if (jsdb.active) {
    //file exists, good to go

    jsdbFile('read').then(re => {

      if (collec && !query) {
        //this is delete the whole collection
        if (jsdb.x[collec]) {
          delete jsdb.x[collec]
          jsdbFile('write')
        } else {
          jsdb.x = {}
          return false //collec inexists
        }
  
      } else if (collec && query) {
        //delete some docs
  
        if (jsdb.x[collec] && Object.keys(query).length) {
          //has collec & good query, good to go
          let qkey = Object.keys(query)[0]
          let notFinished = true 
          
          while (notFinished) {
            //find index to delete until not found
            let idex = jsdb.x[collec].findIndex(dd => dd[qkey] == query[qkey])
  
            if (idex != -1) {
              jsdb.x[collec].splice(idex,1)
            } else {
              //not found and finished
              notFinished = false
              jsdbFile('write')
            }
          }
          
        } else {
          jsdb.x = {}
          return false
        }
  
      } else {
        //invalid
        return false
      }

    })//jsdbFile


  } else {
    //if inactive, cannot delete anything
    return false
  }
}//END jsdb.d

jsdb.delete = jsdb.d


/**
 * jsdb.import - get a json file to be jsdb.json file
 * @param {string} jsonFile - name of json file to import
 * @returns jsdb.json file
 * @status OK, m20230731
 * @test
 * @note changed the whole code, not test yet, m20230801.1251
 */
/*
jsdb.import = async function(file) {
  if (!file) return false

  let ff = await XF.$({read: file})
  let fileToUse = jsdb.secureMode? jsdb.secureFileName : jsdb.defaultFileName

  let re = XF.$({
    write: ff, 
    to: fileToUse
  })
  
  return re.success
}
*/



/**
 * jsdb.backup - backup jsdb.json file to another file
 * @param {string} backupFileName - if blank, default is jsdb_.json
 * @returns a backup file like jsdb_.json
 * @status OK, m20230731 
 */
/*
jsdb.backup = async function(backupFileName) {
  if (!backupFileName) backupFileName = 'jsdb_.json'
  jsdb.x = await XF.$({read:'jsdb.json'})
  XF.$({write:jsdb.x, to:backupFileName }).then(re => {
    jsdb.x = {}
    return re.success
  })
}
*/


//-------------------------------------------------------
/**
 * jsdbFile - internal func helping handle files for jsdb
 * @param {string} mode - 'read' or 'write' 
 * @returns data from jsdb for read mode, for write mode adding data to jsdb, or updating existing data
 * @test OK, m20230801
 * @status works
 */
jsdbFile = async function (mode) {
  //handles file for jsdb, internal func not exported
  //mode is 'read|write'

  if (mode == 'read') {
    //read mode
    if (jsdb.secureMode) {
      let cont = await XF.$({read:jsdb.secureFileName})
      let kk = await XF.$({read:jsdb.keyFile})
      cont = await XC.$({decrypt:cont, key:kk})
      jsdb.x = JSON.parse(cont) 

    } else {
      let cont = await XF.$({read:jsdb.defaultFileName})
      jsdb.x = JSON.parse(cont)
    }

  } else if (mode == 'write') {
    //write mode
    if (Object.keys(jsdb.x).length) {
      //has data to write

      let jsonn = JSON.stringify(jsdb.x)

      if (jsdb.secureMode) {
        let kk = await XF.$({read: jsdb.keyFile})
        let sec = await XC.$({encrypt:jsonn, key:kk})

        let re = await XF.$({
          write:  sec, 
          to:     jsdb.secureFileName
        })
        
        jsdb.x = {}
        return re.success

      } else {
        let re = await XF.$({
          write: JSON.stringify(jsdb.x) , 
          to:    jsdb.defaultFileName
        })
      
        jsdb.x = {}
        return re.success
      }

    } else {
      //don't have data
      return false
    }

  } else {
    //wrong
    return false
  }
}


/**
 * jsdb.changeMode - let we toggle between normal & secure modes
 * @returns jsdb.json if changed to normal mode, if changed to secure mode the file will be jsdb.sec
 * @status works
 * @test OK, m20230802
 */
jsdb.changeMode = async function () {
  //change mode from secure to normal, or vise versa
  /*
  - if inactive, cannot change mode
  - if current mode is secure, changes to normal and vise-versa
  - the files jsdb.sec & jsdb.json just leave them together. But careful to backup the file before you switch the mode because after switch the new file will be writen without notice.
  */
 
  let fileToUse = jsdb.secureMode? jsdb.secureFileName : jsdb.defaultFileName

  jsdb.active = await XF.$({exist: fileToUse})

  if (jsdb.active) {
    jsdbFile('read').then(re => {
      if (jsdb.secureMode) {
        //change secure > normal
        jsdb.secureMode = false 
        let re = jsdbFile('write')
        return re //true if success | false if fail

      } else {
        //change normal > secure
        jsdb.secureMode = true 
        let re = jsdbFile('write')
        return re
      }
    })

  } else {
    //inactive, invalid
    return false
  }
}



/*//--------------------------------------------------
async function makeKey(objIdStr) {
  //get ObjectId in string format then convert to a key (hash256)
  let tt = XD.ObjectId(objIdStr).getTimestamp().getTime()
  let algor = XS.convert(tt.toString() + s0,'utf8','base64')
  console.log(algor)
  let key = await XC.$({
    hash: objIdStr + algor   
  })
  return key
}
*/




//------------------------------------------------
function password(length=12) {
  //gen random password from 92 characters

  let pass = ''
  for (i=0; i<length; i++) {
    pass += `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$!~-+-*/\|&%#@^.,:;<>(){}[]`.charAt(
      Math.floor(
        Math.random() * 90
      )
    )
  }
  return pass
}//ok



//randomW is a random code tha containing only a-zA-Z nothing else
function randomWords(length=16) {
  //gen a js var style code contains only a-zA-Z

  let words = ''
  for (i=0; i<length; i++) {
    words += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(
      Math.floor(
        Math.random() * 52
      )
    )
  }
  return words
}//ok


class Packet {
  from = ''
  to = ''
  msg = ''
  id = serverIp + '_' + Date.now() + '_' + uuid()
  active = false 
  cert = ''
}




async function cert(packet, salt='') {
  //certify the packet
  // XS.cert(packet)

  if (!packet) return false
  if (!salt) {
    salt = defaultSalt
  }

  if (packet.cert == '') {
    //this is sign work
    if (typeof packet.msg != 'string') packet.msg = JSON.stringify(packet.msg)

    packet.cert = await XC.$(
      { hash: packet.from + packet.to + packet.msg + packet.id + packet.active + salt }
    )

    return packet

  } else {
    //this is verify
    if (typeof packet.msg != 'string') packet.msg = JSON.stringify(packet.msg)

    let check = await XC.$(
      { hash: packet.from + packet.to + packet.msg + packet.id + packet.active + salt }
    )

    return packet.cert == check? true : false
  }
}



async function makeKey(packet, salt='') {
  //make key from the packet
  // XS.makeKey(packet)
  //tested OK, m20230812

  if (!packet) return false

  if (typeof packet == 'object' && packet.from && packet.id) {
    return XC.$(
      { hash: packet.from + packet.to + packet.id + defaultSalt + salt } 
    )

  } else {
    return false
  }
}



async function prepPacket(msg, sessionInfo) {
  //send msg from xserver to peers
  // XS.send({..msg..}, sessionSalt)

  let packet = new Packet
  packet.active = sessionInfo.active
  packet.to = sessionInfo.sessionId
  packet.from = XSERVER.secure.serverId
  gotKey = await makeKey(packet, sessionInfo.salt)
  
  packet.msg = await XC.$(
    { encrypt:  JSON.stringify(msg), 
      key:      gotKey  }
  )

  return await cert(packet, sessionInfo.salt)
} 






// exports -------------------------------------------------
module.exports = {
  masterKeyFile, $, uuidx, uuid, isHex, 
  isJson, x2html, docNum, runThrough, convert,
  jsdb, makeKey, password, randomWords, Packet, 
  cert, prepPacket
}


