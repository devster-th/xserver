 /**
 * xdev.js -- enhanced from xdev1.js to make software dev easier.
 * version: 2.1-dev
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


// fixed variables
const masterKeyFile = 'master.sec'
const defaultSalt = "#|~}v4&u&1R"
serverIp = '127.0.0.1'




// import modules ---------------------------------
const {xc} = require('./xcrypto.js')
const {xf} = require('./xfile.js')
const {xd, ObjectId} = require('./xmongo.js')
//const {ObjectId} = require('mongodb')
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')


// objects


const mdb = {
  info: {
    brief: "This is a simple memory db.",
    version: '0.1'
  }
}


// functions -----------------------------------------------------

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
        return xc({hash: X.cert + X.salt })

      } else if (X.cert && X.salt && X.sig) {
        // verify act
        let check = await xc({hash: X.cert + X.salt})
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
        X.key = await xf({read:'master.sec'})
      }

      return { wrap: await xc({
          encrypt:  X.wrap, 
          key:      X.key
        })
      }
      break
      


    case 'unwrap': //OK, m20230728
      // XS.$({ unwrap: wrapped-msg, key: })    
      
      if (!X.key) {
        //if no key, get it from master.sec file
        X.key = await xf({read:'master.sec'})
      }
      
      if (X.unwrap.wrap) {
        let re = await xc({
          decrypt:  X.unwrap.wrap, 
          key:      X.key
        })
        
        if (isJson(re) ) {
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
        X.key = await xf({read:'master.sec'})
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
        X.key = await xf({read:'master.sec'})
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
        let passHash = await xd({
          find: {username: X.username}, 
          from:'user', 
          getOnly:'passwordHash'
        })
        let hashInDb = passHash[0].passwordHash

        let hashFromInput = await xc({
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
        runThrough(obj[i])
      } else {
        //  console.log(item)
        /*obj[i] = await xc({
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
        runThrough(obj[item])
      } else {
        //console.log(item, obj[item])
        /*obj[item] = await xc({
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









/*//--------------------------------------------------
async function makeKey(objIdStr) {
  //get ObjectId in string format then convert to a key (hash256)
  let tt = XD.ObjectId(objIdStr).getTimestamp().getTime()
  let algor = XS.convert(tt.toString() + s0,'utf8','base64')
  console.log(algor)
  let key = await xc({
    hash: objIdStr + algor   
  })
  return key
}
*/




