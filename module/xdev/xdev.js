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
//
// MDB - A memory data handling
//
///////////////////////////////////////////////////////////////////
/* loads data from mongodb, stores in memory and handling update & sync to mongodb 

use
    mdb.r() >>returns whole data of mdb
    mdb.r(=uuid=) >> returns obj
    mdb.r({key:=searchTerm=}) >> only 1 key, returns [=set=]

    mdb.u([...]|{...}) >> udpates doc/set to mdb & db
    mdb.c([...]|{...}) >> checks if doc/set have update
    mdb.d(=uuid=|{key:=searchTerm=}) >> deletes doc/set
    mdb.wa({...}) >> writes to all doc & sync


*/

//this is array for keeping all data, as a silo
mdb.a = []  //keep data here
mdb.syncError = []  //keep response from mongo here

//adds this to every doc in mdb, xdb as we try to control the data
class DocControl {
  owner = ''
  collection = ''
  updatedBy = ''
  createdTime = ''
  createdBy = ''
  rights = [
    {owner:'read/write/edit/delete'},
    {team:'read'},
    {organization:'read'},
    {public:''}
  ] //{who: ,rights:'read/write/delete'}
  version = {
    name: '',
    number: 1,
    markedBy: '',
    note: ''
  }
  active = true
  touchTime = Date.now()
}


mdb.touch = function(doc) {
  // stamps time on a doc/set in mdb
  // ! the doc/set should be in mdb not else
  // returns =ts= if done, but given =false= if wrong

  if (typeof doc == 'object') {

    //array input
    if (Array.isArray(doc)) {
      let t = Date.now()
      let done = 0
      doc.forEach(x => {
        if (x.uuid && x.time && x._control) {
          x._control.touchTime = t
          done++
        } //if bad doc, just skip
      })
      if (done) return t
      else return false //all is bad doc

    //obj input  
    } else if (Object.keys(doc).length) {
      let t = Date.now()
      if (doc.uuid && doc.time && doc._control) {
        doc._control.touchTime = t
        return t
      } else {
        return false //bad doc
      }
    
    //wrong input
    } else {
      return false
    }

  //first fail
  } else {
    return false //wrong input
  }

  //tested ok, m/202312111605
}


mdb.r = mdb.read = async function (quer='', option='') {
  /* Finds doc in mdb if not found continue finding in db. If found, loads into mdb. All found records return to caller. */
  // gives =obj= if query by =uuid=, [=set=] if queried by key
  // if inexist will reload from db

  if (quer) {

    //string query
    if (typeof quer == 'string') {
      //if string, regards as a uuid
      let found = mdb.a.find(x => x.uuid == quer)
      if (found) {
        mdb.touch(found)
        return found

      } else {
        //not found in mdb so let's find/reload from db
        // the input has to be: mdb.r(=uuid=,=db.col=)
        if (option && typeof option == 'string') {
          return mdb.l({
            find: {uuid: quer},
            from: option
          }).then(result => {
            if (result && result[0].uuid == quer) {
              return result[0]
            } else {
              return null
            }
          })
        } else {
          return null
        }
      }

    //obj query
    } else if (typeof quer == 'object' && !Array.isArray(quer)) {
      //if obj, it is a query like {name:'john'} but only first key allowed
      let key = Object.keys(quer)[0]

      //by RegExp
      if (quer[key] instanceof RegExp) {
        let found = mdb.a.filter(x => x[key]?.toString().match(quer[key]) )

        if (found != '') {
          mdb.touch(found)
          return found

        } else {
          //not found so let's try in db
          //input has to be: mdb.r({key: xxxxx, from:'db.col'})
          if (quer.from) {
            return mdb.l({
              find: {[key]: quer[key]},
              from: quer.from
            }).then(found => {
              if (found != '') {
                return found
              } else {
                return null
              }
            })
          } else {
            return null
          }
        }

      //general search
      } else {
        //2-level
        if (key.includes('.')) {
          //like {'_control.needSync':true}
          let part = key.split('.')
          let found = mdb.a.filter(x => x[part[0]][part[1]] == quer[key])

          if (found != '') {
            mdb.touch(found)
            return found
          } else {
            //not in mdb so reload from db
            //input must have: mdb.r({aaa:..., from:...})
            if (quer.from) {
              return mdb.l({
                find: {[key]: quer[key]},
                from: quer.from
              }).then(found => {
                if (found != '') {
                  return found
                } else {
                  return null
                }
              })
            } else {
              return null
            }
          }
          //supports only 2 level should be fine

        //1 level key
        } else {
          let found = mdb.a.filter(x => x[key] == quer[key])

          if (found != '') {
            mdb.touch(found)
            return found
          } else {
            //not found in mdb so reload from db
            if (quer.from) {
              return mdb.l({
                find: {[key]: quer[key]},
                from: quer.from
              }).then(found => {
                if (found != '') {
                  return found
                } else {
                  return null
                }
              })
            } else {
              return null
            }
          }
        }
      }

    //no more other query type
    } else {
      return false
    }

  //if no input, just throw everything out
  } else {
    if (mdb.a != '') return mdb.a
    else return null
  }

  //tested ok, m/202312111604
  //tested ok, changed to async, make it reloads if data not exist in mdb; changed format like: await mdb.r(=uuid=,'test.product') or mdb.r({aaa: ,from: }) so if data is not loaded into mdb it reloads; m/20231213.1505
}




