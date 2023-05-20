//xcrypto.js 
/* 
simplify cryptography tool
v1.0 20230423
mutita.org@gmail.com


USE
  const xcrypto = require('./xcrypto.js')
  xcrypto.hash('words')
  xcrypto.hmac('words',key)
  xcrypto.random()
  xcrypto.encrypt('words',key,'salt') ..def output is base64
  xcrypto.decrypt('cipher',key,iv) ..def input is base64
  xcrypto.genKeys() ....returns kay pair obj, rsa 4096
  xcrypto.keyEncrypt(msg,pubKey) ...def output is base64
  xcrypto.keyDecrypt(cipher,priKey)
  xcrypto.sign(msg,priKey) ...def output is base64
  xcrypto.verify(msg,sig,pubKey)
  xcrypto.convert('words','utf8','base64')
*/

const crypto = require('crypto')

//1-------------------------------------------------------
async function hash(words,algor='sha256',outputFormat='hex') {
  //algor : md5 | sha1 | sha256 | sha512

  if (!algor) algor = defaultHashAlgor
  if (!outputFormat) outputFormat = defaultOutputFormat
  const hash = crypto.createHash(algor)
  hash.update(words)
  //console.log(hash.digest('hex'))
  return hash.digest(outputFormat)

}//M:ok 2023-4-22


//2----------------------------------------------------------
async function hmac(words,key,algor='sha256',outputFormat='hex') {
  if (!algor) algor = defaultHashAlgor
  if (!outputFormat) outputFormat = defaultOutputFormat 
  const hmac = crypto.createHmac(algor,key)
  hmac.update(words)
  //console.log('hmac: ' + hmac.digest('hex'))
  return hmac.digest(outputFormat)
}//ok 20230422


//3-----------------------------------------------
function random(bytes=16, outputFormat='hex') {
  const buf = crypto.randomBytes(bytes)
  //console.log(buf.toString('hex'))
  return buf.toString(outputFormat)
}//ok 20230422


//4-----------------------------------------------------------
async function encrypt( msg, key) {
  
  let msg_ = Buffer.from(msg)
  let iv = crypto.randomBytes(12)
  let key_ = Buffer.from(key,'hex')

  let cx = crypto.createCipheriv('aes-256-gcm', key_, iv)

  let cx_ = Buffer.concat(
    [iv, cx.update(msg_), cx.final(), cx.getAuthTag()]
    //iv + msgx + tag
  )

  return cx_.toString('base64')
}


//5----------------------------------------------------------
async function decrypt(cx, key) {
  
  let cx_ = Buffer.from(cx,'base64')
  let iv_ = cx_.subarray(0,12)
  let tag_ = cx_.subarray(cx_.length - 16)
  let msgx_ = cx_.subarray(12, cx_.length - 16)

  let key_ = Buffer.from(key,'hex')
  let msg_ = crypto.createDecipheriv('aes-256-gcm', key_, iv_)
  msg_.setAuthTag(tag_)

  return msg_.update(msgx_,'binary','utf8') + msg_.final('utf8')
}




//6--------------------------------------------
async function genKeys() {
  const keysPair = crypto.generateKeyPairSync(
    'rsa',
    { 
      modulusLength: 4096, //default = 2048
      
      publicKeyEncoding: {
        type: 'spki', // pkcs1 | spki 
        format: 'pem'
      },
      
      privateKeyEncoding: {
        type: 'pkcs8', // pkcs1 | pkcs8
        format: 'pem'
      }
    }
  )
  return keysPair
}//ok 20230422


//7-----------------------------------------------------------
async function keyEncrypt(msg,pubKey,outputFormat='base64') {
  const encryptedMsg = crypto.publicEncrypt(
    pubKey,
    Buffer.from(msg)
  )
  return encryptedMsg.toString(outputFormat) // hex | base64
}//ok 20230422


//8-------------------------------------------------------------
async function keyDecrypt(encMsg,priKey,inputFormat='base64') {
  const decryptedMsg = crypto.privateDecrypt(
    priKey,
    Buffer.from(encMsg,inputFormat) //something wrong here
  )
  return decryptedMsg.toString('utf-8')
}//ok 20230422


//9-------------------------------------------------
async function sign(msg,priKey) {
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(msg)
  signer.end()
  const signature = signer.sign(priKey,'base64')
  return signature
}//m,ok 20230424


//10---------------------------------------------------
async function verify(msg,signature,pubKey) {
  const verifier = crypto.createVerify('SHA256')
  verifier.update(msg)
  verifier.end()
  const verResult = verifier.verify(pubKey,signature,'base64')
  return verResult
}//m,ok 20230423



//11--------------------------------------------------
function convert(source,fromFormat,toFormat) {
  const buff = Buffer.from(source, fromFormat)
  return buff.toString(toFormat)

  /* 
  generally will use to convert between utf8,hex and base64
    xconvert('input source','utf8','hex')
    xconvert('input...','base64','utf8')
  m,ok 20230423
  */
}


//exports
/*exports.hash = hash
exports.hmac = hmac 
exports.random = random 
exports.encrypt = encrypt
exports.decrypt = decrypt
*/

module.exports = {hash, hmac, random, encrypt, decrypt, genKeys, keyEncrypt, keyDecrypt, sign, verify, convert}

/*
jwt will not make in xcrypto as it is simple enough to be used for the xdev

m, all tested ok 20230424
*/