//------------------------------------------------
function password(length=12) {
  //gen random password from 89 characters

  let pass = ''
  for (i=0; i<length; i++) {
    pass += `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$!~-+-*/\|&%#@^.,:;<>(){}[]`.charAt(
      Math.floor(
        Math.random() * 89 //89 is the total char we're random from
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

    packet.cert = await xc(
      { hash: packet.from + packet.to + packet.msg + packet.id + packet.active + salt }
    )

    return packet

  } else {
    //this is verify
    if (typeof packet.msg != 'string') packet.msg = JSON.stringify(packet.msg)

    let check = await xc(
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
    return xc(
      { hash: packet.from + packet.to + packet.id + defaultSalt + salt } 
    )

  } else {
    return false
  }
}



async function prepPacket(msg, sessionInfo) {
  //send msg from xserver to peers
  // XS.send({..msg..}, sessionSalt)
  // the msg is obj

  let packet = new Packet
  packet.active = sessionInfo.active
  packet.to = sessionInfo.sessionId
  packet.from = XSERVER.secure.serverId
  gotKey = await makeKey(packet, sessionInfo.salt)
  
  packet.msg = await xc(
    { encrypt:  JSON.stringify(msg), 
      key:      gotKey  }
  )

  return await cert(packet, sessionInfo.salt)
} 


/**
 * XS.passwordRealHash - makes the password hash more secure
 * @param {string} username 
 * @param {string/hex} passwordHash 
 * @returns hash/hex/sha256/64 digits
 */
async function passwordRealHash (username, passwordHash) {
  return xc({ hash:
    username + passwordHash + "D+DHDqyDC~P9"
  })
}


// converts csv into js object
function csv2obj(csv) {
  let ar = csv.split('\n')
  let obj = []
  let header = ar[0].split(',')
  let totalRow = ar.length - 1 //excludes header

  for (row=1; row <= totalRow; row++) {
    let thisRow = {}
    let data = ar[row].split(',')
    let i = 0 //loop data in each row

    header.forEach(h => {
      if (data[i]) {
        //has value
        if (data[i].match(/^\d+$/)) {
          //is number
          thisRow[h] = Number(data[i])
        } else {
          //not number
          thisRow[h] = data[i]
        }
      } else {
        //has no value
        thisRow[h] = ''
      }
      
      i++
    })

    obj.push(thisRow)
  }

  //console.log(obj)
  return obj
}





///////////////////////////////////////////////////////////////////
/* this F handle memory data, the concept is store everything in an array and sync this array with the xdb. 

use
    //write
    xs.mdb.w({uuid: ,....})
    -if doc has no uuid, auto add it
    -if uuid already existed, do update not add new
    -if no uuid existed, do add new doc

    //read
    xs.mdb.r(uuid)   
    xs.mdb.r({name:'john'})  
    - allows only 1 key search
*/

//this is array for keeping all data, as a silo
mdb.a = []

//adds this to every doc in mdb, xdb as we try to control the data
class docControl {
  owner = '=uuid='
  collection = '=string='
  needSync = false 
  updatedBy = '=uuid='
  createdTime = '=ms='
  createdBy = '=userId='
  rights = [
    {who:'owner', rights:'read/write/delete'},
    {who:'public',rights:''},
    {who:'team',  rights:''},
    {who:'org',   rights:''}
  ]
  version = {
    name: '',
    number: 1,
    markedBy: '=userId='
  }
  active = true
}

//read mode
mdb.r = function (quer='') {
  if (quer) {
    if (typeof quer == 'string') {
      //if string, regards as a uuid
      return mdb.a.find(x => x.uuid == quer)

    } else if (typeof quer == 'object' && !Array.isArray(quer)) {
      //if obj, it is a query like {name:'john'} but only first key allowed
      let key = Object.keys(quer)[0]
      if (quer[key] instanceof RegExp) {
        //search by RegExp
        return mdb.a.filter(x => x[key]?.match(quer[key]) )
      } else {
        //general search
        if (key.includes('.')) {
          //like {'_control.needSync':true}
          let part = key.split('.')
          return mdb.a.filter(x => x[part[0]][part[1]] == quer[key])
          //supports only 2 level should be fine
        } else {
          //1 level key
          return mdb.a.filter(x => x[key] == quer[key])
        }
      }
    } else {
      //more than these is false
      return false
    }

  } else {
    //if no input just throw everything out
    return mdb.a
  }
}

mdb.read = mdb.r 

//write mode
//mdb.w({ data })
//in each doc has to have uuid, if uuid already existed will regards as change-mode, not add-mode
mdb.w = function (dat='') {
  if (dat && typeof dat == 'object') {
    if (Array.isArray(dat)) {
      //this is array, set of docs
      let changeQty = 0
      let addQty = 0
      for (doc of dat) {
        
        let existed = '' //indicates if this data's uuid existed or not

        if (doc.uuid) {
          existed = mdb.a.findIndex(x => x.uuid == doc.uuid)
          if (existed < 0) existed = false
        } else {
          //data has no uuid so add new
          doc.uuid = uuid()
          existed = false
        }
  
        if (existed) {
          //this is change task not add
          for (key in doc) {
            if (key != 'uuid') mdb.a[existed][key] = doc[key]
          }
          mdb.a[existed].time = Date.now()
          changeQty++
          mdb.a[existed]._control.needSync = true
        } else {
          //this is add task
          doc.time = Date.now() //always make the time-key
          doc._control = new docControl
          mdb.a.push(doc)
          addQty++
        }
      }
      let msg = {}
      if (addQty) msg.addedDoc = addQty
      if (changeQty) msg.changedDoc = changeQty
      return msg

    } else {
      //this is obj
      let existed = '' //indicates if this data's uuid existed or not

      if (dat.uuid) {
        existed = mdb.a.findIndex(x => x.uuid == dat.uuid)
        if (existed < 0) existed = false
      } else {
        //data has no uuid so add new
        dat.uuid = uuid()
        existed = false
      }

      if (existed) {
        //this is change task not add
        for (key in dat) {
          if (key != 'uuid') mdb.a[existed][key] = dat[key]
        }
        mdb.a[existed].time = Date.now()
        mdb.a[existed]._control.needSync = true 
        return {changedDoc: 1}
      } else {
        //this is add task
        dat.time = Date.now()
        dat._control = new docControl
        mdb.a.push(dat)
        return {addedDoc: 1}
      }
    }
  } else {
    //no data = false
    return false
  }
}
//ok m202311262305
//all works for but right now it just replace the existing doc. Next it has to update only the changed fields.

mdb.write = mdb.w


mdb.writeAll = function (dat='') {
  if (dat && typeof dat == 'object' && !Array.isArray(dat)) {
    let writeQty = 0
    mdb.a.forEach(doc => {
      let done = false //to check if it really write the data
      for (key in dat) {
        if (key != 'uuid') {
          doc[key] = dat[key]
          done = true
        } 
      }
      if (done) {
        doc.time = Date.now()
        doc._control.needSync = true 
        writeQty++
      }
    })
    return {changedDoc: writeQty}
  } else {
    return false
  }
}

mdb.wa = mdb.writeAll 










// exports -------------------------------------------------
module.exports = {
  masterKeyFile, $, uuidx, uuid, isHex, 
  isJson, x2html, docNum, runThrough, convert,
  makeKey, password, randomWords, Packet, 
  cert, prepPacket, passwordRealHash, csv2obj,
  mdb, xc, xf, xd
}


/* NOTE
The wrap & unwrap are not use now, uses the packet instead.

*/