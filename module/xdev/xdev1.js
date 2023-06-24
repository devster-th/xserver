/**
 * xdev is a framework for software development.
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

global.XDEV = {
  info: {
    softwareName: 'xdev',
    for: 'Helps the software development easier.',
    version: '0.2',
    released: '2023-06-11',
    by: 'mutita.org@gmail.com',
    installid: ''
  },
  db: {
    dbName: 'xdb',
    url:''
  }
  

}

// import modules ---------------------------------

const xsec = require('./xcrypto.js')
const xfile = require('./xfile.js')
//const xdb = require('./xmongo.js') 
const xmongo = require('./xmongo.js')
const {ObjectId} = require('mongodb')
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')




//test///////////////////////////////////

///////////////////////////////////////

/*
function info() {
  console.log(XDEV)
}*/

/* NOT USE
async function v(x) {
  console.log(x)
  let part = x.get.match(/^({\w+})?(.+)$/)
  console.log(part)
  let resource = part[1]
  let dbRes = part[2]
  let dbPart = dbRes.split('.')
  console.log(dbPart)
  let db = dbPart[0]
  let col = dbPart[1]
  let [key,val] = dbPart[2].split(':')
  //let key = keyVal[0]
  //let val = keyVal[1]
  console.log(key, val)

  return xdb.find({[key]:eval('/j/')},col,db)
}
*/


