//testCryptoJs.js 
console.log('---THIS IS TEST OF CRYPTO-JS MODULE---')

const CRYPJS = require('crypto-js')

const msg = 'Wisdom Age'
const key = '0123456789'


console.log('ORIGITAL TEXT:')
console.log(msg)
console.log()

var ct = CRYPJS.AES.encrypt( msg, key ).toString()
console.log('ENCRYPTED CODE:')
console.log(ct)

var bytes = CRYPJS.AES.decrypt(ct, key )
var originalText = bytes.toString(CRYPJS.enc.Utf8)
console.log()
console.log('DECRYPTED TEXT:')
console.log(originalText)
console.log()

//md5
console.log('MD5:')
console.log(
  CRYPJS.MD5(msg).toString()
)
console.log()

console.log('SHA-256:')
console.log(
  CRYPJS.SHA256(msg).toString()
)
console.log()

console.log('HMAC MD5, use as masterKey')
var masterKey = CRYPJS.HmacMD5( msg, key ).toString()
  console.log(masterKey)
console.log()


// test encrypt json data

var obj = {
  deeji: {
    people: [
      {name:'mutita',age:55,sex:'male',country:'thailand'},
      {name:'john',age:22,sex:'male',country:'thailand'},
      {name:'jane',age:18,sex:'female',country:'thailand'},
      {name:'palika',age:54,sex:'female',country:'thailand'},
    ],
    item:[],
    match:[]
  }
}

console.log('DB BEFORE ENCRYPT:')
console.log(obj)
console.log()

var jsonDb = JSON.stringify(obj)
var _db = CRYPJS.AES.encrypt( jsonDb, masterKey ).toString()
console.log('ENCRYPTED DB:')
console.log(_db)
console.log()

console.log('READ DATABASE:')
var rdDb = CRYPJS.AES.decrypt(_db, masterKey )
var rdDb2 = rdDb.toString(CRYPJS.enc.Utf8)
var obj2 = JSON.parse(rdDb2)
console.log(obj2)
console.log(obj2.deeji.people)

/* TEST NOTE
work --24/12/2022
*/