// xdev_b.js 
// dev tools for browser side
// mutita.org@gmail.com

const xdev = {
  note: 'this is an object to work on browser side',
  version: '0.5',
  serverPostUrl: '/post_'
}

//data model

class Wrap {
  id = Date.now() + '-' + xdev.random()
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









// the $ interface
xdev.$ = async function(x) {

  switch (Object.keys(x)[0]) {

    case 'xcert':
      /**
       * xdev.$({xcert:--msg--, key:--key--, sig:--sig-- })
       * to sign just put msg & key
       * to verify put all the msg, key and signature
       */

      if (x.xcert && x.key && !x.sig) {
        //sign
        return xdev.xcert(x.xcert, x.key)

      } else if (x.xcert && x.key && x.sig) {
        //verify
        return xdev.xcert(x.xcert, x.key, x.sig)
      
      } else {
        return 'ERROR: wrong input'
      }

      break
      //ok, m20230519


    case 'genKey':

      if (x.genKey == 'aes') {
        return xdev.genKey()
      }

      break


    case 'encrypt':
      return xdev.encrypt(x.encrypt, x.key)
      break


    case 'decrypt':
      return xdev.decrypt(x.decrypt, x.key)
      break

      
  }
}




//-----------crypto-------------------------------------
// default algor = AES-GCM

//1-----------------------------------------
xdev.random = function () {
  //  xdev.random()

  const arr = new Uint32Array(1) //1
  return self.crypto.getRandomValues(arr)
}//ok


//2-----------------------------------------
xdev.uuid = function () {
  //  xdev.uuid()

  return self.crypto.randomUUID()
}//ok


//3-----------------------------------------
xdev.hash = async function (words, algor=256) {
  //  xdev.hash() | ...hash(2) | ...hash(256) | ...so on

  //make it easier to set the algorithm
  switch (algor) {
    case 1:
      algor = 'SHA-1' //160 bit
      break

    case 2:
      algor = 'SHA-256' //256 bit
      break

    case 384:
      algor = 'SHA-384' //384 bit
      break

    case 3:
      algor = 'SHA-384' 
      break

    case 512:
      algor = 'SHA-512' //512 bit
      break

    case 5:
      algor = 'SHA-512' 
      break

    default:
      algor = 'SHA-256'
  }

  //prep words & hash
  const te = new TextEncoder().encode(words)
  const buffer = await crypto.subtle.digest(algor, te)

  //buffer to hex
  const arr = Array.from(new Uint8Array(buffer))

  const hex = arr.map(
    (b) => b.toString(16).padStart(2,'0')
  ).join('')

  return hex
}//ok



//4-------------------------------------------------
xdev.xcert = async function (msg, key, sig) {
  /**
   * Certifies message using hash/sha256. This f does 2 things (1) sign and (2) verify. If we put msg & key this is the sign, if we put msg, key & sig then this is verify
   * 
   * USE 
   *      xdev.xcert('--words--','--key--','--signature--')
   * 
   * FORMAT
   *      the sign returns hex of sha-256 (64 chars)
   *      the verify returns true|false
   */

  if (msg && key && !sig) {
    //sign
    if (typeof msg != 'string' || typeof key != 'string') {
      return 'ERROR: input type'
    }

    return xdev.hash(msg + key)
  
  } else if (msg && key && sig) {
    //verify
    if (typeof msg != 'string' || typeof key != 'string' || typeof sig != 'string') {
      return 'ERROR: input type'
    }

    let _sig = await xdev.hash(msg + key)
    return (_sig == sig)? true:false

  } else {
    return 'ERROR: wrong input'
  }

  //ok, m20230519
}









//5-----------------------------------------
xdev.genKey = async function (algor='aes') {
  //  xdev.genKey('rsa'|'hmac'|'aes'|'ecdsa')

//RSA-OAEP
  if (algor=='rsa') {
    return await window.crypto.subtle.generateKey(
      {
        name:'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1,0,1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt','decrypt']
    )//ok
  
//HMAC    
  } else if (algor=='hmac') {
    const key = await window.crypto.subtle.generateKey(
      { name:'HMAC', 
        hash:{name:'SHA-256'} //256*|384|512
      },  
      true,
      ['sign','verify']
    )//ok, get 1 key

    key.export = await xdev.exportKey(key,'hmac')
    return key
    //ok
  
//ECDSA    
  } else if (algor=='ecdsa') {
    return await crypto.subtle.generateKey(
      { name:'ECDSA', 
        namedCurve:'P-384' 
      },
      true,
      ['sign','verify']
    )//ok
  
//AES-GCM    
  } else if (algor=='aes') {
    //will use this as a default symmetric key
    const key = await crypto.subtle.generateKey(
      { name:'AES-GCM', 
        length:256 
      },
      true,
      ['encrypt','decrypt']
    )

    key.export = await xdev.exportKey(key)
    return key
    //ok

  }
  
}


// internal use-----------------------------------
function b64ToBuf(b64) {
  var bi = atob(b64)
  var len = bi.length
  var bytes = new Uint8Array(len)
  for (i=0; i<len; i++) {
    bytes[i] = bi.charCodeAt(i)
  }
  return bytes.buffer
}

function hex2buf(hex) {
  var pairs = hex.match(/[\dA-F]{2}/gi)
  
  var int = pairs.map(s => {
    return parseInt(s,16)
  })

  var arr = new Uint8Array(int)
  //console.log(arr)
  return arr.buffer
}


//6-----------------------------------------
xdev.enc = async function ( msg, key) {
  return xdev.encrypt( msg, key)
}//ok, make it a little bit shorter



xdev.encrypt = async function( msg, key) {
  //AES-GCM

  let key_ = hex2buf(key)
  let keyx = await crypto.subtle.importKey(
    'raw', key_, 'AES-GCM', false, ['encrypt']
  )

  let iv_ = crypto.getRandomValues(new Uint8Array(12))

  let cx = await crypto.subtle.encrypt(
    { name:'AES-GCM',
      iv: iv_,
      //additionalData: ? 
      tagLength: 128
    },
    keyx,
    new TextEncoder().encode(msg)
  )

  return xdev.buffer2base64(iv_) + xdev.buffer2base64(cx)
}



/*
xdev.encrypt = async function (msg, key, cert='', algor='aes') {
  //  xdev.encrypt(msg, key || msg, key, 'aes')
  //  aes default mode is GCM
  //  in aes algor, we put iv after the cipher: cipherrrrrr.ivvvvv so just put the cipher in the decrypt f

  //check msg
  if (typeof msg == 'object') {
    msg = JSON.stringify(msg)
  }
  const msg_ = new TextEncoder().encode(msg)

  //check additional data for GCM
  const cert_ = xdev.utf8ToBuffer(cert)


//RSA-OAEP ---------------------------------------------- 
  if (algor=='rsa') {
    const buffer = await window.crypto.subtle.encrypt(
      { name:'RSA-OAEP' },
      key,
      msg_
    )
  
    return xdev.buffer2base64(buffer) //xdev.buffer2hex(buffer)
    //ok, at msg 6xx characters gets 'uncaugth error', at half size no problem

//AES-GCM ------------------------------------   
  } else if (algor=='aes') {
    //this is default encryption

    //check the key if it's obj or base64, make it obj
    if (typeof key != 'object' && key.match(/^[0-9a-zA-Z+/=]+$/)) {
      // so it is base64 means the exported key
      key = await xdev.importKey(key)
    }

    const iv_ = crypto.getRandomValues(new Uint8Array(12))
    
    const msgx_ = await crypto.subtle.encrypt(
      { name: 'AES-GCM', 
        iv: iv_,
        additionalData: cert_, //this is additional msg to authen
        tagLength: 128
      },
      key, //key obj
      msg_
    )

    //pack output in base64 , separate cipher & iv with .
    const cx = xdev.buffer2base64(msgx_)
    const ivx = xdev.buffer2base64(iv_)

      //if there's additional data added it at the last
      return {  seal: cx + '.' + ivx ,
                cert: cert //AD or AAD
              }   

    //ok, this aes has no problem with msg size 6xx , can encrypt and decrypt back perfectly

    //ok, changed output format, m/20230515
  }//ok

  /*
  changed default to AES-GCM and included the 'addData' into it, tested everything works fine, m/20230514 
  
  made the output like this: [cipher].[iv].[additional data/plaintext] , ok m/

  changed output format to: 
    {cipher:'base64', additionalData: 'plain text'}

  changed to : {seal:[cx.iv], cert:[additional data]}

  */
//}*/


//7-----------------------------------------
xdev.buffer2hex = function (buffer) {
  //  xdev.buffer2hex(buffer) ...gets hex code

  //buffer to hex
  const arr = Array.from(new Uint8Array(buffer))

  const hex = arr.map(
    (b) => b.toString(16).padStart(2,'0')
  ).join('')

  return hex    
}//ok



//8-----------------------------------------
xdev.buffer2base64 = function (buffer) {
  //  xdev.buffer2base64(buffer) ...gets base64 codes

  const st = String.fromCharCode.apply(
    null,
    new Uint8Array(buffer)
  )
  return window.btoa(st)
}//ok



//9-----------------------------------------
xdev.base64ToBuffer = function (base64) {
  //  xdev.base64ToBuffer(base64) ...gets buffer

  return new Uint8Array(
    atob(base64).split('').map(c => c.charCodeAt(0))
  )
}//ok



//10-----------------------------------------
xdev.buffer2utf8 = function (buffer) {
  //  xdev.buffer2utf8(buffer) ...gets utf8 codes

  return new TextDecoder('utf-8').decode(
    new Uint8Array(buffer)
  )
}//ok









//11------------------------------------------------------
xdev.dec = async function (cx, key) {
  return xdev.decrypt(cx, key)
}


xdev.decrypt = async function (cx, key) {
  /**
   * the input cx has format: [iv(16)][msgx][tag(16)]
   */

  let cx_ = b64ToBuf(cx)
  let cx2_ = new Uint8Array(cx_)
  let iv_ = cx2_.subarray(0,12)
  let msgx_ = cx2_.subarray(12)

  let key_ = hex2buf(key)
  let keyx = await crypto.subtle.importKey(
    'raw', key_, 'AES-GCM', false, ['decrypt']
  )

  let msg_ = await crypto.subtle.decrypt(
    {name:'AES-GCM', iv: iv_}, keyx, msgx_
  )

  return new TextDecoder().decode(msg_)
}


/*
xdev.decrypt = async function (seal, key, cert='', algor='aes') {
  //  xdev.decrypt(cipher, key | cipher, key, 'aes')
  //  for aes the iv is already attached in the cipher codes so don't need to do anything about it


  if (typeof seal != 'string') return 'ERROR! wrong input'

  if (algor=='rsa') algor = 'RSA-OAEP'
  if (algor=='aes') algor = 'AES-GCM'





//RSA-OAEP --------------------------------------
  if (algor=='RSA-OAEP') {
    const cipher_ = xdev.base64ToBuffer(cipher)

    const deci = await window.crypto.subtle.decrypt(
      {name: algor},
      key, //priKey ...key obj
      cipher_
    )

    //if output is json, make it object
    const words = xdev.buffer2utf8(deci)
    try {
      return JSON.parse(words)
    } catch {
      return words
    }//should be ok as tested on the aes done
    //ok, 


//AES-GCM* -----------------------------   
  } else if (algor=='AES-GCM') {
    //this is default decryption

    //check the key if its obj or base64, make to key obj
    if (typeof key != 'object' && key.match(/^[0-9a-zA-Z/+=]+$/)) {
      //this is base64 exported key, so make it key obj
      key = await xdev.importKey(key)
    }//out of this assumes it is key obj

    //separate the cipher
    const block = seal.split('.')
    const msgx = block[0]
    const ivx = block[1]


    //put cipher & iv to buffers
    const msgx_ = xdev.base64ToBuffer(msgx)
    const ivx_ = xdev.base64ToBuffer(ivx)
    const cert_ = xdev.utf8ToBuffer(cert)
    

    const msg_ = await crypto.subtle.decrypt(
      { name: algor, 
        iv: ivx_ ,
        additionalData: cert_,
        tagLength: 128
      },
      key, //...key obj
      msgx_
    )

    //if json convert to x
    const msgOk = xdev.buffer2utf8(msg_)

    return {
      msg: msgOk,
      cert: cert
    }
   
    //ok, changed output format , m/20230515
  }

  /*
  make the AES-GCM default and include the 'addData', tested all OK, m/20230514 
  
  tested the [cipher].[iv].[additional data] decryption ok, m/

  changed output of enc to {cipher: ,additionalData: } and output of the dec is just returning the decipher, that's it. m/
  */

//}//ok



//12-----------------------------------------
xdev.exportKey = async function(key, format='aes') {
  //  xdev.exportKey(key, 'priKey'|'pubKey'|'raw')
  //  output is base64

  if (key && format) {
    if (format=='priKey') format = 'pkcs8'
    if (format=='pubKey') format = 'spki'
    //for jwk just put 'jwk' at the format
    //for AES , put 'raw' at the format
    if (format.match(/aes|hmac/)) format = 'raw'

    const key_ = await window.crypto.subtle.exportKey(
      format,
      key
    )

    return xdev.buffer2base64(key_) //don't put the PEM wrapper  
  
  } else {
    return 'ERROR! wrong input'
  }

  
}//ok for pri & pub keys, now doing for jwk



//13-----------------------------------------
xdev.importKey = async function(key,format='aes') {
  //  xdev.importKey(key || key,'pubKey'|'aes'|'raw')  

  //get the base64 in and convert into a buffer
  const bi = window.atob(key)
  const buffer = new ArrayBuffer(bi.length)
  const view = new Uint8Array(buffer)

  for (i=0; i < bi.length; i++) {
    view[i] = bi.charCodeAt(i)
  }

  //now buffer is ready to use

//RSA-OAEP PKCS8 ----------------------------- 
  if (format=='priKey') { // ! needs revise
    return window.crypto.subtle.importKey(
      'pkcs8',
      buffer,
      { name:'RSA-OAEP', hash:'SHA-256' }, //changed from RSA-PSS
      true,
      ['decrypt'] //changed from sign
    )//ok
  
//RSA-OAEP SPKI ---------------------------   
  } else if (format=='pubKey') {
    return window.crypto.subtle.importKey(
      'spki',
      buffer,
      { name:'RSA-OAEP', hash:'SHA-256' },
      true,
      ['encrypt']
    )//ok
  
//AES-GCM* ------------------------------------------   
  } else if (format.match(/aes/)) { //cut raw out
    return crypto.subtle.importKey(
      'raw',
      buffer,
      'AES-GCM',
      true,
      ['encrypt','decrypt']
    )//ok
  
//HMAC -------------------------------   
  } else if (format=='hmac') {
    return crypto.subtle.importKey(
      'raw',
      buffer,
      {name:'HMAC', hash:'SHA-256'}, //256|384|512
      true,
      ['sign','verify']
    )
  }
}


//14----------------------------------------------
xdev.sign = async function (msg, key, algor='hmac') {
  // take HMAC is the defaul sign algorithm

  //check the msg
  if (typeof msg == 'object') {
    msg = JSON.stringify(msg)
  }
  const msg_ = new TextEncoder().encode(msg)

//ECDSA  
  if (algor=='ecdsa') {
    const buffer = await crypto.subtle.sign(
      { name:'ECDSA', hash:{name:'SHA-384'} },
      key,
      msg_
    )
  
    return xdev.buffer2base64(buffer)
    //ok

//HMAC    
  } else if (algor=='hmac') {
    //this is default for signing

    //if key not obj make it obj
    try {
      if (key.match(/^[0-9a-zA-Z/=+]+$/)) {
        //the key is the exported one not obj
        key = await xdev.importKey(key,'hmac')
      }
    } catch {
      //the key is obj
    }
    

    const buffer = await crypto.subtle.sign(
      'HMAC',
      key,
      msg_
    )

    //return xdev.buffer2base64(buffer)
    return xdev.buffer2hex(buffer)
    //ok
  }
  
  
}


//15-------------------------------------------------
xdev.verify = async function (msg, signature, key, algor='hmac') {
  // HMAC is default verify algor
  //const msg_ = new TextEncoder().encode(msg)

  //check msg
  if (typeof msg == 'object') {
    msg = JSON.stringify(msg)
  }

//ECDSA  
  if (algor=='ecdsa') {
    return await crypto.subtle.verify(
      { name:'ECDSA', hash:{name:'SHA-384'} },
      key,
      xdev.base64ToBuffer(signature),
      new TextEncoder().encode(msg)
    )
    //ok

//HMAC    
  } else if (algor=='hmac') {
    //default for verifying

    //check key if not obj, make it obj
    try {
      if (key.match(/^[0-9a-zA-Z/+=]+$/)) {
        //it's base64
        key = await xdev.importKey(key,'hmac')
      }
    } catch {
      //it's not base64, assumes the correct key
    }
    

    return await crypto.subtle.verify(
      'HMAC',
      key,
      //xdev.base64ToBuffer(signature),
      hex2buf(signature),
      new TextEncoder().encode(msg)
    )
    //ok

  }
}


//16----------------------------------------------------------
xdev.uuidx = function() {
  //gen special uuid which is simply a timestamp but no dup
  //to prevent dup, we take t2 not t1
  let t1 = t2 = Date.now()
  while (t2 == t1) { t2 = Date.now()}
  return t2
}//ok


//17---------------------------------------------
xdev.utf8ToBuffer = function (msg) {
  return new TextEncoder().encode(msg)
}//ok



//18---------------------------------------------
xdev.passKey = async function (passHash) {
  //generate AES-GCM key from a password, this key will be unexactable, and should be destroyed at unnecessarily.

  //key material
  const passHash_ = new TextEncoder().encode(passHash)
  const keyMat = await crypto.subtle.importKey(
    'raw',
    passHash_,
    'PBKDF2',
    false,
    ['deriveBits','deriveKey']
  )

  //key
  return crypto.subtle.deriveKey(
    { name:'PBKDF2',
      salt: xdev.utf8ToBuffer('xTKrg5fX-9l_'), //fix this
      iterations: 100000,
      hash:'SHA-256'  
    },
    keyMat,
    {name:'AES-GCM', length:256},
    false, //true,
    ['encrypt','decrypt']
  )
  /*
    this f should take the hash-of-password as input and then produce the password-key. The key can be produce multiple time, as long as the password is corrected, then it can enc/dec same results.
  */
}//ok



//19----------------------------------------------
xdev.promptKey = async function () {
  //gen an AES-GCM key from user prompt's password

  return await xdev.passKey(
    await xdev.hash(
      prompt('password:')
    )
  )
}//ok


//20------------------------------------------------
xdev.promptHash = async function () {
  //prompt to get words and gen hash from it

  return xdev.hash(
    prompt('words:')
  )
}




//21------------------------------------------------
//randomW is a random code tha containing only a-zA-Z nothing else
xdev.randomW = function (length=16) {
  //gen a js var style code contains only a-zA-Z

  let code = ''
  for (i=0; i<length; i++) {
    code += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(
      Math.floor(
        Math.random() * 52
      )
    )
  }
  return code
}//ok



//22--------------------------------------------
xdev.password = function (length=12) {
  //gen random password from 92 characters

  let pass = ''
  for (i=0; i<length; i++) {
    pass += `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'"!~-+-*/\|&%#@^.,:;<>(){}[]`.charAt(
      Math.floor(
        Math.random() * 92
      )
    )
  }
  return pass
}//ok



//23---------------------------------------------
xdev.vaultAdd = async function (x) {
  // x = {label:value, label2:..., } ...can put many key:value pairs
  //the output is at xdev.vault in base64 encrypted format

  //check input
  if (!x || typeof x != 'object' || !Object.keys(x).length
    || Array.isArray(x)) return 'ERROR/vaultAdd: invalid input'

  //reject if found any empty label 
  for (label in x) {
    if (!x[label] || x[label] == '' 
      || !Object.keys(x[label]).length ) return 'ERROR/vaultAdd: invalid label' 
  }


  //get labels

  if (Object.keys(x).length > 1) {
    //has several labels-----------------------

    if (!xdev.vault) {
      //firstly add
      xdev.vault = await xdev.enc(
        JSON.stringify(x), 
        await xdev.promptHash()
      )

    } else {
      //more add

      let key = await xdev.promptHash()
      let gold = JSON.parse(
        await xdev.dec(xdev.vault, key)
      ) 

      for (label in x) {
        if (label in gold) {
          //this is dup, just skip
          console.log(`ERROR/vaultAdd: lebel '${label}' is already existed, skipped`)
        } else {
          gold[label] = x[label]
        }
      }

      xdev.vault = await xdev.enc(
        JSON.stringify(gold), 
        key
      )
    }

    

  } else {
    //has only 1 label-------------------------
     
    //if vault not already existed
    if (!xdev.vault) {

      //firstly add
      xdev.vault = await xdev.enc(
        JSON.stringify(x),  
        await xdev.promptHash()
      )

    } else {
      //if vault already existed
      let key = await xdev.promptHash()
      
      let gold = JSON.parse(
        await xdev.dec(xdev.vault, key)
      ) 
      let label = Object.keys(x)

      if (label in gold) {
        //dup
        return 'ERROR/vaultAdd: label already existed, skipped'

      } else {
        //label not duplicated
        gold[label] = x[label]

        xdev.vault = await xdev.enc(
          JSON.stringify(gold), 
          key
        )
      }
    }
  }
 
}//ok



//24----------------------------------------------
xdev.vaultGet = async function (label) {
  //label is the key of the obj that saved in the vault

  if (!label || typeof label != 'string') return 'ERROR/vaultGet: invalid input'

  let gold = JSON.parse(
    await xdev.dec( 
      xdev.vault, 
      await xdev.promptHash()
    )
  ) 
  
  if (label in gold) {
    return gold[label]
  } else {
    return 'ERROR/vaultGet: no data for this label'
  }
}//ok

/* vault
everything should be fine. The vaultAdd() validates for no empty input as well as the empty labels. The duplicate label also not allowed.

can put the sophisticated obj in, and the f keeps right there in the vault. When do vaultGet() just get it back perfectly.

m/20230509

*/


//25----------------------------------------------
/* if put {people: {...} }   the people is the collection
 */
xdev.db = function (x) {

  var db = {} //this is main db v name

  if (x) {
    //add mode

    //admin works------------------------------------------
    if (Object.keys(x)[0].match(/^_\w+$/)) {
    
      let cmd = Object.keys(x)[0]

      if (cmd == '_delete') {
        // {_delete:'people'}  ..delete collection
        // {_delete:} 
        db = read()

        if (typeof x._delete == 'string') {
          //delete col
          delete db[x._delete]
          write()

        } else if (typeof x._delete == 'object') {
          //delete doc, eg {_delete:{ people:{name:'mutita'} }}
          let colName = Object.keys(x._delete)[0] //people
          let docKey = Object.keys(x._delete[colName])[0] //name

          let index = db[colName].findIndex(r => r[docKey] == x._delete[colName][docKey])

          db[colName].splice(index,1)
          write()

        } else {
          return 'invalid input'
        }
      }//ok



    } else {
      //non admin-----------------------------------------

      if (!dbExist() ) {
        //new db
  
        //let db = {}
        
        for (col in x) {
          db[col] = []
  
          if (Array.isArray(x[col])) { //many docs
  
            for (doc of x[col]) {
              doc._id = xdev.uuidx() //assign id to each doc
              db[col].push(doc)
            }
  
          } else { //1 doc
            x[col]._id = xdev.uuidx()
            db[col].push(x[col]) 
          }
        }
    
        write()
      
      } else {
        //existing db
        //x = {people: {name:'   ', ...}}    add 1 doc
        //x = {people: [{...},{...}, ...]}   add many docs 
        db = read()
  
        for (col in x) {
          if (col in db) {
            //already have this collection in the db, push new
  
            if (Array.isArray( x[col] )) {
              //add many docs to existing col
              for (doc of x[col]) {
                doc._id = xdev.uuidx()
                db[col].push(doc) //push into existing col
              } 
  
            } else {
              //add 1 doc to existing col
              x[col]._id = xdev.uuidx()
              db[col].push( x[col] )
            }
  
          } else {
            //new col
            db[col] = []
  
            if (Array.isArray( x[col] )) {
              //newly add many docs
  
              for (doc of x[col]) {
                doc._id = xdev.uuidx()
                db[col].push(doc)
              }
  
            } else {
              //newly add 1 doc
              x[col]._id = xdev.uuidx()
              db[col].push(x[col]) //make it in a
            }
          }
        }
        write()
      }


    }

    


  } else {
    //read mode-------------------------------------
    return read()
  }

  
  //helper func--------------------------
  function read() {
    return JSON.parse(
      localStorage.getItem('xdev_db')
    )
  }

  function write() {
    localStorage.setItem(
      'xdev_db',
      JSON.stringify(db) 
    )
  }

  function dbExist() {
    return localStorage.getItem('xdev_db')
  }


}


//26--------------------------------------------------
xdev.atime = function (same='hour') {

  let t = new Date()
  let y = t.getFullYear()
  let m = t.getMonth() >= 10 ? t.getMonth() : '0'+t.getMonth()
  let d = t.getDate() >= 10 ? t.getDate() : '0'+t.getDate()
  let hour = t.getHours() >= 10 ? t.getHours() : '0'+t.getHours()
  let min = t.getMinutes() >= 10 ? t.getMinutes() : '0'+t.getMinutes()

  let tcode = 0

  switch (same) {
    case 'min':
      tcode = Date.parse(`${y}-${m}-${d}t${hour}:${min}`)
      break

    case 'hour':
      tcode = Date.parse(`${y}-${m}-${d}t${hour}:00`)
      break

    case 'day':
      tcode = Date.parse(`${y}-${m}-${d}`)
      break

    case 'week':
      d = t.getDate() - t.getDay()
      d = d >= 10 ? d : '0'+d
      tcode = Date.parse(`${y}-${m}-${d}`) //sunday

    case 'month':
      tcode = Date.parse(`${y}-${m}`)
      break

    case 'year':
      tcode = Date.parse(`${y}`)
      break

    default:
      return 'wrong input'
  }

  return tcode
  

}



//27--------------------------------------------------
xdev.acode = async function (t=24) {

  switch (t) {
    case 60:
      t = 'min'
      break

    case 24:
      t = 'hour'
      break

    case 31:
      t = 'day'
      break

    case 7:
      t = 'week'
      break

    case 12:
      t = 'month'
      break

    case 365:
      t = 'year'
      break

    default:
      t = 'hour' //or 24
  }

  return await xdev.hash(
    document.body + xdev.atime(t)
  )
}



//28------------------------------------------
xdev.send = async function (wrap, urlToSendTo=xdev.serverPostUrl) {
  //seal the data and wrap it and send to the server

  //A - check server post url
  if (urlToSendTo == '') {
    return 'invalid input'
  }

  //B - ready & proceed
  xdev._send = {wrap: wrap} //keep wrap for ref

  fetch(
    urlToSendTo,
    {
      method:'POST',
      headers: {'Content-Type':'application/json; charset=utf-8'},
      body: JSON.stringify(wrap)
    }
  
  ).then( resp => {
    //console.log(resp) //resp obj
    return resp.json() //make it json
  
  }).then( resp => {
    //work on the resp here
    xdev._send.resp = resp
    //console.log(resp)

    //verify the msg from xserver
    if (resp.cert) {
      //has certification

      let cert = resp.cert
      resp.cert = ''
  
      xdev.$({
        xcert: JSON.stringify(resp),
        key: core.security.salt,
        sig: cert
      })
  
      .then(certified => {
        xdev._send.resp.verified = certified
        xdev._send.resp.cert = cert
  
        if (certified) {
          //true
  
        } else {
          //false
        }
  
        console.log(
          xdev._send.resp 
        )
      })

    } else {
      //has no cert
      console.log('invalid message')
    }
    


  })

}//ok /m 20230512 



//29-----------------------------------------------------
xdev.readForm = function (formid) {
  // v0.5 --read form's input then return x of all filled data

  //make it smarter by auto recog all input of the form, so just put the formid to this func and it does the rest
  /* 
    use:
      onclick="readForm2('#formid').then(obj => console.log(obj)"
  */ 

  let formEl = document.querySelector(formid)
  let allinputs = formEl.elements 
  let outputObj = {}

  for (i = 0 ; i < allinputs.length ; i++) {

    if (allinputs[i].type == 'radio') { 
      
      if (allinputs[i-1].type != 'radio') { //if same, skip
        outputObj[ allinputs[i].name ] = 
          formEl[ allinputs[i].name ].value + validCheck()
      }

    } else if (allinputs[i].type == 'checkbox') {
      
      if (allinputs[i].checked) {

        if (outputObj[ allinputs[i].name ] == '' || 
            outputObj[ allinputs[i].name ] == undefined) 
        {
          outputObj[ allinputs[i].name ] = 
            allinputs[i].value 
        } else {
          outputObj[ allinputs[i].name ] += ',' + allinputs[i].value 
        }

      } else {
        //unchecked
        if (outputObj[ allinputs[i].name ] == undefined) {
          outputObj[ allinputs[i].name ] = ''
        }
      }
    } else {
      //this for ther types
      outputObj[ allinputs[i].name ] =   
        allinputs[i].value + validCheck()
    }
   
    function validCheck() {
      if (allinputs[i].hasAttribute('_invalid'))
        return '<invalid=' + allinputs[i].getAttribute('_invalid') + '>'
      else 
        return ''
    }
  }
  //console.log(outputObj)
  outputObj._valid = true 
  for (i of allinputs) {
    if (i.hasAttribute('_invalid')) {
      outputObj._valid = false  
    } 
  }

  return outputObj


  //done
  //done, added ...<invalid=.....> to each field that still be invalid, and put property _invalid:true into the outputObj
  //changed that every output from readForm2() will have _valid prop that contaning true or false so that further program can check its validity.


}//ok, m/20230512


//30-----------------------------------------
xdev.jsonify = function (x) {
  /**
   * make little shorter of the JSON.stringify()
   */

  return JSON.stringify(x)
}


//31-----------------------------------------
xdev.parseJson = function (json) {
  /**
   * little shorter JSON.parse()
   */

  return JSON.parse(json)
}











// test AES-GCM ---------------------------------
/**
 * ok, m/20230516 
 * tested enc in nodejs and copy output to dec in browser result good
 */
/*
function b64ToBuf(b64) {
  var bi = atob(b64)
  var len = bi.length
  var bytes = new Uint8Array(len)
  for (i=0; i<len; i++) {
    bytes[i] = bi.charCodeAt(i)
  }
  return bytes.buffer
}

function hex2buf(hex) {
  var pairs = hex.match(/[\dA-F]{2}/gi)
  
  var int = pairs.map(s => {
    return parseInt(s,16)
  })

  var arr = new Uint8Array(int)
  //console.log(arr)
  return arr.buffer
}

async function decGcm(cx,key) {
/**
 * cx: cipherText, base64 included the msgx,iv,tag already
 * key: hex, 64 char
 * output is msg or words
 */
/*
  //prep the cx
  var cx_ = b64ToBuf(cx)
  var cx2_ = new Uint8Array(cx_)
  var iv_ = cx2_.subarray(0,12)
  var msgx_ = cx2_.subarray(12)

  //key
  var key_ = hex2buf(key) //hash-hex > buffer
  var keyx = await crypto.subtle.importKey(
    'raw',key_,'AES-GCM',false,['decrypt'])

  //decrypt
  var msg_ = await crypto.subtle.decrypt(
    {name:'AES-GCM', iv:iv_}, keyx, msgx_
  )

  return new TextDecoder().decode(msg_)

/**
 * ok, dec cx from server/node good. m/
 */
/*
}



async function encGcm(msg, key) { //cx:b64, key:hex

  //key
  var key_ = hex2buf(key)
  var keyx = await crypto.subtle.importKey(
    'raw',key_,'AES-GCM',false,['encrypt'])

  //prep
  const iv_ = crypto.getRandomValues(new Uint8Array(12))
  
  var cx = await crypto.subtle.encrypt(
    { name: 'AES-GCM', 
      iv: iv_,
      //additionalData: cert_, //this is additional msg to authen
      tagLength: 128 //128 bits = 16 bytes
    },
    keyx, //key obj
    new TextEncoder().encode(msg)
  )

  return xdev.buffer2base64(iv_) + xdev.buffer2base64(cx)
/**
 * ok, m/20230516
 */
/*
}
*/














/*NOTE
Most of things is done, can say this is a prototype version or v0.5.

1. the RSA key is set to OAEP which work only for encrypt/decrypt, this is default for RSA. For asymmetric mode.

2. the AES-CGM is default for genKey(), encrypt(), decrypt() and default for symmetric mode.

3. HMAC is default for signing & verifying.

4. genKey() for RSA and AES, it automatically export the key and add to the output object, <obj>.export so don't need to do another export().

5. for encrypt(), decrypt(), sign(), verify(), can just put the exported key string (base64), don't need to import() first. It will automatically import inside.

6. can encrypt() the object, it will auto convert to json and when we decrypt() if it is json, it will auto convert to object.

7. there're 14 functions:
  1) xdev.random() ...int
  2) xdev.uuid() ...hex 32 digit with 4 '-' separators
  3) xdev.hash() ...hex
  4) xdev.genKey() ...x, x.export is base64
  5) xdev.encrypt() ...base64
  6) xdev.decrypt() ...utf8
  7) xdev.exportKey() ...base64
  8) xdev.importKey() ...x
  9) xdev.sign() ...base64
  10) xdev.verify() ...true|false
  11) xdev.buffer2hex() ...hex
  12) xdev.buffer2base64() ...base64
  13) xdev.base64ToBuffer() ...buffer
  14) xdev.buffer2utf8() ...utf8
  15) xdev.uuidx() ...unique timestamp
  16) xdev.utf8ToBuffer() ...buffer
  17) xdev.passKey() ...key obj
  18) xdev.promptKey() ...key obj
  19) xdev.randomW() ...char a-zA-Z
  20) xdev.genPassword() ....password with many symbols
  21) xdev.vaultAdd() ...xdev.vault base64 format
  22) xdev.vaultGet() ...get data from vault

8. will make a guide at xdev_b_guide.html  

m/20230508




*/