async function $(x) {

  switch (Object.keys(x)[0]) {

// get, set, del ----------------------------------------

    case 'get':
      
      /*  xs.$({
            get:'name age sex',
            from:'xdb.customer',
            filter:{province:bangkok, age:'50-'},
            qty: 20,
            order: 'asc|des|a>z|z>a|1|-1'
          })
      */
      
      /**
       * the db# can be more options like file#, var#, ...
       * if the [...] ommits will take whole collection
       * 
       * part[1] is db#
       * part[2] is dbName.colName
       * part[3] is [key=value]
       * part[4] is key=value
       */

      //console.log( Object.keys(x.filter) == '' )

// VIP command is the only 1 statement command
// like   {get:'xdb.product.6476ceecf01f0d7ff6a69a26' }
//  or    {get:'xdb.product{name:"coffee"}' }
//  or just 'xdb.product{name:"coffee"}' ...this will mean get

//  new command
//  {get:'xdb.product{name:"coffee"}.price' }
//  this gets only price value

      if (Object.keys(x).length == 1) { // 1 key command

        if (Object.keys(x)[0] == 'get' && typeof x.get == 'string') {

          if (!x.get.includes('{')) {
            //not includes {...} so it is general 'xdb.product.4654613546513abcdef' type of command

            let part = x.get.split('.')
            let db,col,filter 
  
            if (part.length > 1) {
              //valid
  
              if (part.length == 2) {
                // db.collection

                if (await xmongo.isDb(part[0])) {
                  // {get:'xdb.product'}
                  db = part[0]
                  col = part[1]
                  return xmongo.find({},col,db) //ok m20230611
                  //ok

                } else if (await xmongo.isCollection(part[0])) {
                  // {get:'product.1234568974564'}
                  col = part[0]
                  db = XDEV.db.dbName

                  if ( isHex(part[1]) ) filter = ObjectId(`${part[1]}`)
  
                  return xmongo.find(filter,col,db)
                }//ok

              
              } else if (part.length == 3) {
                // db.collection._id
               
                if ( isHex(part[2]) ) {
  
  
                  db = part[0]
                  col = part[1]
                  filter = ObjectId(`${part[2]}`)
  
                  return xmongo.find(
                    filter, //ObjectId('647d30c7ea9fd00cdd19367d'),
                    col,db
                  )
  
                } else {
                  return false
                }
              }
  
            } else {
              //like {get:'product'} ...so take it as collection

              db = XDEV.db.dbName
              col = part[0]
              //console.log(db,col)
              return  xmongo.find({},col,db)
            }//ok


          } else {
            //has {...} so it is a simple filter like 'xdb.product{name:"coffee"}'
            //can also put ... {name:/j/} ..regex

          /*
            let filterPart = x.get.match(/{.+}/)[0]
            let firstPart = x.get.replace(/{.+}/,'')

            let part = firstPart.split('.')
            if (part.length > 2) return false 
            let db = part[0], col = part[1]

            eval('filter =' + filterPart)
            return xmongo.find(filter,col,db)  
          */

          //add the field after the ...{name:/fried/}.price so it returns the price out
          
            let part = x.get.match(
              /^((\w+)\.)?(\w+)({.*})?(\.(\w+))?$/
            )

            let db,col,query,option 
            
            if (part[2]) db = part[2]
            else db = XDEV.db.dbName

            if (part[3]) col = part[3]
            else return false 
            
            if (part[4]) {
            
              if (part[4] == '{}') query = {}
              //for... 'xdb.product{} ...means all doc
              else {
                eval('query = ' + part[4])
              }
            
            } else query = {}


            if (part[6]) option = {[ part[6] ]:1, _id:0}
            else option = {}

            
            let re = await xmongo.find(
              query,
              col,
              db,
              option
            )

            if (re.length == 1 && part[6]) {
              return re[0][ part[6] ]
            } else {
              return re 
            }

            //ok m20230612

          }//ok
          

        } // second if block
      }//ok


//initial
      let onlyThisValue = '' //if only getting 1 value, will store the key here

      
//limit      
      if (typeof x.qty != 'number') x.qty = 0

//db & col      
      var part = x.from.split('.') //xdb.customer
      var db,col

      if (part.length == 1) {
        col = part[0]
        db = XDEV.db.dbName
      } else if (part.length == 2) {
        db = part[0]
        col = part[1]
      } else {
        return false 
      }

//filter or query
          if (x.filter) {
            x.filter = filterHelp(x.filter)
          } else {
            //if no filter specified, filter = all
            x.filter = {}
          }
/*      if (!x.filter || x.filter == '' || x.filter == '*') {

        x.filter = {}

      } else if (typeof x.filter == 'object' && x.filter instanceof ObjectId) {

        //this is ObjectId, don't do things
      
      } else if (typeof x.filter == 'object') {
        //if filter is set, call the helper func
        x.filter = filterHelp(x.filter)
        
      } else {
        //may be wrong input
        return '! xdev/filterHelp: wrong input'
      }
*/

//projection
      // default of _id >> _id:0
      if (x.get == 'all' || x.get == '' || x.get == '*' || !Object.keys(x.get).length ) {

        x.get = {} //{_id:0}

      } else if (x.get == '_docQty') {

        return xmongo.docCount(
          x.filter,
          col,
          db
        )
        //ok, m/20230610


      } else if (typeof x.get == 'object' 
          && Object.keys(x.get)[0] == 'distinct') {

            //distinct mode

            return xmongo.distinct(
              x.get.distinct,
              x.filter,
              col,
              db
            )
              //ok, m/20230610


      } else {
        //there's setting

        let field = x.get.split(' ')
        
        if (field.length == 1) onlyThisValue = field[0] //keep the key here and will use at the returning output
//------------------
/*        let state = '{'

        for (f of field) {
          state = state + f + ':1,' //{ + name:1,
        } */
//----------------------
//change above block with this block
        let getObject = {}

        for (key of field) {
          getObject[key] = 1
        }


        //if there's no setting of _id, sets it to 0 (not show)
        if (x.get.includes('_id') ) {
          //state = state + '}'
        } else {
          //state = state + '_id:0 }'
          getObject._id = 0
        }

        //eval('x.get =' + state) 
        x.get = getObject
      }
//------------------------------


//sorting accepts 3 types: (a) 1 or -1 , (b) asc, des, (c) a>z, z>a 
      if (x.order) {

        for (k in x.order) {

          if (typeof x.order[k] == 'string' && x.order[k].match(/asc|a>z/) ) x.order[k] = 1

          else if (typeof x.order[k] == 'string' && x.order[k].match(/des|z>a/) ) x.order[k] = -1

          //if input is number just pass it (1=ascend, -1 is descending)
        }
      }

      //run
      let re = await xmongo.find(
        x.filter,
        col,
        db,
        x.get, //default not show the _id
        x.qty,
        x.order //{name:1} is ascending, -1 is desdending
      )

      if (re.length == 1) {
        if (onlyThisValue) {
          //just return the pure value if getting only 1 field
          return re[0][onlyThisValue]

        } else {
          //if multiple keys of getting, return the object
          return re[0]
        }

      } else {
        //this returns multiple obj in an array
        return re
      }

      /**
       * now supports _id:'....' auto convert to ObjectId
       * or even just supply the filter:ObjectId('...') also works
       * 
       */


      break
      //ok m-20230607-------------------------------------


////////////////////////////////////////////////////////


      case 'set':
      //the set is both new & change mode: if no filter supplied it is new mode, if filter supplied it is change/update mode

      /**
       * xs.$({
       *  set:{...}, if many docs put [{..},{..}, ...]
       *  option: '$rename|$mul|$inc|$unset',
       *  to: 'xdb.customer',
       *  filter: {group:'A'},
       * 
       * })
       */

      if (x.set && x.to 
        && Object.keys(x.set) != false 
        && Object.keys(x.to) != false) {
        //have to provide x.set & x.to and must be data inside, not blank

        var [db,col] = x.to.split('.')

        if (!x.filter) {
          //no filter is the new/insert mode
          return xmongo.inserts(
            x.set,
            col,
            db
          )
  
        } else {
          //if filter is set, it is update mode

          
          x.filter = filterHelp(x.filter)

          
          
          let specialSet = 'none' 
          //option: increase +, multiply *, divide /, percent %

          // check for increase mode or not
          for (key in x.set) {

            if (typeof x.set[key] == 'string' 
              && x.set[key].match(/[+-]\d+$/) ) { //'+10' or '-10'

                //increase +,-
                x.set[key] = Number( x.set[key] )
                specialSet = 'increase'
            }

            else if (typeof x.set[key] == 'string'
              && x.set[key].match(/\*.+/) ) { // '*1.1'

                //multiply * like set:{price:'*1.1'}
                x.set[key] = Number( x.set[key].replace('*','') )
                specialSet = 'multiply'
              }

            else if (typeof x.set[key] == 'string'
              && x.set[key].match(/\/\d+/) ) {

                //divide / ...set:{price:'/2'}
                x.set[key] = eval(1 + x.set[key] )
                specialSet = 'divide'
              }

            else if (typeof x.set[key] == 'string'
              && x.set[key].match(/[+-]?(\d+)%(\d+)?$/) ) {

                //percent % ...set:{ratio: '+5%'} ..or '-5%'
                /*
                    +5% ...increase 5% from current value
                    -5% ...decrease 5%

                    formula:  current * (5/100 + 1) 
                              current * (-5/100 + 1)
                */
                specialSet = 'percent'
                x.set[key] = eval(`'${x.set[key]}'.replace('%','') / 100 + 1`)
              }
          }

          //run setting

          if (specialSet == 'increase') {
            //increase mode like set:{stock:'+10'}
            //return xdb.increase(
            
            return xmongo.updates2(
              { $inc: x.set },
              x.filter,
              col,
              db
            )//ok

          } else if (specialSet == 'multiply') {

            return xmongo.updates2(
              {$mul: x.set},
              x.filter,
              col,
              db
            )//ok
          
          } else if (specialSet == 'divide') {

            return xmongo.updates2(
              {$mul: x.set}, //the x.set is already 1/x.set
              x.filter,
              col,
              db
            )//ok
          
          } else if (specialSet == 'percent') {

            //to work
            return xmongo.updates2(
              {$mul: x.set}, //x.set already made +5/100 +1 before this *
              x.filter,
              col,
              db
            )//ok
          
          } else {

            //general update
            /*  xs.$({
                  set:{...},
                  special: true,
                  to:'xdb.product',
                  filter:{......}
                })
            */

            if (x.special) {
              //just pass the x.set into the xdb.updates2()
              //there's an x.special:true in the set command
              /*
                  special set like:
                  $unset, $mul, $rename, all of the mongo's update command should be able to do
              */
            } else {
              x.set = {$set: x.set} //make it general update $set
            }

            return xmongo.updates2(
              x.set,
              x.filter,
              col,
              db,
            )
          }
          
        }


      } else {
        //invalid if no set or to
        return false 
      }
      
      /**
       * now supports set:{} of +100, *1.1  m/20230609
       *    set:{price:'*1.1'} ...price x 1.1
       *    set:{price:'+100'} ...plus 100 to the price
       */
      

      break
      //ok 20230605 m-------------------------------------


    case 'del':
      /**
       * xs.$({ del:{name:/xyz/}, from:'xdb.customer' })
       * 
       * call ==> xdb.deletes({name:/xyz/, col, db})
       */

      var [db,col] = x.from.split('.')

      return xmongo.deletes(x.del, col, db)

      break
      //ok 20230605 m




    // ----------- xcrypto & jwt --------------------------------

    case 'hash':
      // xdev.$({hash:'words', algor:'sha256', format:'hex'})
      return xsec.hash(x.hash, x.algor, x.format)
      break 
      //m,ok 20230502


    case 'hmac':
      // xdev.$({ hmac:'words', key:'mykey', 
      //          algor:'sha256',format:'hex' })
      return xsec.hmac(x.hmac, x.key, x.algor, x.format)
      break
      //m,ok 20230502

    case 'verifyHash':
      // await xdev.$({ verifyHash:'--hash--', msg:'--words--', key:'--key--'})

      let hashFromMsg = await xsec.hmac(x.msg, x.key)
      return x.verifyHash == hashFromMsg?true:false
      break
      //ok, m20230518


    case 'xcert': //------------------------------------------
      /**
       * Certifies message usinng hash/sha256. The f does 2 things: 
       * 1) sign: if we put the msg & key it knows that you're signing msg. 
       * 2) verify: if we put msg, key and sig then it knows that you like to verify.
       
       USE
        
        xdev.$({
          xcert:  '--msg/words--', 
          key:    '--string/hex/base64--', 
          sig:    '--hex--' 
        })
      
      */

      if (x.xcert && x.key && !x.sig) {
        return sha256(x.xcert + x.key)

      } else if (x.xcert && x.key && x.sig) {
        let sig_ = await sha256(x.xcert + x.key)
        return (sig_ == x.sig)? true:false

      } else {
        return 'xs.xcert: wrong input'
      }
      break
      //ok, m20230519


    case 'random': //-----------------------------------
      // xdev.$({ random:16, format:'hex' })
      return xsec.random(x.byte, x.format)
      break
      //m,ok 20230502

    case 'encrypt':
      // xdev.$({ encrypt:'--words--', key:'--hex--' })
      return xsec.encrypt(x.encrypt, x.key)
      break
      //m,ok 20230502


    case 'decrypt':
      // xdev.$({ decrypt:'--cipher--', key:'--hex--' })
      return xsec.decrypt(x.decrypt, x.key)
      break
      //m,ok 20230502


    case 'genKeys':
      // xdev.$({ genKeys:'rsa' }) ....can just put '' instead of 'rsa'
      return xsec.genKeys()
      break 
      //m,ok 20230502


    case 'keyEncrypt':
      // xdev.$({ keyEncrypt:'words, pubKey: ,format:'base64' })
      return xsec.keyEncrypt(x.keyEncrypt, x.pubKey, x.format)
      break
      //m,ok 20230502


    case 'keyDecrypt':
      // xdev.$({ keyDecrypt:'cipher', priKey: ,format:'base64' })
      return xsec.keyDecrypt(x.keyDecrypt, x.priKey, x.format)
      break
      //m,ok 20230502


    case 'sign':
      // xdev.$({ sign:'msg', priKey: })
      return xsec.sign(x.sign, x.priKey)
      break


    case 'verify':
      // xdev.$({ verify:'signature', pubKey: })
      return xsec.verify(x.verify, x.signature, x.pubKey)
      break
    

    case 'jwtSign':
      // xdev.$({ jwtSign:'msg', key: })
      return jwt.sign(x.jwtSign, x.key)
      break
      //m,ok 20230501


    case 'jwtVerify':
      // xdev.$({ jwtVerify:'jwtToken', key: })
      return new Promise( (resolve,reject) => {
        
        jwt.verify(x.jwtVerify, x.key, (err,data) => {
          resolve(data? data : false) 
        })
        
      })
      break
      //m,ok 20230501


    case 'convert':
      // xdev.$({ convert:'chars', from:'utf8', to:'hex' })
      return xsec.convert(x.convert, x.from, x.to)
      break
      //m,ok 20230502


    //----------- xmongo ------------------------------------

    case 'newDb':
      // xdev.$({ newDb:'--db name--'})
      return xmongo.newDb(x.newDb)
      break
      //m,ok


    case 'newCol':
      // xdev.$({ newCol:'--collection name--', db:'--db name--' })
      return xmongo.newCol(x.newCol, x.db)
      break
      //m,ok


    case 'dbInsert':
      // xdev.$({ dbInsert:{...}, col:'--', db:'--'}) ...insert 1 or many
      return xmongo.inserts(
        x.dbInsert, 
        x.col, 
        x.db
      )
      break
      //m,ok


    case 'dbFind':
      // xdev.$({ dbFind:{--query--}, col:'--', db:'--'})
      return xmongo.find(
        x.dbFind, 
        x.col, 
        x.db
      )


    case 'dbUpdate':
      // xdev.$({ dbUpdate:{--key--:--value--}, query:{..}, col: ,db: })
      return xmongo.updates(
        x.dbUpdate, 
        x.query, 
        x.col, 
        x.db
      )

/* NOT USE, use $set    
    case 'dbIncrease':
      // xs.$({ dbIncrease:{stock:-1}, query:{..}, col: ,db: })
      return xdb.increase(
        x.dbIncrease,
        x.query,
        x.col,
        x.db
      )
        //ok m/20230606
*/


    case 'dbDelete':
      //xs.$({ dbDelete:{key:value}, col:--, db:--})
      //delete doc based on the query
      return xmongo.deletes(x.dbDelete, x.col, x.db)




    //------------ xfile -----------------------------

    case 'fileWrite':
      // xdev.$({ fileWrite:'content', fileName: })
      return xfile.write(x.fileWrite, x.fileName)

    
    case 'fileAppend':
      // xdev.$({ fileAppend:'content', fileName: })
      return xfile.append(x.fileAppend, x.fileName)


    case 'readFile':
      // xdev.$({ readFile:'file name' })
      return xfile.read(x.readFile)

    case 'deleteFile':
      // xdev.$({ deleteFile:'file name' })
      return xfile.erase(x.deleteFile)


    case 'renameFile':
      // xdev.$({ renameFile:'old name', to:'new name' })
      return xfile.rename(x.renameFile, x.to)

    case 'fileExist':
      // xdev.$({ fileExist:'file name to check' })
      return xfile.exist(x.fileExist)

    /* m, all xfile test = passed */

    //--------------------------------------------------

    default:
      return false 
  }
}

