// cryp.js
/* test the encrypt, decrypt
*/

//set
const crypto = require("crypto")
const algorithm = "aes-256-cbc"
var initVector = crypto.randomBytes(16), 
    //secureKey = crypto.randomBytes(32), 
    inputMsg = "",  encMsg =""


console.log("init vec = "+ initVector.toString("hex"))
//console.log("sec key = "+ secureKey.toString("hex"))


//loop to gen some encrypted code
console.log("ENCRYPT:")
const qty = 10
for (i=0; i < qty; i++) {

    inputMsg = Date.now().toString()
    //inputMsg = crypto.randomBytes(32)
    //initVector = crypto.randomBytes(16)
    secureKey = crypto.randomBytes(32) 

    //encrypt
    const cipher = crypto.createCipheriv(
        algorithm, secureKey, initVector)

    encMsg = cipher.update(
        inputMsg, "utf-8", "hex")

    encMsg += cipher.final("hex")
    console.log(encMsg)

}


//decypt
const decipher = crypto.createDecipheriv(
    algorithm, secureKey, initVector)
let decMsg = decipher.update(
    encMsg, "hex", "utf-8")

decMsg += decipher.final("utf8")

console.log("DECRYPT:")
console.log("sec key = "+ secureKey.toString("hex"))
console.log("input msg = "+ inputMsg.toString("hex"))
console.log("enc msg = "+ encMsg)
console.log("dec msg = "+ decMsg)



/* NOTE
everything works fine, both encrypt & decrypt

for enc, needs initVector & secureKey then enc with the message

for dec, takes initVector, secureKey, and enc-msg to get
the original message back

*/