mdb.u = mdb.update = async function (dat='') {
  // updates the mdb & sync to db
  // mdb.u({=doc=} | [=set=]) | mdb.update()
  // if the target doc is not in mdb, reloads it
  // any chnage in mdb must sync to db immediately

  if (dat && typeof dat == 'object') {

    //array input
    if (Array.isArray(dat)) {

      let updateQty = 0; skipQty = 0; count = 0

      for (upDoc of dat) {
        count++
        if (upDoc.uuid && upDoc.time && upDoc._control) {
          let exist = await mdb.r(
            upDoc.uuid, 
            upDoc._control.collection
          )
    
          if (exist) { //means in db too as mdb.r will pull from db too
            if (upDoc.time > exist.time) {
              //input is newer so update the current
              let done = 0
    
              for (key in upDoc) {
                if (key != 'uuid' || key != '_control') {
                  exist[key] = upDoc[key]
                  done++
                } 
              }
              mdb.touch(exist)
    
              if (done) {
                updateQty++
                let sync = await xd({ //sync
                  change: {uuid: upDoc.uuid},
                  with:   exist,
                  to:     upDoc._control.collection
                })
                
                if (sync.modifiedCount) {
                  //no error from db
                } else {
                  mdb.syncError.push({
                    uuid: upDoc.uuid,
                    time: upDoc.time,
                  })
                }

                if (count == dat.length) {
                  let msg = {}
                  if (updateQty) msg.updatedQty = updateQty
                  if (skipQty) msg.skippedQty = skipQty
                  return msg
                }
    
              } else {
                skipQty++
                if (count == dat.length) {
                  let msg = {}
                  if (updateQty) msg.updatedQty = updateQty
                  if (skipQty) msg.skippedQty = skipQty
                  return msg
                }
              }
    
            } else {
              //input is not newer so just skip
              skipQty++
              if (count == dat.length) {
                let msg = {}
                if (updateQty) msg.updatedQty = updateQty
                if (skipQty) msg.skippedQty = skipQty
                return msg
              }
            }

           
          
          //doc inexist in mdb & db
          } else {
            skipQty++
            if (count == dat.length) {
              let msg = {}
              if (updateQty) msg.updatedQty = updateQty
              if (skipQty) msg.skippedQty = skipQty
              return msg
            }
          }
    
         
        //upDoc is bad, has no uuid, time, _control
        } else {
          skipQty++
          if (count == dat.length) {
            let msg = {}
            if (updateQty) msg.updatedQty = updateQty
            if (skipQty) msg.skippedQty = skipQty
            return msg
          }
        }  
      }
      
    

      /* when looping the async func, uses for..of is better than forEach. If we use forEach, it is meaning that the async func will run under forEach method/func so it's deeper another level. */



    //the input is object-------------------------------------  
    } else {
      if (dat.uuid && dat.time && dat._control) {
        let exist = await mdb.r(dat.uuid)
  
        if (exist) {
          mdb.touch(exist)
  
          if (dat.time > exist.time) {
            //input is newer so update the current
            let done = 0
            for (key in dat) {
              if (key != 'uuid' || key != '_control') {
                exist[key] = dat[key]
                done++
              } 
            }
            mdb.touch(exist)
  
            if (done) { //sync
              
              let sync = await xd({ //sync
                change: {uuid: dat.uuid},
                with:   exist,
                to:     dat._control.collection
              })
              
              if (sync.modifiedCount) {
                //no error from db
              } else {
                mdb.syncError.push({
                  uuid: dat.uuid,
                  time: dat.time,
                })
              }
              return {updatedQty: 1}
  
            //not done on existed doc, skip
            } else { 
              return {skippedQty: 1}
            }
  
          //input is not newer so just skip
          } else {
            return {skippedQty: 1}
          }

        //no doc in mdb so reload it from db
        } else {
          let fromDb = await mdb.load({
            find: {uuid: dat.uuid},
            from: dat._control.collection
          })
  
          if (fromDb.length) {
            fromDb = fromDb[0]
            mdb.touch(fromDb)
  
            if (dat.time > fromDb.time) {
              let done = 0
              for (key in dat) {
                if (key != 'uuid' || key != '_control') {
                  fromDb[key] = dat[key]
                  done++
                }
              }
  
              if (done) {
                mdb.touch(fromDb)
                let sync = await xd({ //sync
                  change: {uuid: dat.uuid},
                  with:   fromDb,
                  to:     dat._control.collection 
                })
  
                if (sync.modifiedCount) {
                  //done in db
                } else {
                  mdb.syncError.push({
                    uuid: dat.uuid,
                    time: dat.time
                  })
                }
                return {updatedQty: 1}
              }
  
            //upDoc not newer db, skip
            } else {
              return {skippedQty: 1}
            }
  
          //not found in db, skip
          } else {
            return {skippedQty: 1}
          }
        }
  
      //upDoc has no uuid, time, _control = invalid
      } else {
        return false
      }
    }

  //first fail, wrong input
  } else {
    return false
  }

  //tested ok, m/202312111603
}