//----------quick func---------------------------------

function random() {
  // xdev.random() ...rt 16bytes(32 chars), hex random codes
  return xsec.random()
}

function randomInt(min,max) {
  // xs.randomInt() ...rt 10-int from 1000000000-9999999999 (default)
  return xsec.randomInt(min,max)
}

async function genKeys() {
  // xdev.genKeys() ...rt rsa priKey & pubKey , pem format
  return xsec.genKeys()
}

async function sha256(words) {
  // xdev.sha256('words') ...default sha256, hex
  return xsec.hash(words)
}

async function md5(words) {
  // xdev.md5('words')
  return xsec.hash(words,'md5')
}

async function readFile(fileName) {
  // xdev.readF(fileName)
  return xfile.read(fileName)
}

async function hasFile(fileName) {
  // xdev.hasF(fileName)
  return xfile.exist(fileName)
}

async function deleteFile(fileName) {
  // xdev.deleteF(fileName)
  return xfile.erase(fileName)
}



async function jsonf(obj) {
  // _jsonf.file ...has default file name, changeable
  // xdev.jsonf(x) ...save x to file
  // xdev.jsonf() ...read file to x

  if (typeof _jsonf == 'undefined') {
    global._jsonf = {
      file: 'jsonf.json' //default filename
    }
  }

  if (obj) {
    //write obj to file
    xfile.write(
      JSON.stringify(obj),
      _jsonf.file
    )
  } else if (!obj) {
    //read file
    return xfile.read(_jsonf.file).then(json => {
      return JSON.parse(json)
    })
  }
}


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


