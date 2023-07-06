/**
 * xdev_b.js -- is a toolbox for developing software based on js & node.js. This module works on browser side. You'll need to use the xdev.js in the server too.
 * 
 * There're 2 files (a) xdev.js for xserver, (b) xdev_b.js for the xbrowser.
 * 
 * version:   0.1
 * license:   none
 * doc:       xdev-guid.html (not created yet)
 * web:       ''
 * createdDate: 20230613
 * lastUpdated: 20230628.1655
 * staff:     M 
 * 
 * #use
 *      <head>
 *          <script src="./xdev_b.js"></script>
 *      </head>
 * 
 *      <script>
 *          let el = xs.readForm2(formid)
 *          let re = $({get:'customer'})
 *      </script>
 */



//const e = require("express")

const xs = {
  //this is main object

  get info() {
    return {
      program:"xdev_b is a tool for software development. Working in web browser side and co-working with xdev server side for seamless integration.",
      web:'',
      version:'0.1',
      contact:'mutita.org@gmail.com',
      date:'2023-06-13'
    }
  },

  serverPostUrl:'/xpost',
  serverGetUrl:'/xget'

}







//data model

class Wrap {
  id = Date.now() + '-' + xs.random()
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
xs.$ = async function(x) {

  switch (Object.keys(x)[0]) {

// new block -------------------------------    

    case 'get':
      //get command to xserver/xdb
      return xs.send(x)
      break

    case 'set':
      // set msg to the xdb
      // xs.$({set:--data--, to:'xdb.product'})
      // <button onclick="xs.$({set: xs.readForm2(thisForm), to:'xdb.user'})"
      //#tested ok, m20230616
      //#note   -now if the data has _invalid property won't send to xserver, m20230701.1959

      if (x.set && x.to && !x.set._invalid) { //valid check
        /*let msg = await xs.enc(
          JSON.stringify(x),
          core.security.key 
        )*/

        xs.send(x).then(re => {
          return re //! need to check this further
        })
      } else {
        alert("Fail, there's invalid data. \nPlease correct it and try again. \nThank you.")
      }

      break

//----------------------------------------

    case 'xcert':
      /**
       * xdev.$({
       *    xcert:--msg--, 
       *    key:--key--, 
       *    sig:--sig-- 
       * })
       * 
       * to sign just put msg & key
       * to verify put all the msg, key and signature
       */

      if (x.xcert && x.key && !x.sig) {
        //sign
        return xs.xcert(x.xcert, x.key)

      } else if (x.xcert && x.key && x.sig) {
        //verify
        return xs.xcert(x.xcert, x.key, x.sig)
      
      } else {
        return 'ERROR: wrong input'
      }

      break
      //ok, m20230519


    case 'genKey':

      if (x.genKey == 'aes') {
        return xs.genKey()
      }

      break


    case 'encrypt':
      return xs.encrypt(x.encrypt, x.key)
      break


    case 'decrypt':
      return xs.decrypt(x.decrypt, x.key)
      break

      
  }
}




//-----------crypto-------------------------------------
// default algor = AES-GCM

//1-----------------------------------------
xs.random = function () {
  //re Uint32Array, the random is in the re[0] eg, 3660119685

  const arr = new Uint32Array(1) //1
  return self.crypto.getRandomValues(arr)
}//ok


//2-----------------------------------------
xs.uuid = function () {
  //re standard uuid eg 92798ca1-0bd5-4c32-bb9a-493c9e8050b2

  return self.crypto.randomUUID()
}//ok


//3-----------------------------------------
xs.hash = async function (words, algor=256) {
  /*  xs.hash() | .hash(2) | .hash(256) | ...

      #eg  xs.hash('words')   ...this is default = SHA-256'
          xs.hash('words',3)    ...this is SHA-384
      #status: ok
      #testBy: m   
  */

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
xs.xcert = async function (msg, key, sig) {
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

    return xs.hash(msg + key)
  
  } else if (msg && key && sig) {
    //verify
    if (typeof msg != 'string' || typeof key != 'string' || typeof sig != 'string') {
      return 'ERROR: input type'
    }

    let _sig = await xs.hash(msg + key)
    return (_sig == sig)? true:false

  } else {
    return 'ERROR: wrong input'
  }

  //ok, m20230519
}









//5-----------------------------------------
xs.genKey = async function (algor='aes') {
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

    key.export = await xs.exportKey(key,'hmac')
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

    key.export = await xs.exportKey(key)
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
xs.enc = async function ( msg, key) {
  //msg must be string or non-object
  //if msg is number, it treats as '123456'
  //if msg is [111,222], treats as '111,222'
  return xs.encrypt( msg, key)
}//ok, make it a little bit shorter



xs.encrypt = async function( msg, key) {
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

  return xs.buffer2base64(iv_) + xs.buffer2base64(cx)
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
xs.buffer2hex = function (buffer) {
  //  xdev.buffer2hex(buffer) ...gets hex code

  //buffer to hex
  const arr = Array.from(new Uint8Array(buffer))

  const hex = arr.map(
    (b) => b.toString(16).padStart(2,'0')
  ).join('')

  return hex    
}//ok



//8-----------------------------------------
xs.buffer2base64 = function (buffer) {
  //  xdev.buffer2base64(buffer) ...gets base64 codes

  const st = String.fromCharCode.apply(
    null,
    new Uint8Array(buffer)
  )
  return window.btoa(st)
}//ok



//9-----------------------------------------
xs.base64ToBuffer = function (base64) {
  //  xdev.base64ToBuffer(base64) ...gets buffer

  return new Uint8Array(
    atob(base64).split('').map(c => c.charCodeAt(0))
  )
}//ok



//10-----------------------------------------
xs.buffer2utf8 = function (buffer) {
  //  xdev.buffer2utf8(buffer) ...gets utf8 codes

  return new TextDecoder('utf-8').decode(
    new Uint8Array(buffer)
  )
}//ok









//11------------------------------------------------------
xs.dec = async function (cx, key) {
  return xs.decrypt(cx, key)
}


xs.decrypt = async function (cx, key) {
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
xs.exportKey = async function(key, format='aes') {
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

    return xs.buffer2base64(key_) //don't put the PEM wrapper  
  
  } else {
    return 'ERROR! wrong input'
  }

  
}//ok for pri & pub keys, now doing for jwk



//13-----------------------------------------
xs.importKey = async function(key,format='aes') {
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
xs.sign = async function (msg, key, algor='hmac') {
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
  
    return xs.buffer2base64(buffer)
    //ok

//HMAC    
  } else if (algor=='hmac') {
    //this is default for signing

    //if key not obj make it obj
    try {
      if (key.match(/^[0-9a-zA-Z/=+]+$/)) {
        //the key is the exported one not obj
        key = await xs.importKey(key,'hmac')
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
    return xs.buffer2hex(buffer)
    //ok
  }
  
  
}


//15-------------------------------------------------
xs.verify = async function (msg, signature, key, algor='hmac') {
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
      xs.base64ToBuffer(signature),
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
        key = await xs.importKey(key,'hmac')
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
/*
xs.uuidx = function() {
  //gen special uuid which is simply a timestamp but no dup
  //to prevent dup, we take t2 not t1
  let t1 = t2 = Date.now()
  while (t2 == t1) { t2 = Date.now()}
  return t2
}//ok
*/

xs.uuidx = function() {
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



//17---------------------------------------------
xs.utf8ToBuffer = function (msg) {
  return new TextEncoder().encode(msg)
}//ok



//18---------------------------------------------
xs.passKey = async function (passHash) {
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
      salt: xs.utf8ToBuffer('xTKrg5fX-9l_'), //fix this
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
xs.promptKey = async function () {
  //gen an AES-GCM key from user prompt's password

  return await xs.passKey(
    await xs.hash(
      prompt('password:')
    )
  )
}//ok


//20------------------------------------------------
xs.promptHash = async function () {
  //prompt to get words and gen hash from it

  return xs.hash(
    prompt('words:')
  )
}




//21------------------------------------------------
//randomW is a random code tha containing only a-zA-Z nothing else
xs.randomW = function (length=16) {
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
xs.password = function (length=12) {
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
xs.vaultAdd = async function (x) {
  /**
   * xs.vaultAdd() v0.1 m20230613
   * 
   * This func creates and encrypted message from user's input and put in the xs.vault . After that user can get data back by using the xs.vaultGet(). These 2 func will prompt for password to use for encrypt/decrypt. User can continue to add more secret data into it and retrieve when she needs, by supplying the correct password.
   * 
   * xs.vaultAdd({name:'john', label:value, label:value, ...})
   * 
   * #devnote
   * - fixed bug on block 2: not work for number value, now fixed. 
   * - changed returning error to obj-based
   * m20230613
   *  
   */

  //check input must be obj and not blank, not array
  if (!x || typeof x != 'object' || !Object.keys(x).length
    || Array.isArray(x)) return {
      
      func:'xs.vaultAdd()',
      success: false,
      msg:"wrong input"
    }

  //reject if found any empty label 
  for (label in x) {
    if (x[label] == '') return {
      
        func:'xs.vaultAdd()', 
        success: false, 
        msg:"wrong label"
      }  
  }


  //get labels

  if (Object.keys(x).length > 1) {
    //has several labels-----------------------

    if (!xs.vault) {
      //firstly add
      xs.vault = await xs.enc(
        JSON.stringify(x), 
        await xs.promptHash() //prompt for pass and then hash it
      )

    } else {
      //more add if the xs.vault already exist

      let key = await xs.promptHash() //prompt for pass
      let gold = JSON.parse(
        await xs.dec(xs.vault, key)
      ) 

      for (label in x) {
        if (label in gold) {
          //this is dup, just skip
          console.log(`ERROR/vaultAdd: lebel '${label}' is already existed, skipped`)
        } else {
          gold[label] = x[label]
        }
      }

      xs.vault = await xs.enc(
        JSON.stringify(gold), 
        key
      )
    }

    

  } else {
    //has only 1 label-------------------------
     
    //if vault not already existed
    if (!xs.vault) {

      //firstly add
      xs.vault = await xs.enc(
        JSON.stringify(x),  
        await xs.promptHash()
      )

    } else {
      //if vault already existed
      let key = await xs.promptHash()
      
      let gold = JSON.parse(
        await xs.dec(xs.vault, key)
      ) 
      let label = Object.keys(x)

      if (label in gold) {
        //dup
        return {
          func:'xs.vaultAdd()',
          success: false,
          msg:'label already existed, skipped'
        }

      } else {
        //label not duplicated
        gold[label] = x[label]

        xs.vault = await xs.enc(
          JSON.stringify(gold), 
          key
        )
      }
    }
  }
 
}//ok



//24----------------------------------------------
xs.vaultGet = async function (label) {
  /**
   * xs.vaultGet() v0.1
   * 
   * This func gets data that encrypted by the xs.vaultAdd() and then prompt for the user's password. If password correct it returns the data of the label the user supplied.
   * 
   *  xs.vaultGet('label')
   * 
   *  label is the key of data that added by the func xs.vaultAdd()
   * 
   * #devnote
   * - finished some codes, change error to obj-base, tested. m20230613
   */

  if (!label || typeof label != 'string') return {
    func:'xs.vaultGet()',
    success: false,
    msg:'wrong input, nothing done'
  }

  let gold = JSON.parse(
    await xs.dec( 
      xs.vault, 
      await xs.promptHash()
    )
  ) 
  
  if (label in gold) {
    return gold[label]
  } else {
    return {
      func:'xs.vaultGet()',
      success: false,
      msg:'wrong label'
    } 
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
xs.db = function (x) {
  /**
   * xs.db() v0.1 20230613
   * 
   * This is very simple database utilizing the browser's localStorage to store data. It behaves like a data base so you can read and write data into it.
   * 
   * #sample
   *    
   *    xs.db()   ...this is the read of the whole db
   *    xs.db().goods   ...read and select for the 'goods' collection
   *    xs.db( {collection:{...}} )   ...this creates new collection and inserts obj data into it
   * 
   * 
   * #devnote
   * - review codes m20230613
   * 
   *  
   */

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
              doc._id = xs.uuidx() //assign id to each doc
              db[col].push(doc)
            }
  
          } else { //1 doc
            x[col]._id = xs.uuidx()
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
                doc._id = xs.uuidx()
                db[col].push(doc) //push into existing col
              } 
  
            } else {
              //add 1 doc to existing col
              x[col]._id = xs.uuidx()
              db[col].push( x[col] )
            }
  
          } else {
            //new col
            db[col] = []
  
            if (Array.isArray( x[col] )) {
              //newly add many docs
  
              for (doc of x[col]) {
                doc._id = xs.uuidx()
                db[col].push(doc)
              }
  
            } else {
              //newly add 1 doc
              x[col]._id = xs.uuidx()
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
xs.atime = function (same='hour') {

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
xs.acode = async function (t=24) {
  //this is another simple kind of certifying an html doc

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

  return await xs.hash(
    document.body + xs.atime(t)
  )
}



//28------------------------------------------
xs.send = function (value, urlToSendTo=XBROWSER.xserver.postUrl) {
  //seal the data and wrap it and send to the server
  /**
   * xs.send() -- wraps obj and send to xserver in POST method. When get response from the xserver, it unwraps then return the msg out to the caller.
   * 
   * #use     let re = xs.send({...})
   * #test    OK, m20230628 
   * #note    use Promise inside the f to easier returning output
   * #staff   M
   */

  return new Promise((resolve,reject) => {

    //A - check server post url
    if (urlToSendTo == '') {
      reject(
        {from:'xs.send()',
        success: false,
        msg:'Wrong input.'}
      ) 
    }

    //log
    XBROWSER.sendLog.req = value 
    XBROWSER.sendLog.resp = '' //reset the value of resp 


    //convert, wrap
    if (typeof value == 'object') value = JSON.stringify(value)
    
    xs.wrap(value).then(wrapped => {

      fetch(
        urlToSendTo,
        {
          method:   'POST',
          headers:  {'Content-Type':'application/json; charset=utf-8'},
          body:      JSON.stringify(wrapped)
        }
      
      ).then( re => {
        //console.log(resp) //resp obj
        return re.json() //make it json
      
      }).then( re => {
        //work on the resp here
        //xs._send.resp = resp
  
        if (re.wrap) {
  
          //XBROWSER.sendLog.resp = re
  
          xs.unwrap(re).then(msg => {
            //console.log(msg)
            XBROWSER.sendLog.resp = msg 
  
            if (msg.msg && msg.from) {
              //this is resp from xs.$set command
  
              alert(`Msg: ${msg.msg}\nFrom: ${msg.from}\nid: ${msg.id}\nTime: ${msg.time}`)
            
            } else {
              //this is resp from xs.$get command
              console.log("Got data from the server.")
            }
  
            resolve(msg)  //unwrapped msg
          })
  
  
        } else {
          XBROWSER.sendLog.resp = re 
          //if not wrap just put it in
          resolve(re) 
        }
  
      })/*.catch(
        reject({
          msg:      "Fail sending.",
          success:  false,
          from:     'xs.send()'
        })
      )*/

    })

  })//promise block 
  
}//ok /m 20230512 


xs.send2 = async function (value) {
  /**
   * func: xs.send2() 
   * for: enhancing from xs.send() to include some data wrapping & encryption inside it.
   * staff: M
   * created: 20230615
   * 
   * #use
   *      xs.send2(formEl | any value)
   *      xs.send2(form1) 
   */

  if (value instanceof HTMLFormElement) {
    let formx = xs.readForm2(value)

    let cipher = await xs.$({
      encrypt: JSON.stringify(formx),
      key:     XBROWSER.security.key
    })

    xs.send({wrap: cipher})

  }
} 


xs.wrap = async function(data,key=XBROWSER.security.key) {
  //wrap data before sending to xserver
  //let w = await xs.wrap(obj)
  //returns {wrap:'--base64 encrypted string--'}
  //#tested ok, m20230616

  if (typeof data == 'object') {
    data = JSON.stringify(data)
  }

  return {
    wrap: await xs.enc(data, key)
  }
}


xs.unwrap = async function(wrappedObj,key=XBROWSER.security.key) {
  //unwrap wrapped-data
  //let uw = await xs.unwrap(wrapObj)
  //return data before wrapping, if it's obj it gives you obj
  //#tested ok, m20230616

  if (wrappedObj.wrap) {
    let re = await xs.dec(wrappedObj.wrap, key)
    
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


xs.isJson = function(sample) {
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


xs.isHex = function (sample) {
  //check if the input hex or not, returning true or false
  //#tested ok, m20230616

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




//29-----------------------------------------------------
xs.readForm = function (formid) {
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


xs.readForm2 = function (el_s, validRule={}, noticeStyle='1px solid orange') {
  /**
   * xs.readForm2() upgrade the xs.readForm() 
   * version: 0.1
   * mutita.org@gmail.com
   * 
   * #input
   * @param {HTMLElement | string} el_s - element of the form 
   *    can be both el & string
   *    if it's html element, the func just take it
   *    if it's string, the func will use it to search for the el
   * 
   * @param {object} validRule - put the validation rule
   *    can be from the form ele's _validRule , or an obj
   *    noticeStyle is set with default but can be changed
   * 
   * #output
   *    {field1:--, field2:--, ...}
   *    if there's invalid will get ... name:'<invalid>' and the property outputObject._invalid:true will also added
   * 
   * #use
   *    xs.readForm2( document.querySelector('form') )
   *    xs.readForm2('#formid')
   * 
   * #devnote
   *    -tested ok, 
   *    -put the else block in work() to read all type el in the form and just put strait el.value. May need watching on this do we need to specify the type of input to work more rather than the radio, checkbox, submit? 
   * 
   * #bug
   *    -fixed wrong reading of radio, done /m20230614
   * 
   * #lastUpdate: 20230614.0809
   * #staff: M
   * 
   */

  //init
  let outputx = {}

  //check input
  if (el_s instanceof HTMLFormElement) {
    //this is the ready el, just take it
    return work(el_s)     

  } else if (typeof el_s == 'string') {
    //this is string, so need to find the el first
    el_s = document.querySelector(el_s)
    return work(el_s)

  } else {

    let re = {
      func:'xs.readForm2',
      success: false,
      msg:'wrong input, must be string or html element'
    }

    XBROWSER.readFormLog = re //keep in log ...!not work
    return re
  }


  /**
   * Helps the xs.readForm2 to get value from the form.
   * @param {string | HTMLElement} el 
   * @returns {object} - containing form data as properties
   * @version 0.1
   * @author M 
   * @time 20230702.1116
   * @test OK, but working on enhancement
   */
  function work(el) {
    //get value from the input 'el' and put in 'outputx'

    if (Object.keys(validRule) == '' ) {
      eval('validRule =' + el.getAttribute('_validRule') )
      //if no user's validRule, get it from attribute, if both are none just keep it right there (output will be true if no rule)
    }

    if (validRule == null) validRule = {}


    for (e of el) { //loop form ele

      if (e.type == 'textarea') {
        outputx[e.name] = e.value

        if ( xs.validate(outputx[e.name], validRule[e.name]) ) {
          //pass
          if (e.style.border == noticeStyle) e.style.border = ''
        } else {
          //invalid
          outputx[e.name] += '<invalid>'
          e.style.border = noticeStyle
          outputx._invalid = true 
        }
      }  

      else if (e.type == 'radio') {
        if (e.name in outputx) {
          //skip if already get into the output
        } else {
          outputx[e.name] = el[e.name].value
          //this call get the: el.nameOfinput.value

          if ( xs.validate(outputx[e.name], validRule[e.name]) ) {
            //pass
            if (e.parentElement.tagName == 'DIV' && e.parentElement.hasAttribute('_input-frame')) {
              //there's a div box so we can give notice
              e.parentElement.style.border = '' //reset if any
            }

          } else {
            //invalid
            if (e.parentElement.tagName == 'DIV' && e.parentElement.hasAttribute('_input-frame')) {
              outputx[e.name] = '<invalid>' 
              e.parentElement.style.border = noticeStyle
              outputx._invalid = true
            }
             
          }
        }
      }//ok  
      
      else if (e.type == 'checkbox') {

        if (e.name in outputx) {
          if (e.checked) outputx[e.name].push(e.value)
          //this is existing checkbox name, so just add to the end
        } else {
          if (e.checked) {
            outputx[e.name] = [e.value]
          } else {
            outputx[e.name] = [] //put blank in
          }
          //this is new checkbox name
        }

        //check value in the checkbox
        let lastIndexOfCheckbox = el[e.name].length -1 

        if (e.value == el[e.name][lastIndexOfCheckbox].value) {
          //this is last ele of the checkbox group
          if ( xs.validate(outputx[e.name], validRule[e.name]) ) {
            //valid
            if (e.parentElement.tagName == 'DIV' && e.parentElement.hasAttribute('_input-frame')) {
              e.parentElement.style.border = ''
            }

          } else {
            //invalid
            if (e.parentElement.tagName == 'DIV' && e.parentElement.hasAttribute('_input-frame')) {
              outputx[e.name] = '<invalid'
              e.parentElement.style.border = noticeStyle
              outputx._invalid = true 
            }

          }
        }
      }

      else if (e.type == 'submit') {} //don't do thing

      else {
        //for all the rest of input types
        //the <select> is also in this block

        if (!e.disabled) { //if not disabled
          outputx[e.name] = e.value 

          if ( xs.validate(outputx[e.name], validRule[e.name]) ) {
            //pass
            if (e.style.border == noticeStyle) e.style.border = ''           
          } else {
            //invalid
            outputx[e.name] += '<invalid>'
            e.style.border = noticeStyle
            outputx._invalid = true
          }
        }
      }

    }
    return outputx

  }
}






//30-----------------------------------------
xs.jsonify = function (x) {
  /**
   * make little shorter of the JSON.stringify()
   */

  if (typeof x != 'object') return false 
  return JSON.stringify(x)
}


//31-----------------------------------------
xs.jparse = function (j) {
  /**
   * little shorter JSON.parse()
   */

  try {
    let read = JSON.parse(j)
    if (typeof read == 'object') return read 
    else return false 
  } catch {
    return false 
  }
}

/**
 * xs.showData - show data in object or array to html elements.
 * @param {object} data - {name: ,age: ,sex: , ...}
 * @param {HTMLElement} toElement - table, ol, ul, select, ...
 * @param {object} opt - {tableHeader:'Name Age Sex'}
 * @returns html element that shows the input data
 * @version 0.1
 * @author M 
 * @tested OK m20230702.1722
 */
xs.showData = async function (data, toElement, opt) {
  /**
   * xs.showData() -- takes data in array or obj or any format and show it in the specified html element.
   * 
   * #test  OK for table now m-20230628.2245
   * #note  -auto make table header is done but needs enhance to make it Title case and in case the first x in a is not completed heading may need to do something to complete it.
   *        -the _table-header option for table is OK now, m20230629.1034
   */

  //create obj to keep some var
  if (!XBROWSER.showDataSpace) {
    XBROWSER.showDataSpace = {
      data: data,
      toElement: toElement,
      opt: opt,
      index: 0 //default starting pointer if data is array
    }
  }  

  //so the input can be all blank and then the f will take from its space
  if (!data) data = XBROWSER.showDataSpace.data 
  if (!toElement) toElement = XBROWSER.showDataSpace.toElement 
  if (!opt) opt = XBROWSER.showDataSpace.opt 


  //each type of ele needs different format so each following blocks handle formats
  if (toElement.tagName == 'TABLE') {
    let htmlCode = ''
    var noPresetTableHeader 

    //make header ... opt = {tableHeader:'aaa bbb ccc'}
    if (opt && opt.tableHeader) {
      opt.tableHeader = opt.tableHeader.split(' ')
      htmlCode += '<tr>'

      opt.tableHeader.forEach(h => {
        htmlCode += '<th>' + h + '</th>'
      })
      
      htmlCode += '</tr>'
      toElement.innerHTML = htmlCode
    
    } else {
      //if not, will auto make header from the data
      noPresetTableHeader = true 
    }

    //make table body
    if (data) {
      if (noPresetTableHeader) {
        //make header from data
        htmlCode += '<tr>'
        for (k in data[0]) {
          htmlCode += '<th>' + xs.toTitleCase(k) + '</th>'
        }
        htmlCode += '</tr>'
      }

      //make table body
      data.forEach(d => {
        htmlCode += '<tr>'
        for (k in d) {
          htmlCode += '<td>' + d[k] + '</td>'
        }
        htmlCode += '</tr>'
      })
      toElement.innerHTML = htmlCode 
    }
  
  //select    
  } else if (toElement.tagName == 'SELECT') {
    let htmlCode = ''
    data.forEach(choice => {
      htmlCode += '<option>' + choice[Object.keys(choice)[0]] + '</option>'
    })
    toElement.innerHTML = htmlCode
  
  //list
  } else if (toElement.tagName?.match(/OL|UL/)) {
    let htmlCode = ''
    data.forEach(list => {
      htmlCode += '<li>' + list[Object.keys(list)[0]] + '</li>'
    })
    toElement.innerHTML = htmlCode 
  } 


  //form
  else if (toElement.tagName == 'FORM') {
    if (!XBROWSER.showDataSpace.index) {
      XBROWSER.showDataSpace.index = 0 //pointer to the obj in array
    } 
    let index = XBROWSER.showDataSpace.index //shorter

    

    if (Array.isArray(data)) {
      //the data is array, assuming that it is array of obj
      //start with the first obj, array[0]
    
      //top controller
      if (index < 0) {
        //cannot lower than 0
        XBROWSER.showDataSpace.index = 0
        return false 
      } else if (index > (data.length - 1)) {
        //cannot > max record
        XBROWSER.showDataSpace.index = data.length - 1 
        return false
      } else {
        //show index at the top controller
        _showDataIndex.value = index + '/' + (data.length - 1) 
      }
    
      //enable the < > controls
      _goLeft.disabled = _goRight.disabled = _goMostLeft.disabled = _goMostRight.disabled = false 

      //loop form's fields
      for (el of toElement) {
        if (el.type == 'submit') {/*skip*/}

        else if (el.type == 'date') {
          if (data[index][el.name]?.match(/^\d{4}-\d{2}-\d{2}/) ) {
            //data is iso date format, correct
            el.value = data[index][el.name]?.match(/^\d{4}-\d{2}-\d{2}/) //take only yyyy-mm-dd
          } else {
            //not iso date format, put null
            el.value = '' 
          }
        } else {
          //not submit & not date, most typical types
          el.value = data[index][el.name]
        }
      }


    } else if (typeof data == 'object') {
      //assumes that it is obj with fields, just fill obj fields to form

      _showDataIndex.value = '0/0' //only 1 obj shows
      //_goLeft.disabled = _goRight.disabled = true 

      for (el of toElement) {
        el.value = data[el.name]
      }
    } else {
      //wrong
      return false 
    }
            
  }


  //will show like simple obj in column way ...a very plain way
  else {
    let htmlCode = ''

    if (typeof data == 'object' && !Array.isArray(data)) {
      data = [data]
    }

    data.forEach(obj => { //loop the array
      htmlCode += '<table>'
      let count = 1
      var hideState = ''

      for (key in obj) { //loop each obj in each array index
        if (count == 1) {
          //we'll make first row 'bold' for clearer distinct each table
          htmlCode += `<tr ${hideState}><td style="width:25%"><b>` + key + '</b></td><td><b>' + obj[key] + '</b></td></tr>'
        } else {
          if (count > 5) hideState = 'hidden'
          htmlCode += `<tr ${hideState}><td style="width:25%">` + key + '</td><td>' + obj[key] + '</td></tr>'
        }
        count++
      }
      htmlCode += '</table><span style="font-size:20px;cursor:pointer;color:blue" onclick="xs.expandTable(this,this.previousSibling)" title="Click to expand or shrink this table.">+</span><br><br>'
    })

    toElement.innerHTML = htmlCode
  }
}


xs.expandTable = function(actor, tableEle) {
  /**
   * #brief
   * xs.expandTable -- helps xs.showData when the xs.showData shows data in table in a short-mode (collapsed more rows if if has many). So this func expands it.
   * 
   * #input
   * 'actor' is the element that user clicks on it, (uses symbol + & -- for user to click, below the table)
   * 'tableEle' is the table element to be expand or collapse.
   * 
   * #output -- the table will expand if it collapsed, and will collapse if it expanded.
   * 
   * #tested OK, m-20230701.1822
   */

  if (actor.innerText == '+') { //state = hide , symbol = +
    actor.innerText = '--'
    actor.style.backgroundColor = 'yellow'
    let ro = tableEle.querySelectorAll('[hidden]') 
    ro.forEach(r => r.hidden = false) //unhide
  
  } else if (actor.innerText == '--') { //state = show, -
    actor.innerText = '+'
    actor.style.backgroundColor = ''
    for (i=0; i < tableEle.rows.length; i++) {
      if (i > 4) tableEle.rows[i].hidden = true 
    }
  }
}


// autoFill ------------------------------------------------
xs.autoFill = function() {
  /**
   * xs.autoFill() -- scans through the page and automatically fill datas into the element your specified.
   * 
   * #use   just put it in the script part at bottom of the page.
   * #tested OK, m-20230628.2240
   */
  const toFill = document.querySelectorAll('[_autofill]')

  toFill.forEach(ele => {
    let commandToGetContent = ele.getAttribute('_content')
    eval('command = ' + commandToGetContent)

    xs.$(command).then(dat => {
      //now got data, will show it on ele

      //check table option
      let opt = ''

      if (ele.tagName == 'TABLE') {
        let valu = ele.getAttribute('_table-header')
        if (valu) {
          opt = {tableHeader: valu} 
        }
      }

      xs.showData(dat,ele,opt)
    })
  })
}




// make Title case ----------------------------------------
xs.toTitleCase = function (strin) {
  //xs.makeTitleCase() -- make the input string a Title case, e.g., if gets 'thailand', makes it 'Thailand'
  //#tested OK, m20230628.1947
  //needs more enhance eg if have multi-words, make it from snake, camel, etc.

  let part = strin.split(' ')

  for (i=0; i < part.length; i++) {
    var firstChar = part[i].charAt(0).toUpperCase()
    part[i] = firstChar + part[i].slice(1)
  }
  return part.join('') 
}
xs.toTitle = xs.toTitleCase 

// make camel case -------------------------------
xs.toCamelCase = function (strin) {
  //assumes input is multi words eg 'user name', makes it 'userName'
  //#tested OK, m20230628.2000

  let part = strin.split(' ')
  for (i=1; i < part.length; i++) {
    var firstChar = part[i].charAt(0).toUpperCase()
    part[i] = firstChar + part[i].slice(1)
  }
  return part.join('')
}
xs.toCamel = xs.toCamelCase 

// make snake case -------------------------------------
xs.toSnakeCase = function (strin) {
  //assumes input is multi-words or space separations
  //#tested OK, m20230628.2003

  return strin.replaceAll(' ','_')
}
xs.toSnake = xs.toSnakeCase 

//make dash case -----------------------------
xs.toDashCase = function (strin) {
  return strin.replaceAll(' ','-')
}
xs.toDash = xs.toDashCase 




/**
 * To validate the data against the rule.
 * @param {string} data - usually a string from an input field 
 * @param {object} rule - such as {name:'required;wordsOnly', ...}
 * @returns {boolean} - true is valid, false is invalid
 * @author M 
 * @version 0.1
 * @lastUpdate 20230702.1359
 * @note added notNone rule
 */
xs.validate = function(data, rule) {
  /**
   * xs.validate -- validates each data against the provided rules for that data. Returns true/false.
   * Will use this in the xdev server as well and to validate the mongodb inputting the data.
   * 
   * #input
   *    'data' -- string, usually from the form's input
   *    'rule' -- string language describing the rules such as: 'required;wordsOnly; ...'
   * 
   * #use   let isValid = xs.validate(data,'required;wordsOnly;length:4-20')
   * 
   * #output -- returns true if valid, false for invalid
   * 
   * #test  OK, for few basic features, m-20230629.1913
   */
  

  var validity = true //initialized, if any false happens, change this and return the false/invalid

  if (!rule) return true //{success:false, msg:"Wrong input.", from:'xs.validate'}
    //so if don't have rule just pass it (return true)

  let part = rule.split(';')

  part.forEach(ru => {
    ru = ru.trim()

    // required
    if (ru == 'required') {
      if (data == '' || !data) validity = false 
    } 
    
    // wordsOnly
    if (ru == 'wordsOnly') {
      if (!data.match(/^[a-zA-Z ]+$/)) validity = false  
    }

    // length:4-20
    if ( ru.match(/^length:(\d+)-(\d+)$/) ) {
      let ext = ru.match(/^length:(\d+)-(\d+)$/)
      if (data.length < Number(ext[1]) || data.length > Number(ext[2]) ) validity = false   
    }

    // value:18-60
    if ( ru.match(/^value:(\d+)-(\d+)$/) ) {
      let ext = ru.match(/^value:(\d+)-(\d+)$/)
      if (Number(data) < Number(ext[1]) || Number(data) > Number(ext[2]) ) validity = false 
    }

    // 1symbol
    if ( ru == '1symbol') {
      if ( !data.match(/[\-+*/._%^?\<\>\(\)$~!|\\= ]/) ) validity = false 
    }

    // noSymbol
    if ( ru == 'noSymbol') {
      if ( data.match(/[\-+*/._%^?\<\>\(\)$~!|\\= ]/) ) validity = false
    }

    // 1number
    if (ru == '1number') {
      if (!data.match(/\d/)) validity = false 
    }

    // numbersOnly
    if (ru == 'numbersOnly') {
      if (data.match(/\D/) ) validity = false 
    }

    // 1capital
    if (ru == '1capital') {
      if ( !data.match(/[A-Z]/) ) validity = false 
    }

    // capitalOnly
    if (ru == 'capitalOnly') {
      if (!data.match(/^[A-Z]+$/) ) validity = false 
    }

    // 1small
    if (ru == '1small') {
      if ( !data.match(/[a-z]/) ) validity = false 
    }

    // smallOnly
    if (ru == 'smallOnly') {
      if (!data.match(/^[a-z]+$/) ) validity = false 
    }

    // isoDate
    if (ru == 'isoDate') {
      let part = data.split('-')
      if (part.length != 3) validity = false
      if (part[0].length > 4) validity = false
      if ( Number(part[1]) > 12 ) validity = false
      if ( Number(part[2]) > 31 ) validity = false 
    }

    // noSpace
    if (ru == 'noSpace') {
      if ( data.match(/\s/) ) validity = false 
    }

    // 2decimal
    if (ru == '2decimal') {
      if (!data.match(/^\d+.\d{1,2}$/)) validity = false 
    }

    // notNone ...for select input, this is the same as 'required'
    if (ru == 'notNull') {
      if (data.match(/^$/i) ) validity = false 
    }

  })

  return validity   
}





/**
 * el(strin) - shorten the way to find an html element.
 * @param {string} strin -- like '#ele_id', any complies to document.querySelector
 * @returns {HTMLElement} -- the element that you can work further
 * @created 20230702.1639
 * @author m
 * @version 0.1
 * @tested OK 20230702.1645
 */
xs.el = function(strin) {
  return eval(`document.querySelector('${strin}')`)
}


/**
 * els(strin) - similar to el() but look for many elements.
 * @param {string} strin -- compliance to document.querySelectorAll
 * @returns {HTMLElement}
 * @created 20230702.1642
 * @author M
 * @version 0.1 
 * @tested OK 20230702.1645
 */
xs.els = function(strin) {
  return eval(`document.querySelectorAll('${strin}')`)
}




/**
 * xs.tableCell(ele, row, col) - easier to point to a cell in the html table.
 * @param {HTMLElement} ele 
 * @param {string|number} row
 * @param {string|number} col
 * @returns {HTMLElement} - of the cell 
 */
xs.tableCell = function (ele, row, col) {
  return ele.rows[row].cells[col]
} 



/**
 * xs.tradeVal - makes a numbers string to the trade value format.
 * @param {string} strin - numbers in string type
 * @returns {string} - like '1,234,567.50'
 */
xs.tradeVal = function(numString) {
  let fullNum = []
  var allGood = true 
  var hasDecimal, num, deci 
  let outp = []

  //validate
  if (typeof numString != 'string') numString = numString.toString()
  
  if (numString.includes('.')) {
    fullNum = numString.split('.')
    if (fullNum[0].match(/^\d+$/) && fullNum[1].match(/^\d+$/) && fullNum.length == 2 ) {
      //perfect num & decimal value
      hasDecimal = true
      allGood = true 
      num = fullNum[0]
      deci = fullNum[1]
    } else {
      allGood = false 
    }

  } else {
    //doesn't have .

    if (numString.match(/^\d+$/)) {
      //perfect num but no decimal
      allGood = true
      hasDecimal = false 
      num = numString
    }
  }

  if (allGood) {
    while (num) {
      outp.unshift( num.slice(-3) )
      num = num.slice(0,-3)
    }

    if (hasDecimal) {
      if (deci.length == 1) {
        deci = deci.toString() + '0'
      } else {
        deci = deci.match(/^\d{2}/).toString()
      }

      return outp.toString() + '.' + deci

    } else {
      return outp.toString() + '.00'
    }

  } else {
    return false //all bad 
  }
  
}









//define a global var here -----------------------------
globalThis.XBROWSER = {
  info: "This is a global object to be used across browser codes.",
  security: {
    serverid: '35af4272-c5c2-48c7-8a37-6ed1a703a3f6',
    sessionid: xs.uuid(),
    salt: 'Ac+G_^;axLHq',
    key:'c40b93b2dfb61810e5ad22d132de54b7e718d10f66a8f523379826de95dbadf1',
    serverUrl: '/xpost'
  },
  xserver: {
    getUrl: '/xget',
    postUrl: '/xpost'
  },
  sendLog: {req:'', resp:''}
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





/**
 * Devnote
 * Changed all 'xdev' object name to 'xs' so all the func/method will be in this form: xs.--func-- ,m20230613-1113
 */