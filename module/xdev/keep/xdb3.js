// xdb3.js
/* Make a simple database that utilizing json format but it has to be secured.

structure:

  /xdb .....this is root, top
    /db
      /collection .......array
        /doc ...........object
          /data ......{key:value} in each object

command:
  #1 -- CREATE ..use when creating db only
  xdb({ create: 
          { dbName: {
              colName: [
                //put the collection's template
                { name: 'text',
                  age: 'number',
                  sex: 'text'
                  ...
                }
              ],
              colName2: [],
              colName3: [],
              ...
            },
            dbName2: {},
            dbName3: {}
          }
  })
  //create many db in the 1 command, with whole structure of each db

  #2 -- ADD ...add things to the db
  xdb({ add: {....}, to:'dbName.colName'  }) //add doc
  xdb({ add: [{..},{..}, ..], to:'db.col'  }) //add many doc
  xdb({ add: 'dbName.newColName' }) //add new collection
  xdb({ add: 'db.col', with:{status:'text}  }) 
  xdb({ 'db.people': {...}  }) //add doc to col

  #3 -- FIND
  xdb({ find:'db.people.name == j'  })
  xdb({ find:'db.people.address == thailand' })
  xdb('db.people.name == jack')

  #4 -- CHANGE
  xdb({ find:'db.people.name == j',
        change:'status = good guy'
      })

  xdb({ find:'db.people',
        rename:'note -to- remark' //rename key=note to key=remark
      })


*/

const FILE = require('fs')
const CRYP = require('crypto')

var data = {people:[
      {name:'john',age:22,sex:'male'},
      {name:'jane',age:18,sex:'female'},
      {name:'mutita',age:55,sex:'male'},
      {name:'palika',age:54,sex:'female'}
    ]    
  }

var serverid = Date.now().toString()

//writeXdb(data)
//readXdb2().then(obj => console.log(obj) )
//genKey()
//xdb()

var superKey = 
CRYP.createHash('sha256').update(serverid).digest('base64')
console.log('superKey= '+ superKey) 

console.log('hmac= '+
  CRYP.createHmac('sha256',superKey)
    .update('this is text to hash')
      .digest('base64') //can change to 'hex'
)



function xdb(obj) {
  if (typeof obj=='undefined') {
    //console.log('nothing')
    readXdb2().then( obj => {
      console.log('FILE -- read output is below')
      console.log(obj) 
      console.log(
        encrypt(
          toJson(obj)
          )
      )
    })
    //console.log(xdb)
  }
}



// receives object, converts to json, then to base64, then save
function writeXdb(obj) {
  
  var toJson = JSON.stringify(obj)
  //var buff = Buffer.from(json)
  //var dataReady = buff.toString('base64')
  
  FILE.writeFile(
    'xdb.x',
    toBase64(toJson),
    (err)=> {
      if (err) throw err 
      console.log('FILE -- saved xdb.x')
    }
  )
}

//read xdb.x then output as object to console
function readXdb() {
  FILE.readFile(
    'xdb.x',
    (err,data)=>{
      if (err) throw err 
      var getB64 = data.toString() //buff > b64
      //console.log(getB64)
      var getJson = fromBase64(getB64) //b64 > json
      //console.log(getJson)
      var getObj = fromJson(getJson) //json > obj
      console.log('FILE -- read xdb.x as output below')
      console.log(getObj)
      //return getObj
    }
  )
}

//below is promisification version 
function readXdb2() {
  return new Promise( (resolve,reject)=>{
    FILE.readFile(
      'xdb.x',
      (err,data)=>{
        if (err) reject(err)
        else {
          var getB64 = data.toString()
          var getJson = fromBase64(getB64)
          var getObj = fromJson(getJson)
          resolve(getObj)
        }
      }
    )
  })
}
//readXdb2().then(obj => console.log(obj) )


//test gen a key in base64 code, save in file key.x 
function genKey() {
  const key = 'thisisthemasterkey'
  FILE.writeFile(
    'key.x',
    toBase64(key),
    (err)=>{
      if (err) throw err 
      console.log('FILE -- saved key.x')
    }
  )
}

//convert string to b64
function toBase64(string) {
  var buff = Buffer.from(string)
  return buff.toString('base64')
}

//convert b64 to string
function fromBase64(b64) {
  const buff = Buffer.from(b64,'base64')
  return buff.toString()
}

//convert obj to json
function toJson(obj) {
  return JSON.stringify(obj)
}

//convert json to obj
function fromJson(json) {
  return JSON.parse(json)
}

// crypto
const algo = 'aes-256-cbc'
const key = CRYP.randomBytes(32)
console.log('key= '+ key.toString('base64'))
const iv = CRYP.randomBytes(16)

function encrypt(text) {
  let cipher = CRYP.createCipheriv(algo, Buffer.from(key), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return {
            text: text,
            iv:   iv.toString('base64'),
            encryptedData: encrypted.toString('base64')
          }
}





// TEST PART

/* this test work
console.log('TEST: thailand > B64 > STR')
let b64 = toBase64('thailand')
console.log(b64)
console.log( fromBase64(b64) )
*/ 



//writeXdb(data)
//readXdb2().then(obj => console.log(obj) )
//genKey()
xdb()