function jsonify(x) {
  // xdev.jsonify(x)

  if (typeof x == 'object') {
    return JSON.stringify(x)

  } else {
    return false
    //{jsonify: 'Wrong input. Input must be object type.'}
  }
}//ok m/20230611


function jparse(j) {
  // xdev.parseJson(--json--)

  try {
    let read = JSON.parse(j)
    if (typeof read == 'object') return read
    else return false 

  } catch {
    return false
    //{parseJson:'Wrong input. Has to be json format.'}
  }
}//ok m/20230611


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


async function wrap(data,key=XSERVER.security.key) {
  //wrap data before sending to xserver
  //let w = await xs.wrap(obj)
  //returns {wrap:'--base64 encrypted string--'}
  //#tested ok, m20230616

  if (typeof data == 'object') {
    data = JSON.stringify(data)
  }

  return {
    wrap: await xs.$({encrypt:data, key:key})
  }
}


async function unwrap(wrappedObj,key=XSERVER.security.key) {
  //unwrap wrapped-data
  //let uw = await xs.unwrap(wrapObj)
  //return data before wrapping, if it's obj it gives you obj
  //#tested ok, m20230616

  if (wrappedObj.wrap) {
    let re = await xs.$({decrypt:wrappedObj.wrap, key:key})
    
    if ( xs.isJson(re) ) {
      return JSON.parse(re)
    } else {
      return re 
    }

  } else {
    return {
      msg:'Wrong input.',
      success: false ,
      from: 'xs.unwrap()'
    }
  }
}





