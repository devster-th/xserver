// genKeyPair() by nodejs

const {generateKeyPair} = require('crypto')
generateKeyPair(
  'ec', 
  {
    namedCurve:'secp256k1',
      publicKeyEncoding: {
        type:'spki',
        format:'der'
      },
      privateKeyEncoding: {
        type:'pkcs8',
        format:'der'
      }
  },
  (err, publicKey, privateKey) => {
    if (!err) {
      console.log('PRIVATE KEY:')
      console.log(privateKey.toString('base64'))
      console.log()
      
      console.log('PUBLIC KEY:')
      console.log(
        JSON.stringify(
          {
            owner:'mutita@deeji.world',
            publicKey:publicKey.toString('base64')
          }
        )
      )


    } else {
      console.log(err)
    }
  }
)

/* TEST NOTE
work --24/12/2022
*/
