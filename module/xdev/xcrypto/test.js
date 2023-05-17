//test.js
/* m, completed test 20230424, all ok */

const crypto = require('crypto')
const xcrypto = require('./xcrypto')
const jwt = require('jsonwebtoken')
const xfile = require('./xfile.js')
/*
const priKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAiQaqr4X6JWVF5dCUEu9QJX93OyLkXBng+4CZ8k2zlvBEMSrv6axbwf0Z
42ru8AdWIdb6kD0ivcPTPV+upcR2oXVUICt33qymwhM0qil2c4lHNOxUYzVeIQQt6xUM3ZAb
OPBNtuQ+tzshT3TSLdllw4HirScxBOYMbRh/wYXhuQisjOmaSZELOoFQs0jbNEN1wSmkFZxR
Nh81idpYIOZfzNaarvAodY5oz5YMvvR/2I46L0BE0haSojpGuf8drANCkQ4j8pNOF1LWbLgy
V9m22nu2wZTW4DM1ihMPRpUiLCyirsdwiS/YIUPtFI4z3Ag0F03F+1o3l7xO6RO+aVWdiQID
AQABAoIBAE5twW5bifSzhZFnlAlObpo33f+8FebdbRem4PZ+IOeot+9Iey9NVuuuuY2gXAiI
unT9/kZmp6bkGdlMFcONsrTxWehb2O1b9sqogYFP4Bt7HIWfKyHpnunY4Ytnbgi2/c3WRTUE
aR0pPASlgdN6VjPT+PFQuE7seXpMBnu27J6iCsdJuV7wrD49ppEA0iifWQRvmC3DiisLyyMx
FUtDVoyvIKaIgLE5ZJa91STOkMA6hvRsvEdbf+UUnXsOf6pnjPud46jNzgD9V43ZSFxOHcYq
LKS6SwO/QgV0DPK7r7Sl12Rl01HtsEnbUp1pC/hUPcoLWjIA5M6BJQFdQgpEKR0CgYEA7e1m
XVyoSgeG3JDg5QhbOeTSufuTjOXvVro9Ks+L4k72h6TOlVMuUcgS8o5GlLxZJ9a9GRlpitpX
D9TRt0ICDevk5AzQ981oCxz1wNNQBQNApQXyF1r/qlpZkNtUdhV44RDAq1KthTFihaAE/yvz
JBxcRfjDc/kkp6j+wUuHTQMCgYEAk28yieVzFSLi8amulQa1k6lXaJEuYMdAF2F4HaOgmC0N
kLfU224IcupsKlb7OzE0dMj4qM9ekoP1S8RtCP3thwnHLWJf1MdKbKwxpKFlaEvWWigutcm/
FRZrEaDiIkviD7eVVSyQw3OZYxUaJvs4a5J2roZMKj7/6QXhI5VfZ4MCgYBZTvtVoCorX5fn
wxon3nMf0BypYx2HjefBDjdXkoBXenxffiVtN8PzPr6d/XnQ6sIsihaBDWDolfyIHMJ7n3NV
9m38jDMEUT30rfIxZyBqQUZKq2isC6RcNX3ZOfsCOB0fnkI0DNzFWjw5HE/D2KNzspGQUkhL
iAGSTYUS2V74MQKBgFbquzSoXEwdoQUvL4kTx4Ah2TIARQMw9AvUnmd6y3ZrORAUEBy8paZ5
pQLg/INM4svmnxGGDw75VGcyicU/TgTKMu4CjNR4GNwwN6QCsjHmY5wLDF6HbWsVKFHgMvBd
JAx4AkWQXFedktPi4OQSPpTMZ8ND0SsmsN/DY5MCwJfZAoGAf42feFyW6MKwmYniPXUkphEs
TAzGkEjLufSR141jmIlkkn96bUifXbUPvrGwJfhAjv3++WvfS3t/gqR7FwTJEe+P4hLVNfZ7
7JVnn8C8B9yK0tTd/v6HykBDwIiLWZ/YCnFo3Kg6lSDc7Oc6R2ApOxBGgV625lmHnlNVVHpR
4Mw=
-----END RSA PRIVATE KEY-----`

const pubKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAiQaqr4X6JWVF5dCUEu9QJX93OyLkXBng+4CZ8k2zlvBEMSrv6axbwf0Z42ru
8AdWIdb6kD0ivcPTPV+upcR2oXVUICt33qymwhM0qil2c4lHNOxUYzVeIQQt6xUM3ZAbOPBN
tuQ+tzshT3TSLdllw4HirScxBOYMbRh/wYXhuQisjOmaSZELOoFQs0jbNEN1wSmkFZxRNh81
idpYIOZfzNaarvAodY5oz5YMvvR/2I46L0BE0haSojpGuf8drANCkQ4j8pNOF1LWbLgyV9m2
2nu2wZTW4DM1ihMPRpUiLCyirsdwiS/YIUPtFI4z3Ag0F03F+1o3l7xO6RO+aVWdiQIDAQAB
-----END RSA PUBLIC KEY-----`






// jwt
console.log('//test jwt:')
let key = xcrypto.random()
console.log('key:',key)

let sessid = xcrypto.hash(
  xcrypto.random() + Date.now(),
  'md5'
)

let serverid = xcrypto.hash(
  xcrypto.random() + Date.now(),
  'md5'
)
*/
let data = {name:'mutita',age:55,sex:'male',country:'thailand'}