function cl(thing) {
  //shortening the console.log()
  return console.log(thing)
}



function docNum(pattern) {
  //gen doc# for use in business

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

  if (typeof sn == 'undefined') {
    global.sn = 1000
  } else {
    sn++
  }

  let cat = 'food'

  return (yy + mo + dd + '-' + cat + '-' + sn).toUpperCase() 
}


function testAsync(f) {
  /**
   * For: test async func so don't need to put .then(x=>...) all the time.
   * Test: ok
   * Date: 20230611
   * Dev: M
   * Use: 
   *        xs.testAsync(
   *          ....put func here....
   *        )
   * 
   *        run this in nodejs prompt >
   */

  f.then(x=>{
    console.log(x)
    return true   
  })

}//ok m20230612











// data model --------------------------------------

class Wrap {
  id = Date.now() + '-' + xs.randomInt()
  to = ''
  from = ''
  subj = ''
  msg = ''
  note = ''
  ref = ''
  confidential = ''
  time = Date.now()
  cert = '' //--hex-- .....this will be added after cert
  verified = '' //true|false .......added after verified

  /**
   * this is a data model for the message wrap used to send/receive among programs.
   */
}


// helper for get, set, del --------------------------

function filterHelp(filter) {

  // #1. first check
  if (filter == '' || filter == '*' || filter == 'all' /*|| !Object.keys(filter).length*/ ) {

    return {}

  } else if (typeof filter == 'object' && filter instanceof ObjectId) {

    //this is ObjectId, don't do things
    return filter
  
  } 



  // #2. loop all keys in the filter
  for (k in filter) { //k is key of the filter

    //ObjectId
    if (k == '_id') {
      //eval(`filter = ObjectId('${filter[k]}')`)
      filter = ObjectId( filter._id )
      return filter
    }

    // > MORE THAN
    else if (typeof filter[k] == 'string' && !filter[k].includes('=') && filter[k].includes('+')) {
      //age:'50+' ....change to age:{$gt:50}
      filter[k] = filter[k].replace('+','')
      filter[k] = Number(filter[k])
      eval(`filter[k] = {$gt: ${filter[k]} }`)
    }

    // >= EQUAL OR MORE THAN
    else if (typeof filter[k] == 'string' && filter[k].includes('=') && filter[k].includes('+')) {
      //price:'=5000+' ...change to price:{$gte:5000}
      filter[k] = filter[k].replace('=','')
      filter[k] = filter[k].replace('+','')
      filter[k] = Number(filter[k])
      eval(`filter[k] = {$gte: ${filter[k]} }`)
    }

    // < LESS THAN
    else if (typeof filter[k] == 'string' && !filter[k].includes('=') && filter[k].includes('-') ) {
      //age:'50-' ...change to age:{$lt:50}
      filter[k] = filter[k].replace('-','')
      filter[k] = Number(filter[k])
      eval(`filter[k] = {$lt: ${filter[k]} }`)
      }

    // <= EQUAL OR LESS THAN
    else if (typeof filter[k] == 'string' && filter[k].includes('=') && filter[k].includes('-') ) {
      //age:'50-' ...change to age:{$lt:50}
      filter[k] = filter[k].replace('=','')
      filter[k] = filter[k].replace('-','')
      filter[k] = Number(filter[k])
      eval(`filter[k] = {$lte: ${filter[k]} }`)
      }

    // ! NOT
    else if (typeof filter[k] == 'string' && filter[k].match(/^!/)) {
      // filter:{name:'!john'} ...>> {name:{$not:'john'} }
      filter[k] = filter[k].replace('!','')
      eval(`filter[k] = {$not: /${filter[k]}/ }`)
    }
    
    // OR |
    //use filter:{name:/coffee|fried rice/i} instead

    // * WILDCARD
    else if (filter[k] == '*') {
      eval('filter[k] = /.+/')
    }

    // A* ...FIRST WORDS & *
    else if (typeof filter[k] == 'string' 
      && filter[k].match(/[^*]+\*$/)) {
        //wild card like name:'j*' >> name:/^j/
        filter[k] = filter[k].replace('*','')
        eval(`filter[k] = /^${filter[k]}/i`)
    }

    // _exist , _inexist 
    else if (typeof filter[k] == 'string' && filter[k].match(/_exist|_inexist/)) {

      if (filter[k] == '_exist') {
        filter[k] = {$exists: true}
      } else {
        filter[k] = {$exists: false}
      }
    }

    else {
      //none of above matched
      
    }


  } //end of for ..loop filter's key


  // #3. check or_
  let key = Object.keys(filter)

  if (key.length == 1 && key[0].match(/^or_.+$/) ) {
    key = [ key[0].replace('or_','') ]
    filter = {[ key[0] ]: filter[ Object.keys(filter)[0] ]}
  }

  let justKey = []
  let or_key = []

  for (i=0; i < key.length; i++) {

    if ( key[i].match(/^or_.+$/) ) {
      or_key.push( key[i] )
    } else {
      justKey.push( key[i] )
    }
  }

  key = justKey.concat(or_key)
  let or_table = []

  for (i=0; i < key.length; i++) {

    if (key[i].match(/^or_.+$/)) {
      or_table[i] = true
    } else {
      or_table[i] = ''
    }
  }

  if (or_table.length == 2 && !or_table[0] && or_table[1]) {
    or_table[0] = true
  }

  //makeing $or object
  let newFilter = {}

  for (i=0; i < or_table.length; i++) {

    if (or_table[i] && !newFilter.$or) {
      //first or_
      newFilter.$or = [
        { [ key[i].replace('or_','') ]: filter[ key[i] ] }
      ]
    
    } else if (or_table[i] && newFilter.$or) {
      //following or_ (not the first one)
      newFilter.$or.push(
        {[ key[i].replace('or_','') ]: filter[ key[i] ]}
      )
    
    } else {
      //not the or_ , normal key
      newFilter[ key[i] ] = filter[ key[i] ]
    }
  }



  // #4. return output
  return newFilter

  /**
   * testing, so far so good, m
   */
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





// exports -------------------------------------------------

module.exports = {
  $, random, genKeys, sha256, md5, 
  readFile, hasFile, deleteFile, jsonf, uuidx, 
  randomInt, jsonify, jparse, uuid, 
  Wrap, isHex, docNum, cl, testAsync,
  isJson, wrap, unwrap, x2html  
}

/* note
all works excepts the sign & verify f, seems to have problem in the xcrypto module ,20230502

all the quick-func works, m/20230504

:-) the get/set mostly work excepts:    m/20230609 
  1. get internalCode, re []
  2. set ObjectId , re error around mismatch ObjectId but samething in the get works


*/


/**
 * Devnote
 * 
 * Changed the import name of xmongo from 'xdb' to 'xmongo' so it's not duplicate with the db name 'xdb' in the mongodb. And to prevent confusion from different of filename and the const name of the xmongo.js module.
 * m20230613
 * 
 * 
 */