//xcrypto.js 
/* 
simplify cryptography tool
v1.0 20230423
dev: mutita.org@gmail.com


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

function hash (words,algor='sha256',outputFormat='hex') {
  //algor : md5 | sha1 | sha256 | sha512

  if (!algor) algor = defaultHashAlgor
  if (!outputFormat) outputFormat = defaultOutputFormat
  const hash = crypto.createHash(algor)
  hash.update(words)
  //console.log(hash.digest('hex'))
  return hash.digest(outputFormat)

}//M:ok 2023-4-22


function hmac(words,key,algor='sha256',outputFormat='hex') {
  if (!algor) algor = defaultHashAlgor
  if (!outputFormat) outputFormat = defaultOutputFormat 
  const hmac = crypto.createHmac(algor,key)
  hmac.update(words)
  //console.log('hmac: ' + hmac.digest('hex'))
  return hmac.digest(outputFormat)
}//ok 20230422


function random(bytes=16, outputFormat='hex') {
  const buf = crypto.randomBytes(bytes)
  //console.log(buf.toString('hex'))
  return buf.toString(outputFormat)
}//ok 20230422


async function encrypt(words,userKey,salt,algor='aes-256-cbc',outputFormat='base64') {
  if (!salt) salt = Date.now()
  const securedKey = crypto.scryptSync(userKey,salt,32)
  //console.log(key2)
  //const iv = Buffer.alloc(16,0)
  const iv = random(8)

  const cipher = crypto.createCipheriv(algor,securedKey,iv)
  let cipherText = cipher.update(words,'utf8',outputFormat)
  cipherText += cipher.final(outputFormat)

  return {
    cipherText: cipherText,
    key: securedKey.toString('hex'),
    salt: salt,
    iv: iv,
    algorithm: algor, 
  }
}//ok 20230422


async function decrypt(cipherText,securedKey,iv,algor='aes-256-cbc',inputFormat='base64') {
  key = Buffer.from(securedKey,'hex')
  const decipher = crypto.createDecipheriv(algor,key,iv)
  let words = decipher.update(cipherText,inputFormat,'utf8')
  words += decipher.final('utf8')
  return words
}//ok 20230422


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


async function keyEncrypt(msg,pubKey,outputFormat='base64') {
  const encryptedMsg = crypto.publicEncrypt(
    pubKey,
    Buffer.from(msg)
  )
  return encryptedMsg.toString(outputFormat) // hex | base64
}//ok 20230422



async function keyDecrypt(encMsg,priKey,inputFormat='base64') {
  const decryptedMsg = crypto.privateDecrypt(
    priKey,
    Buffer.from(encMsg,inputFormat) //something wrong here
  )
  return decryptedMsg.toString('utf-8')
}//ok 20230422


async function sign(msg,priKey) {
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(msg)
  signer.end()
  const signature = signer.sign(priKey,'base64')
  return signature
}//m,ok 20230424

async function verify(msg,signature,pubKey) {
  const verifier = crypto.createVerify('SHA256')
  verifier.update(msg)
  verifier.end()
  const verResult = verifier.verify(pubKey,signature,'base64')
  return verResult
}//m,ok 20230423




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