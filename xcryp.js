// xcryp.js
/* test the encrypt, decrypt
*/

//set
const crypto = require("crypto")
const algorithm = "aes-256-cbc"
let initVector = crypto.randomBytes(16), 
    secureKey = crypto.randomBytes(32), 
    inputMsg = "deeji" 

console.log(inputMsg)

//encrypt
const cipher = crypto.createCipheriv(
                algorithm, secureKey, initVector)

let encMsg = cipher.update(inputMsg, "utf-8", "hex")
encMsg += cipher.final("hex")
console.log(encMsg)




//decypt
const decipher = crypto.createDecipheriv(
                    algorithm, secureKey, initVector)

let decMsg = decipher.update(encMsg, "hex", "utf-8")
decMsg += decipher.final("utf8")
console.log(decMsg)



/* NOTE
everything works fine, both encrypt & decrypt

for enc, needs initVector & secureKey then enc with the message

for dec, takes initVector, secureKey, and enc-msg to get
the original message back

*/