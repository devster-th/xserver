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

const xsec = require('./xcrypto.js')
const xfile = require('./xfile.js')
const xdb = require('./xmongo.js') 
const {ObjectId} = require('mongodb')
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')




//test///////////////////////////////////

///////////////////////////////////////


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



async function $(x) {

  switch (Object.keys(x)[0]) {

// get, set, del ----------------------------------------

    case 'get':
      /*  xs.$({
            get:'name age sex',
            from:'xdb.customer',
            filter:{province:bangkok, age:'50-'}
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
      
//limit      
      if (typeof x.qty != 'number') x.qty = 0
      var [db,col] = x.from.split('.') //xdb.customer

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

        x.get = {_id:0}

      } else {
        //there's setting

        let field = x.get.split(' ')
        let state = '{'

        for (f of field) {
          state = state + f + ':1,' //{ + name:1,
        }
        
        //if there's no setting of _id, sets it to 0 (not show)
        if (x.get.includes('_id') ) {
          state = state + '}'
        } else {
          state = state + '_id:0 }'
        }

        eval('x.get =' + state) 
      }

//sorting accepts 3 types: (a) 1 or -1 , (b) asc, des, (c) a>z, z>a 
      if (x.order) {
        for (k in x.order) {
          if (x.order[k].match(/asc|a>z/) ) x.order[k] = 1
          else if (x.order[k].match(/des|z>a/) ) x.order[k] = -1
        }
      }

      //run
      let re = await xdb.find(
        x.filter,
        col,
        db,
        x.get, //default not show the _id
        x.qty,
        x.order //{name:1} is ascending, -1 is desdending
      )

      if (re.length == 1) {
        return re[0]
      } else {
        return re
      }

      /**
       * now supports _id:'....' auto convert to ObjectId
       * or even just supply the filter:ObjectId('...') also works
       * 
       */


      break
      //ok m-20230607-------------------------------------


      case 'set':
      //the set is both new & change mode: if no filter supplied it is new mode, if filter supplied it is change/update mode

      /**
       * xs.$({
       *  set:{...}, if many docs put [{..},{..}, ...]
       *  to: 'xdb.customer',
       *  filter: {group:'A'}
       * })
       */

      if (x.set && x.to 
        && Object.keys(x.set) != false 
        && Object.keys(x.to) != false) {
        //have to provide x.set & x.to and must be data inside, not blank

        var [db,col] = x.to.split('.')

        if (!x.filter) {
          //no filter is the new/insert mode
          return xdb.inserts(
            x.set,
            col,
            db
          )
  
        } else {
          //if filter is set, it is update mode

          
          x.filter = filterHelp(x.filter)

          
          
          let increase = false

          // check for increase mode or not
          for (key in x.set) {

            if (typeof x.set[key] == 'string' 
              && x.set[key].match(/[+-]\d+$/) ) { //'+10' or '-10'
                
                x.set[key] = Number( x.set[key] )
                increase = true
              }
          }

          if (increase) {
            //increase mode like set:{stock:'+10'}
            return xdb.increase(
              x.set,
              x.filter,
              col,
              db
            )

          } else {
            //general update
            return xdb.updates(
              x.set,
              x.filter,
              col,
              db
            )
          }
          
        }


      } else {
        //invalid if no set or to
        return '! xdev.$set: invalid input; nothing set.'
      }
      

      

      break
      //ok 20230605 m-------------------------------------


    case 'del':
      /**
       * xs.$({ del:{name:/xyz/}, from:'xdb.customer' })
       * 
       * call ==> xdb.deletes({name:/xyz/, col, db})
       */

      var [db,col] = x.from.split('.')

      return xdb.deletes(x.del, col, db)

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
        return 'xdev.xcert: wrong input'
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
      return xdb.newDb(x.newDb)
      break
      //m,ok


    case 'newCol':
      // xdev.$({ newCol:'--collection name--', db:'--db name--' })
      return xdb.newCol(x.newCol, x.db)
      break
      //m,ok


    case 'dbInsert':
      // xdev.$({ dbInsert:{...}, col:'--', db:'--'}) ...insert 1 or many
      return xdb.inserts(
        x.dbInsert, 
        x.col, 
        x.db
      )
      break
      //m,ok


    case 'dbFind':
      // xdev.$({ dbFind:{--query--}, col:'--', db:'--'})
      return xdb.find(
        x.dbFind, 
        x.col, 
        x.db
      )


    case 'dbUpdate':
      // xdev.$({ dbUpdate:{--key--:--value--}, query:{..}, col: ,db: })
      return xdb.updates(
        x.dbUpdate, 
        x.query, 
        x.col, 
        x.db
      )

    
    case 'dbIncrease':
      // xs.$({ dbIncrease:{stock:-1}, query:{..}, col: ,db: })
      return xdb.increase(
        x.dbIncrease,
        x.query,
        x.col,
        x.db
      )
        //ok m/20230606

    case 'dbDelete':
      //xs.$({ dbDelete:{key:value}, col:--, db:--})
      return xdb.deletes(x.dbDelete, x.col, x.db)




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
      return '! xdev.$: invalid input'
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

async function readF(fileName) {
  // xdev.readF(fileName)
  return xfile.read(fileName)
}

async function hasF(fileName) {
  // xdev.hasF(fileName)
  return xfile.exist(fileName)
}

async function deleteF(fileName) {
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

  return JSON.stringify(x)
}


function parseJson(j) {
  // xdev.parseJson(--json--)

  return JSON.parse(j)
}


function uuid() {
  // xdev.uuid() ...gets 12345678-1234-1234-1234-123456789012 hex
  
  return uuidv4()
}


// data model --------------------------------------

class Wrap {
  id = Date.now() + '-' + xdev.randomInt()
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
  if (filter == '' || filter == '*' || filter == 'all' || !Object.keys(filter).length ) {

    return {}

  } else if (typeof filter == 'object' && filter instanceof ObjectId) {

    //this is ObjectId, don't do things
    return filter
  
  } 



  // #2. loop all keys in the filter
  for (k in filter) { //k is key of the filter

    //ObjectId
    if (k == '_id') {
      eval(`filter = ObjectId('${filter[k]}')`)
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






//------------------------------------------------------------

module.exports = {$,random, genKeys, sha256, md5, readF, hasF, deleteF, jsonf, uuidx, randomInt, jsonify, parseJson, uuid, Wrap, v}

/* note
all works excepts the sign & verify f, seems to have problem in the xcrypto module ,20230502

all the quick-func works, m/20230504

:-) the get/set mostly work excepts:    m/20230609 
  1. get internalCode, re []
  2. set ObjectId , re error around mismatch ObjectId but samething in the get works


*/