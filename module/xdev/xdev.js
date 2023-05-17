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
const jwt = require('jsonwebtoken')

//test///////////////////////////////////

///////////////////////////////////////


function $(x) {

  switch (Object.keys(x)[0]) {

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


    case 'random':
      // xdev.$({ random:16, format:'hex' })
      return xsec.random(x.byte, x.format)
      break
      //m,ok 20230502

    case 'encrypt':
      // xdev.$({ encrypt:'words', userKey:  ,salt:   ,algor: ,format: })
      return xsec.encrypt(x.encrypt, x.key)
      break
      //m,ok 20230502


    case 'decrypt':
      // xdev.$({ decrypt:'cipher', secureKey: ,iv: ,algor:'aes-256-cbc', format:'base64'})
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
      // xdev.$({ newDb:'db name'})
      return xdb.newDb(x.newDb)
      break
      //m,ok


    case 'newCol':
      // xdev.$({ newCol:'collection name', db:'db name' })
      return xdb.newCol(x.newCol, x.db)
      break
      //m,ok


    case 'dbInsert':
      // xdev.$({ dbInsert:{...}, col: ,db: }) ...insert 1 or many
      return xdb.inserts(x.dbInsert, x.col, x.db)
      break
      //m,ok


    case 'dbFind':
      // xdev.$({ dbFind:{query}, col: ,db: })
      return xdb.find(x.dbFind, x.col, x.db)


    case 'dbUpdate':
      // xdev.$({ dbUpdate:{key:'value'}, query:{..}, col: ,db: })
      return xdb.updates(x.dbUpdate, x.query, x.col, x.db)


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
      return 'invalid input'
  }
}

//----------quick func---------------------------------

function random() {
  // xdev.random() ...rt 16bytes, hex random codes
  return xsec.random()
}

async function genKeys() {
  // xdev.genKeys() ...rt rsa priKey & pubKey , pem format
  return xsec.genKeys()
}

function sha256(words) {
  // xdev.sha256('words') ...default sha256, hex
  return xsec.hash(words)
}

function md5(words) {
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
  return t1.toString()
}


module.exports = {$,random, genKeys, sha256, md5, readF, hasF, deleteF, jsonf, uuidx}

/* note
all works excepts the sign & verify f, seems to have problem in the xcrypto module ,20230502

all the quick-func works, m/20230504




*/