/*
let xdata = jwt.sign(data,key)
xfile.write('jwtToken.txt',xdata)
let time = Date.now()

let x = {
  to: serverid,
  from: sessid,
  for: 'sales',
  data: xdata,
  time: time,
  cert: xcrypto.hmac(
    serverid + sessid + xdata + time,
    key
  )
}
console.log('//data packed with jwt token:')
console.log(x)


console.log(
  '//verify cert: ', 
  (x.cert == xcrypto.hmac(
    x.to + x.from + x.data + x.time,
    key
  ))? true:false 
)

console.log('//jwt verify output:')
console.log(
  jwt.verify(x.data,key, (err,data) => {
    return data? data: false 
  })
)*/

//symetric

xcrypto.encrypt(
  JSON.stringify(data),
  'thisismykey', //userKey
  xcrypto.random(), //this is salt
  'aes-256-cbc'

).then(out => {
  console.log('//sysmetric encrypted:')
  console.log(out, out.length)

  xcrypto.decrypt(
    out.cipherText,
    out.key,
    out.iv,
    'aes-256-cbc'

  ).then(text => console.log(
    '//symetric decrypt:', text
  ))

})
/**
 * cbc works, gcm not works m/20230513
 */


/*
// keys
let keysPair
xcrypto.genKeys().then(k => {
  keysPair = k
  console.log('//keys test')
  console.log(k)  /*
  xfile.write('pubKeyRsa.pem', keysPair.publicKey)
  xfile.write('priKeyRsa.pem', keysPair.privateKey)
*/
  //key
  //let jdata = JSON.stringify(data)
/*
  xcrypto.keyEncrypt(jdata, k.publicKey)
  .then(ct => {
    console.log('//key encrypt:')
    console.log(ct)

    xcrypto.keyDecrypt(ct, k.privateKey).then(text => {
      console.log('//key decrypted:')
      console.log(text)
    })
  })

*/


/*
  //sign & ver
  xcrypto.sign(jdata,k.privateKey).then(sig => {
    console.log('//signature:')
    console.log(sig)
    xfile.write('signature.txt',sig)

    //verify
    xcrypto.verify(jdata, sig, k.publicKey).then(out => 
      console.log('//verify output:', out))
  })
*/


//})


// conversion
/*
let words = 'this is thailand'
let hex = xcrypto.convert(words,'utf8','hex')
let b64 = xcrypto.convert(hex,'hex','base64')
let back = xcrypto.convert(b64,'base64','utf8')
console.log('//conversion:')
console.log(words +'\n'+ hex +'\n' + b64 +'\n' + back)

*/



/* test GCM = ok, m/20230513

let msg = JSON.stringify(
  {name:'mutita',age:55,sex:'male',living:'nakorn pathom, thailand'}
)

let key = xcrypto.hash('mutita')
console.log(key, key.length)

xcrypto.gcmEnc(msg,key).then(
  cipher => {
    console.log(cipher, cipher.length)

    xcrypto.gcmDec(cipher, key).then(
      msg => console.log(msg)
    )
  } 
)
*/
//ok, m/




/* test GCM 2 = ok, m/20230513


let msg = JSON.stringify(
  { name:'mutita',
    age:55,
    sex:'male',
    living:'nakorn pathom, thailand',
    career:'advisor'
  }
)


let key = xcrypto.random(32)
let iv = xcrypto.random()

let key_ = Buffer.from(key, 'hex')
console.log('key: ', key)
let iv_ = Buffer.from(iv, 'hex')
let tagLength = 16

let msg_ = Buffer.from(msg, 'utf-8')

let cipher = crypto.createCipheriv(
  'aes-256-gcm', 
  key_, 
  iv_, 
  tagLength
)

let cipher_ = Buffer.concat(
  [ cipher.update(msg_),
    cipher.final(),
    cipher.getAuthTag()
  ]
)

console.log('cipher: ', cipher_.toString('base64'))


// decrypt

let cipher2 = cipher_.slice(0, cipher_.length - tagLength)
let authTag = cipher_.slice(cipher_.length - tagLength, cipher_.length)

let decipher = crypto.createDecipheriv(
  'aes-256-gcm',
  key_,
  iv_,
  tagLength
)

decipher.setAuthTag(authTag)

let decipher_ = Buffer.concat(
  [ decipher.update(cipher2),
    decipher.final()
  ]
)

console.log('decipher: ', decipher_.toString('utf-8'))

*/