mdb.wa = mdb.writeAll = async function (dat='') {
  // writes data into all doc in mdb & sync to db

  if (dat && typeof dat == 'object' 
    && !Array.isArray(dat) && mdb.a != '') {
    
    let writeQty = 0

    mdb.a.forEach(async doc => {
      let done = 0 //to check if it really write the data
      for (key in dat) {
        if (key != 'uuid' && key != '_control') {
          doc[key] = dat[key]
          done++
        } 
      }

      if (done) {
        doc.time = Date.now()
        mdb.touch(doc)
        writeQty++

        let sync = await xd({
          change: {uuid: doc.uuid},
          with: doc,
          to: doc._control.collection
        })

        if (sync.modifiedCount) {
          //no problem from db
        } else {
          mdb.syncError.push({
            uuid: doc.uuid,
            tim:  doc.time
          })
        }

      }
    })

    return {updatedDoc: writeQty}

  //wrong input
  } else {
    return false
  }

  //tested OK, m/202312111603
}




mdb.d = mdb.delete = function(quer='') {
  // deletes mdb docs by query, not sync
  // mdb.d(=uuid=)  | mdb.d({=key=: =value=})   | mdb.delete()

  if (quer) {

    //input is string means uuid
    if (typeof quer == 'string') {
      let found = mdb.a.findIndex(x => x.uuid == quer)
      if (found != -1) {
        mdb.a.splice(found,1)
        return {deletedQty: 1}
      } else {
        //not found, skip
        return false
      }

    //input is obj
    } else if (typeof quer == 'object' && !Array.isArray(quer) && Object.keys(quer).length) {
      let key = Object.keys(quer)[0] 

      let delQty = 0

      //multi-level query
      if (key.includes('.')) {
        let part = key.split('.')
        let found = mdb.a.filter(x => x[part[0]][part[1]] == quer[key])

        //many docs to delete
        if (found != '' && found.length > 1) {
          found.forEach(x => {
            let delThis = mdb.a.findIndex(y => y.uuid == x.uuid)
            mdb.a.splice(delThis,1)
            delQty++
          })
          return {deletedQty: delQty}

        //1 doc to delete
        } else if (found != '' && found.length == 1) {
          found = found[0]
          let delThis = mdb.a.findIndex(x => x.uuid == found.uuid)
          mdb.a.splice(delThis,1)
          return {deletedQty: 1}

        //something wrong
        } else {
          return false
        }
       
      //1-level
      } else {

        let found = mdb.a.filter(x => x[key] == quer[key])

        if (found != '' && found.length > 1) {
          found.forEach(x => {
            let delThis = mdb.a.findIndex(y => y.uuid == x.uuid)
            mdb.a.splice(delThis,1)
            delQty++
          })
          return {deletedQty: delQty}

        } else if (found != '' && found.length == 1) {
          found = found[0]
          let delThis = mdb.a.findIndex(x => x.uuid == found.uuid)
          mdb.a.splice(delThis,1)
          return {deletedQty: 1}

        } else {
          return false
        }
      }
    }

  } else {
    //quer invalids
    return false
  }
}





mdb.l = mdb.load = async function(quer='') {
  /* Loads data from db and check if that doc is not in mdb will keep in mdb too. Returns all matched docs to caller. This command will directly pass queryObject to the xd() function. */
  // also keep the loaded data in mdb

  if (Object.keys(quer).length && typeof quer == 'object') {
    
    let fromDb = await xd(quer)

    if (fromDb.length) {
      fromDb.forEach(async doc => {
        let exist = await mdb.r(doc.uuid)

        if (exist && exist != '') {
          //assumes that the mdb is always more udpate than the db
          mdb.touch(exist)
        } else {
          //no this doc in mdb, just put in
          mdb.touch(doc)
          mdb.a.push(doc)
        }
      })          

      //so now the requiring data also in mdb too
      return fromDb  

    } else {
      //if nothing from the db
      return null 
    }

  } else {
    return false  //no input
  }

  //tested ok, m/202312111704
}



mdb.c = mdb.check = mdb.checkUpdate = async function (inp='') {
  // checks mdb is there updates for these docs
  // if there is, returns that doc/set

  let output = []; count = 0
  
  //input is array
  if (inp && Array.isArray(inp)) {

    for (inDoc of inp) {
      count++
      let exist = await mdb.r(
        inDoc.uuid, inDoc._control.collection
      )
      
      if (exist) {
        if (exist.time > inDoc.time) output.push(exist)
        if (count == inp.length) {
          if (output != '') return output
          else return null
        }
      } else {
        if (count == inp.length) {
          if (output != '') return output
          else return null
        }
      }
    }
    /* in async mode, encouraging to use for...of rather than forEach */
    

  //input is obj
  } else if (typeof inp == 'object') {
    let exist = await mdb.r(
      inp.uuid, 
      inp._control.collection
    )

    if (exist) {
      mdb.touch(exist)
      if (exist.time > inp.time) return exist
      else return null
    } else {
      return null
    }

  //wrong input
  } else {
    return false 
  }

  //tested ok, m/202312111711
  //tested ok, changed to new mdb.r() in async mode
}


//sort by a key
//default sort by string type but if put type='number|num|n' it will sort as number
//way default is ascending, can change to 'de|descending'
/*
    mdb.sort('name') ===this is sort string, ascending
    mdb.sort('name','s','de') =====string, descending
    mdb.sort('time','n') ===number, ascending
    mdb.sort('time','n','de') ===number, descending
*/
mdb.sort = function (key, typ='s', way='as') {
  if (key) {
    if (typ == 's' || typ == 'str') {
      
      //this is sorting string
      if (way == 'as') {
        mdb.a.sort((a,b) => {
          if (a[key] < b[key]) return -1
          if (a[key] > b[key]) return 1
          return 0
        })
        return "Sorted strings, ascending way in mdb.a"

      } else if (way == 'de') {
        mdb.a.sort((a,b) => {
          if (a[key] < b[key]) return 1
          if (a[key] > b[key]) return -1
          return 0
        })
        return "Sorted strings, decending way in mdb.a"

      } else {
        return false
      }
      
      //number sort
    } else if (typ == 'n' || typ == 'num') {
      if (way == 'as') {
        mdb.a.sort((a,b) => {
          if (a[key] < b[key]) return -1
          if (a[key] > b[key]) return 1
          return 0
        })
        return "Sorted numbers, ascending in mdb.a"

      } else if (way == 'de') {
        mdb.a.sort((a,b) => {
          if (a[key] < b[key]) return 1
          if (a[key] > b[key]) return -1
          return 0
        })
        return "Sorted numbers, decending in mdb.a"

      } else {
        return false
      }
    }
  } else {
    return false
  }

  //tested ok, m/202312111714
}


//mdb.clear -- clears mdb at every interval to save memory but if docs often touched they may stay longer in mdb.
//tested ok m/2023121222 
mdb.livingPeriod  = 60000 * 5  //data can stay this long
mdb.clearInterval = 5000      //check data every this gap
mdb.clearId = ''

mdb.clear = function (v='start') {
  if (v == 'start') {
    mdb.clearId = setInterval(() => {
      let notFinished = true
      do {
        let expired = mdb.a.findIndex(x => Date.now() - x._control.touchTime > mdb.livingPeriod)
        if (expired < 0) {
          notFinished = false
        } else {
          mdb.a.splice(expired,1)
        }
      } while (notFinished)
    
    }, mdb.clearInterval)
  
  } else if (v == 'stop') {
    clearInterval(mdb.clearId)
  }
} 
mdb.clear()


// exports -------------------------------------------------
module.exports = {
  masterKeyFile, $, uuidx, uuid, isHex, 
  isJson, x2html, docNum, runThrough, convert,
  makeKey, password, randomWords, Packet, 
  cert, prepPacket, passwordRealHash, csv2obj,
  mdb, xc, xf, xd, DocControl
}


/* NOTE
The wrap & unwrap are not use now, uses the packet instead.

*/